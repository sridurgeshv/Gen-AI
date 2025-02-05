import React, { useEffect, useRef, useState } from 'react';
const fabric = window.fabric;  // Get fabric from the window object
import '../styles/Canvas.css';

const Canvas = () => {
  const canvasRef = useRef(null); // Reference for the canvas container
  const fabricRef = useRef(null); // Reference for the Fabric canvas
  const [recognizedText, setRecognizedText] = useState(''); // State to store recognized text
  const [isLoading, setIsLoading] = useState(false); // State to handle loading state
  const [error, setError] = useState(''); // State to handle errors

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
        height: 400,
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
      setRecognizedText(''); // Clear recognized text
      setError(''); // Clear any errors
    }
  };

  const handleRecognize = async () => {
    try {
      if (!fabricRef.current) {
        console.error('Canvas not initialized');
        return;
      }

      setIsLoading(true); // Set loading state
      setError(''); // Clear any previous errors

      // Convert canvas to data URL
      const dataURL = fabricRef.current.toDataURL();
      const blob = await (await fetch(dataURL)).blob();

      // Prepare form data for the API request
      const formData = new FormData();
      formData.append('file', blob, 'equation.png');

      // Send the image to the backend for recognition
      const response = await fetch('http://localhost:8000/recognize', {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response
      const data = await response.json();
      setRecognizedText(data.recognized_text); // Update recognized text
    } catch (error) {
      console.error('Error:', error.message);
      setError('Failed to recognize the equation. Please try again.'); // Set error message
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="canvas-container">
      <div ref={canvasRef} style={{ border: '1px solid #ccc' }} />
      <div className="button-container">
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleRecognize} disabled={isLoading}>
          {isLoading ? 'Recognizing...' : 'Recognize'}
        </button>
      </div>
      {recognizedText && (
        <div className="result-container">
          <h3>Recognized Text:</h3>
          <p>{recognizedText}</p>
        </div>
      )}
      {error && (
        <div className="error-container">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Canvas;
