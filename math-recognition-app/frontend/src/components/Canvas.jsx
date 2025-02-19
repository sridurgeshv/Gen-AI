import React, { useEffect, useRef, useState } from 'react';
const fabric = window.fabric;
import EquationDisplay from './EquationDisplay';
import '../styles/Canvas.css';

// Create a style element with the cursor override
const addCursorStyleOverride = () => {
  const styleId = 'fabric-cursor-override';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      canvas.upper-canvas {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E") 2 22, auto !important;
      }
    `;
    document.head.appendChild(style);
  }
};

const Canvas = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [recognizedText, setRecognizedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Add global cursor override style
    addCursorStyleOverride();
    
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
        height: 500,
      });

      fabricRef.current.freeDrawingBrush.width = 2;
      fabricRef.current.freeDrawingBrush.color = '#000';
      
      // Function to override cursor on the upper canvas
      const overrideCursor = () => {
        const upperCanvas = document.querySelector('canvas.upper-canvas');
        if (upperCanvas) {
          upperCanvas.style.cursor = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z' fill='none' stroke='black' stroke-width='2'/%3E%3C/svg%3E") 2 22, auto`;
        }
      };
      
      // Apply cursor override immediately and periodically check
      overrideCursor();
      const cursorInterval = setInterval(overrideCursor, 500);
      
      return () => {
        clearInterval(cursorInterval);
        if (fabricRef.current) {
          fabricRef.current.dispose();
          fabricRef.current = null;
        }
      };
    }
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
          className="canvas-wrapper"
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