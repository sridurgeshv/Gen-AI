import React from 'react';
import { useState, useEffect } from 'react';
import './App.css'
import Canvas from './components/Canvas';

function App() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <div className="header-container">
        <h1 className="animated-title">
          <span className="letter">N</span>
          <span className="letter">u</span>
          <span className="letter">m</span>
          <span className="letter bounce">B</span>
          <span className="letter">u</span>
          <span className="letter">d</span>
          <span className="letter">d</span>
          <span className="letter">y</span>
        </h1>
        <p className={`tagline ${isVisible ? 'slide-in' : ''}`}>
          Your Friendly Math Sidekick!
        </p>
      </div>
      <Canvas />
    </>
  );
}

export default App;