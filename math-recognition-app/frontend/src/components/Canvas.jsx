import React, { useEffect, useRef } from 'react';
const fabric = window.fabric;  // Then get fabric from window object
import '../styles/Canvas.css';

const Canvas = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    // Create a canvas element with initial dimensions
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    
    // Replace the existing canvas with our new one
    const canvasContainer = canvasRef.current;
    if (canvasContainer && !fabricRef.current) {
      // Remove any existing canvas
      while (canvasContainer.firstChild) {
        canvasContainer.removeChild(canvasContainer.firstChild);
      }
      
      // Add the new canvas
      canvasContainer.appendChild(canvas);
      
      // Initialize Fabric canvas
      fabricRef.current = new fabric.Canvas(canvas, {
        isDrawingMode: true,
        backgroundColor: 'white',
        width: 600,
        height: 400
      });

      // Configure drawing settings
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
    }
  };

  const handleRecognize = async () => {
    try {
      if (!fabricRef.current) {
        console.error('Canvas not initialized');
        return;
      }
  
      const dataURL = fabricRef.current.toDataURL();
      const blob = await (await fetch(dataURL)).blob();
      
      const formData = new FormData();
      formData.append('file', blob, 'equation.png');
  
      const response = await fetch('http://localhost:8000/recognize', {
        method: 'POST',
        body: formData,
        mode: 'cors',  // Add this
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
    console.log('Recognized text:', data.recognized_text);
    // Add UI feedback here for the recognized text
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

  return (
    <div className="canvas-container">
      <div ref={canvasRef} style={{ border: '1px solid #ccc' }} />
      <div className="button-container">
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleRecognize}>Recognize</button>
      </div>
    </div>
  );
};

export default Canvas;
