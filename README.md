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

### Note 
The application defaults to CPU processing because of which the response flow will be little slower while The LatexMind-2B-Codec model effectively recognizes handwritten equations but works best with clear handwriting. It supports LaTeX formatting, though complex expressions may need slight adjustments. High-resolution images ensure optimal accuracy. While it excels at recognizing math expressions, multi-step problem-solving may require some user input.

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
- Users can draw equations, and the component will send the image to an AI model for recognition.
- Users can choose between "LatexMind-2B-Codec" and "Gemini AI" for equation recognition.
- Receive accurate formatted LaTeX output along with it's solution.
- Utilize the web interface for real-time processing.
- Allows users to enable or disable the webcam.
- Takes a snapshot from the video feed and sends it to a backend for text recognition.
- Sends recognized text to a backend API for solving mathematical expressions.
- Shows the extracted equation and its computed solution.

## License
This project is licensed under the MIT License.

## Video Demo
For a comprehensive overview of the application's features and functionality, please watch our [video demonstration](https://youtu.be/Nd51CygnFpg). This walkthrough provides detailed guidance on effectively using and navigating NumBuddy.

---
### Contributing
Feel free to submit issues and pull requests to improve the project!
