import React, { useState, useEffect } from 'react';
import './App.css';
import Canvas from './components/Canvas';
import Welcome from './components/Welcome';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  if (showWelcome) {
    return <Welcome onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <div className="app-container">
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
    </div>
  );
}

export default App;