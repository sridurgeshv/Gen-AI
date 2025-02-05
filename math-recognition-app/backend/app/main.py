from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from texify.inference import batch_inference
from texify.model.model import load_model
from texify.model.processor import load_processor

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://5173-sridurgeshv-genai-f6bv7sdmxfz.ws-us117.gitpod.io/", "*"],  # Allow both localhost and 127.0.0.1
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Load the texify model and processor
model = load_model()
processor = load_processor()

@app.get("/")
async def read_root():
    return {"message": "Math Recognition API"}

@app.post("/recognize")
async def recognize_math(file: UploadFile = File(...)):
    try:
        # Read the image file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))

        # Perform OCR using texify
        results = batch_inference([image], model, processor)

        # Assuming results is a list of recognized text
        recognized_text = results[0] if results else ""

        return {"recognized_text": recognized_text.strip()}
    except Exception as e:
        return {"error": str(e)}
