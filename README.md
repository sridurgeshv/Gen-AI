
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
