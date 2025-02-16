import React, { useEffect, useRef, useState } from 'react';
const fabric = window.fabric;
import EquationDisplay from './EquationDisplay';
import '../styles/Canvas.css';

const Canvas = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;

    const canvasContainer = canvasRef.current;
    if (canvasContainer && !fabricRef.current) {
      while (canvasContainer.firstChild) {
        canvasContainer.removeChild(canvasContainer.firstChild);
      }

      canvasContainer.appendChild(canvas);

      fabricRef.current = new fabric.Canvas(canvas, {
        isDrawingMode: true,
        backgroundColor: 'white',
        width: 600,
        height: 400,
      });

      fabricRef.current.freeDrawingBrush.width = 2;
      fabricRef.current.freeDrawingBrush.color = '#000000';
    }

    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, []);

  const handleClear = () => {
    if (fabricRef.current) {
      fabricRef.current.clear();
      fabricRef.current.setBackgroundColor('white', fabricRef.current.renderAll.bind(fabricRef.current));
      setRecognizedText('');
      setError('');
    }
  };

  const handleRecognize = async () => {
    try {
      if (!fabricRef.current) {
        console.error('Canvas not initialized');
        return;
      }

      setIsLoading(true);
      setError('');

      const dataURL = fabricRef.current.toDataURL();
      const blob = await (await fetch(dataURL)).blob();

      const formData = new FormData();
      formData.append('file', blob, 'equation.png');

      const response = await fetch('http://localhost:8000/recognize', {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Remove $$ from the beginning and end of the recognized text
      setRecognizedText(data.recognized_text);
    } catch (error) {
      console.error('Error:', error.message);
      setError('Failed to recognize the equation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecognizeGemini = async () => {
    try {
      if (!fabricRef.current) {
        console.error('Canvas not initialized');
        return;
      }

      setIsLoading(true);
      setError('');

      const dataURL = fabricRef.current.toDataURL();
      const blob = await (await fetch(dataURL)).blob();

      const formData = new FormData();
      formData.append('file', blob, 'equation.png');

      const response = await fetch('http://localhost:8000/gemini_recognize', {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRecognizedText(data.recognized_text);
    } catch (error) {
      console.error('Error:', error.message);
      setError('Failed to recognize the equation with Gemini. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="main-content">
    <div className="canvas-container">
      <div
          ref={canvasRef}
          style={{
            border: '4px solid #000',
            borderRadius: '10px'
          }}
        />
        <div className="button-container">          
          <button onClick={handleRecognize} disabled={isLoading}>
            {isLoading ? 'Recognizing...' : 'Launch My Model'}
          </button>
          <button onClick={handleRecognizeGemini} disabled={isLoading}>
            {isLoading ? 'Recognizing with Gemini...' : 'Launch Gemini AI'}
          </button>
          <button onClick={handleClear}>Clear</button>
        </div>
        {error && (
          <div className="error-container">
            <p style={{ color: 'red' }}>{error}</p>
          </div>
        )}
      </div>
      <EquationDisplay recognizedText={recognizedText} />
    </div>
  );
};

export default Canvas;
