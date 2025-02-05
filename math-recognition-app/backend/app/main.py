from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pytesseract
from PIL import Image
import io

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],  # Allow both localhost and 127.0.0.1
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    return {"message": "Math Recognition API"}

@app.post("/recognize")
async def recognize_math(file: UploadFile = File(...)):
    try:
        # Read the image file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        # Convert to grayscale
        image = image.convert('L')
        
        # Perform OCR
        text = pytesseract.image_to_string(image, config='--psm 6')
        
        return {"recognized_text": text.strip()}
    except Exception as e:
        return {"error": str(e)}

