import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Canvas from './components/Canvas';

function App() {
  return (
    <>
      <h1>NumBuddy</h1>
      <p className="tagline">Your Friendly Math Sidekick!</p>
      <Canvas /> {/* This will render your Canvas component */}
    </>
  );
}

export default App;

