# Numbuddy: AI Math Recognition Application
This application implements a handwriting recognition system for mathematical expressions using two models: a custom LatexMind-2B-Codec model (based on Qwen2-VL-2B-Instruct) and Google's Gemini-2.0-Flash model. The system provides real-time recognition of handwritten mathematical equations through a web interface.

## Model Architecture
### Primary Model: LatexMind-2B-Codec
The application primarily uses LatexMind-2B-Codec, a fine-tuned version of Qwen2-VL-2B-Instruct, chosen for its specialized capabilities in mathematical expression recognition.

## Key Features

- Advanced OCR capabilities for mathematical notation

- Specialized LaTeX extraction and formatting

- Multi-modal processing (text and images)

- Support for various image resolutions and aspect ratios

- Multilingual support including European languages, Chinese, Japanese, Korean, Arabic, and Vietnamese


## Model Selection Rationale
Specialized Training: Fine-tuned specifically for mathematical expression recognition

Performance: State-of-the-art results on benchmarks like MathVista, DocVQA, and MTVQA

Format Compatibility: Native support for LaTeX output, crucial for mathematical notation

Integration Capabilities: Easy integration with FastAPI backend and web frontend

## Secondary Model: Gemini-2.0-Flash
### Implemented as a complementary mathematical recognition engine:

### Key Features for Math Recognition
- Fast and accurate recognition of handwritten mathematical expressions

- Enhanced performance at twice the speed of previous versions

- Robust handling of complex mathematical notations

- Support for various mathematical writing styles

# Model Selection Rationale

Speed: Optimized for quick response times in recognition tasks

Accuracy: Strong performance in mathematical symbol recognition

Reliability: Serves as an effective backup recognition system

Regular Updates: Continuous improvements to recognition capabilities

### Getting Started
### Prerequisites

- Node.js (16.x or higher)
- Python (3.8 or higher)
- pip package manager


## Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:3000` (or your configured port).

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/app
```
2. Install required Python packages:
```bash
pip install fastapi uvicorn pillow
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install gradio spaces transformers accelerate numpy requests torch torchvision qwen-vl-utils av ipython reportlab fpdf python-docx pillow huggingface_hub
pip install -q -U google-genai
pip install opencv-contrib-python
pip install opencv-python
```

3. Configure Gemini API:
- Open `main.py`
- Locate *line 113*
- Replace `YOUR_API_KEY with your Gemini API key`

4. Start the backend server:
```bash
uvicorn main:app --reload
```
The backend API will be available at `http://localhost:8000.`
