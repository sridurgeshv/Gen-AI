import React from 'react';
import '../styles/Eqdisplay.css';

const EquationDisplay = ({ recognizedText }) => {
  return (
    <div className="equation-display">
      <h3>Chat with NumBuddy</h3>
      <div className="equation-content">
        {recognizedText ? (
          <p className="equation-text">{recognizedText}</p>
        ) : (
          <p className="placeholder-text">Throw a problem our way and witness the 'magic'!</p>
        )}
      </div>
    </div>
  );
};

export default EquationDisplay;