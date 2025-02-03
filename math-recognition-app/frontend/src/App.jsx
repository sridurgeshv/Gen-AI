import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Canvas from './components/Canvas';

function App() {
  return (
    <>
      <h1>Canvas App</h1>
      <Canvas /> {/* This will render your Canvas component */}
    </>
  );
}

export default App;

