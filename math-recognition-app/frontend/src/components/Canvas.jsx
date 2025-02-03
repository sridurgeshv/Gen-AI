import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric'; // Ensure correct import for fabric

const Canvas = () => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

  useEffect(() => {
    // Ensure the canvas is only initialized once
    if (!fabricRef.current) {
      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: 600,
        height: 400,
        backgroundColor: 'white'
      });

      // Configure drawing settings
      fabricRef.current.freeDrawingBrush.width = 2;
      fabricRef.current.freeDrawingBrush.color = '#000000';
    }

    // Cleanup function to dispose the canvas
    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null; // Ensure we reset fabricRef
      }
    };
  }, []); // Empty dependency array ensures this runs once

  const handleClear = () => {
    if (fabricRef.current) {
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = 'white';
    }
  };

  const handleRecognize = async () => {
    try {
      // Convert canvas to blob
      const dataURL = fabricRef.current.toDataURL();
      const blob = await (await fetch(dataURL)).blob();

      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'equation.png');

      // Send to backend
      const response = await fetch('http://localhost:8000/recognize', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Recognized text:', data.recognized_text);
    } catch (error) {
      console.error('Error recognizing equation:', error);
    }
  };

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
      <div className="button-container">
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleRecognize}>Recognize</button>
      </div>
    </div>
  );
};

export default Canvas;