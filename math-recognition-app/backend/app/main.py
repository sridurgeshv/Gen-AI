from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageFilter
import io
import re
import torch
from transformers import Qwen2VLForConditionalGeneration, AutoProcessor
import numpy as np
import cv2
from qwen_vl_utils import process_vision_info  # Make sure to import the necessary utility
from google import genai


# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://5173-sridurgeshv-genai-f6bv7sdmxfz.ws-us117.gitpod.io/", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Load model, tokenizer, and processor
model = Qwen2VLForConditionalGeneration.from_pretrained(
    "prithivMLmods/LatexMind-2B-Codec", torch_dtype="auto", device_map="auto"
)

# Ensure the model uses CPU if no GPU is available
device = torch.device("cpu")  # Force the model to use CPU
model.to(device)

processor = AutoProcessor.from_pretrained("prithivMLmods/Qwen2-VL-OCR-2B-Instruct")

# Image preprocessing function
def preprocess_image(image: Image) -> Image:
    # Convert the image to grayscale
    gray_image = image.convert("L")

    # Apply a threshold to binarize the image (convert to black and white)
    np_image = np.array(gray_image)
    _, threshold_image = cv2.threshold(np_image, 150, 255, cv2.THRESH_BINARY)

    # Convert the threshold image back to a PIL image
    threshold_image_pil = Image.fromarray(threshold_image)

    # Optional: Apply some noise removal
    threshold_image_pil = threshold_image_pil.filter(ImageFilter.MedianFilter(3))

    return threshold_image_pil


def format_plain_text(latex_equation: str) -> str:
    """
    Converts LaTeX mathematical expressions into a human-readable plain text format.
    - Ensures no unnecessary trailing characters.
    - Corrects mathematical notation.
    """
    # Remove LaTeX delimiters like $$...$$ or \[...\]
    formatted = re.sub(r'^\$\$|\$\$$', '', latex_equation)  # Remove `$$ ... $$`
    formatted = re.sub(r'\\\[|\]', '', formatted)  # Remove `\[ ... \]`
    
    # Replace common LaTeX math symbols with readable text
    replacements = {
        r'\\frac{([^}]+)}{([^}]+)}': r'(\1/\2)',  # Convert fraction \frac{a}{b} → (a/b)
        r'\\sqrt{([^}]+)}': r'√(\1)',  # Convert \sqrt{a} → √(a)
        r'\\sin': 'sin', r'\\cos': 'cos', r'\\tan': 'tan',  # Trigonometric functions
        r'\\int_{([^}]+)}^{([^}]+)}': r'∫_{\1}^{\2}',  # Definite integral notation
        r'\\int': '∫',  # Generic integral
        r'\\sum': '∑', r'\\prod': '∏',  # Summation and product
        r'\\cup': '∪', r'\\cap': '∩',  # Union and intersection
        r'\\left\(': '(', r'\\right\)': ')',  # Remove LaTeX `\left(` and `\right)`
        r'\\begin{bmatrix}': '[', r'\\end{bmatrix}': ']',  # Matrices
        r'\\infty': '∞',  # Infinity symbol
        r'\\rightarrow': '→', r'\\to': '→',  # Arrows
        r'\\geq': '≥', r'\\leq': '≤', r'\\neq': '≠',  # Inequalities
        r'\\cdot': '·',  # Dot product
        r'\\, dx': ' dx'  # **Remove backslash before dx**
    }

    # Apply all replacements
    for latex, plain in replacements.items():
        formatted = re.sub(latex, plain, formatted)

    # **Remove trailing backslashes (\) or unnecessary spaces**
    formatted = formatted.rstrip('\\').strip()

    return formatted

# Endpoint to process math recognition
@app.post("/recognize")
async def recognize_math(file: UploadFile = File(...)):
    try:
        # Read the uploaded image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Preprocess the image
        preprocessed_image = preprocess_image(image)

        # Prepare inputs for the model (processor handles both text and image inputs)
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "image": preprocessed_image,
                    },
                    {"type": "text", "text": "Recognize the mathematical expression in this image."},
                ],
            }
        ]
        
        # Prepare the text and image inputs for the model
        text = processor.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        image_inputs, video_inputs = process_vision_info(messages)
        inputs = processor(
            text=[text],
            images=image_inputs,
            videos=video_inputs,
            padding=True,
            return_tensors="pt",
        )
        inputs = inputs.to(device)  # Ensure inputs are moved to the same device (CPU)

        # Generate the output (latex or mathematical expression)
        generated_ids = model.generate(**inputs, max_new_tokens=128)
        generated_ids_trimmed = [
            out_ids[len(in_ids):] for in_ids, out_ids in zip(inputs.input_ids, generated_ids)
        ]
        
        # Decode the result and clean up the output
        output_text = processor.batch_decode(
            generated_ids_trimmed, skip_special_tokens=True, clean_up_tokenization_spaces=False
        )

        # Clean up the recognized text by removing unnecessary tokens
        cleaned_text = output_text[0].replace("<|im_end|>", "").strip()

        if cleaned_text.startswith("$$") and cleaned_text.endswith("$$"):
           cleaned_text = cleaned_text[2:-2]

       # Format the recognized text into a readable format
        formatted_text = format_plain_text(cleaned_text)

        print(f"Recognized Text: {formatted_text}")  # Print recognized text to debug

        # Return the cleaned and formatted text
        return JSONResponse(content={"recognized_text": formatted_text})

    except Exception as e:
        print(f"Error: {str(e)}")  # Print error to debug
        return JSONResponse(content={"error": str(e)}, status_code=500)
    
client = genai.Client(api_key="YOUR_API_KEY")

@app.post("/gemini_recognize")
async def recognize_math_gemini(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=[image, "Recognize the equation in this image."]
        )
        return JSONResponse(content={"recognized_text": response.text})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/solve_equation")
async def solve_equation(equation_data: dict):
    try:
        equation = equation_data.get("equation")
        
        prompt = f"""Given the equation: {equation}
        Solve step by step with this exact format:
        Let's solve this step by step:
        
        Step 1: Understand the problem
        [brief explanation]
        
        Step 2: [action]
        [brief result]
        
        Step 3: [action]
        [brief result]
        
        Conclusion: [final answer]
        """
        
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[prompt]
        )
        
        # Clean and format the solution
        solution = response.text.strip()
        # Ensure consistent line breaks
        solution = solution.replace('\r\n', '\n').replace('\r', '\n')
        # Remove extra blank lines
        solution = '\n'.join(line for line in solution.split('\n') if line.strip())
        
        return JSONResponse(content={"solution": solution})
    except Exception as e:
        return JSONResponse(
            content={"error": f"Failed to solve equation: {str(e)}"}, 
            status_code=500
        )

@app.post("/api/update-user")
async def update_user(user_data: dict):
    try:
        # Here you would typically store this in your database
        # For now, we'll just return success response
        return JSONResponse(content={"message": "User updated successfully"})
    except Exception as e:
        return JSONResponse(
            content={"error": f"Failed to update user: {str(e)}"}, 
            status_code=500
        )

  
@app.post("/live_recognize")
async def recognize_math_gemini(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        response = client.models.generate_content(
            model="gemini-2.0-flash", contents=[image, "Recognize the equation in this image."]
        )
        return JSONResponse(content={"recognized_text": response.text})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)     
