for frontend 
run  -  npm run dev

for backend 

## Installations 

```bash 
pip install fastapi uvicorn pillow 

pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

pip install gradio spaces transformers accelerate numpy requests torch torchvision qwen-vl-utils av ipython reportlab fpdf python-docx pillow huggingface_hub

pip install -q -U google-genai
```


Run - 

note - place your gemini key in line 109 of main.py file

cd to backend/app

then do 

```bash
uvicorn main:app --reload
```
