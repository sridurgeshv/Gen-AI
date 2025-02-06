import React from 'react';

const EquationDisplay = ({ recognizedText }) => {
  return (
    <div className="equation-display">
      <h3>Recognized Equation</h3>
      <div className="equation-content">
        {recognizedText ? (
          <p className="equation-text">{recognizedText}</p>
        ) : (
          <p className="placeholder-text">Draw an equation and click recognize to see it here</p>
        )}
      </div>
    </div>
  );
};

export default EquationDisplay;