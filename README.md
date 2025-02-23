# Numbuddy: AI-Powered Math Recognition
Numbuddy is a real-time handwriting recognition system for mathematical expressions, leveraging advanced AI models for precise and efficient recognition through a web interface.

## Features
- **Advanced OCR** for mathematical notation
- **Accurate LaTeX extraction and formatting**
- **Multi-modal processing** (text and images)
- **Support for multiple languages**
- **Optimized performance** with dual-model architecture

## Model Architecture
### Primary Model: LatexMind-2B-Codec
- Fine-tuned from Qwen2-VL-2B-Instruct for math recognition
- State-of-the-art performance on MathVista, DocVQA, and MTVQA
- Native LaTeX output support for precise mathematical notation
- Seamless integration with FastAPI backend

### Secondary Model: Gemini-2.0-Flash
- Fast, high-accuracy recognition for handwritten math expressions
- Optimized for real-time processing
- Reliable backup system with regular updates

## Installation
### Prerequisites
- **Node.js** (16.x or higher)
- **Python** (3.8 or higher)
- **pip** package manager

### Note: For linux or cloud based users run this command in backend/app folder 

```bash
sudo apt-get update && sudo apt-get install -y libgl1-mesa-glx
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`.

### Backend Setup
```bash
cd backend/app
pip install -r requirements.txt
```
1. Open `main.py`.
2. Locate **line 157**.
3. Replace `YOUR_API_KEY` with your Gemini API key.

Start the backend server:
```bash
uvicorn main:app --reload
```
Backend API will be available at `http://localhost:8000`.

## Usage
- Upload handwritten mathematical expressions.
- Receive accurate LaTeX output.
- Utilize the web interface for real-time processing.

## License
This project is licensed under the MIT License.

## Video Demo
For a comprehensive overview of the application's features and functionality, please watch our [video demonstration](https://youtu.be/Nd51CygnFpg). This walkthrough provides detailed guidance on effectively using and navigating NumBuddy.

---
### Contributing
Feel free to submit issues and pull requests to improve the project!
