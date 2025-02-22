import React, { useEffect, useRef, useState } from 'react';

const RealTimeMathRecognition = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [recognizedText, setRecognizedText] = useState('');
    const [solution, setSolution] = useState('');
    const [stream, setStream] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            setStream(stream);
            setCameraActive(true);
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setCameraActive(false);
        }
    };

    const captureAndSendFrame = async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('file', blob, 'frame.png');
                try {
                    const response = await fetch('http://localhost:8000/live_recognize', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await response.json();
                    setRecognizedText(result.recognized_text);
                } catch (error) {
                    console.error('Error:', error);
                }
            }, 'image/png');
        }
    };

    const solveEquation = async () => {
        if (!recognizedText) return;
        try {
            const response = await fetch('http://localhost:8000/solve_equation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ equation: recognizedText })
            });
            const result = await response.json();
            setSolution(result.solution);
        } catch (error) {
            console.error('Error solving equation:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxWidth: '500px', display: cameraActive ? 'block' : 'none' }}></video>
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            </div>
            <div style={{ margin: '20px' }}>
                <button onClick={captureAndSendFrame} style={{ marginRight: '10px', padding: '10px 20px', cursor: 'pointer' }} disabled={!cameraActive}>Recognize Equation</button>
                <button onClick={stopCamera} style={{ marginRight: '10px', padding: '10px 20px', cursor: 'pointer' }} disabled={!cameraActive}>Stop Camera</button>
                <button onClick={startCamera} style={{ padding: '10px 20px', cursor: 'pointer' }} disabled={cameraActive}>Open Camera</button>
            </div>
            <div style={{ marginTop: '20px', fontSize: '1.2em' }}>Recognized Equation: <strong>{recognizedText}</strong></div>
            <button onClick={solveEquation} style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }} disabled={!recognizedText}>Get Solution</button>
            {solution && (
                <div style={{ marginTop: '20px', textAlign: 'left', maxWidth: '600px', margin: 'auto', border: '1px solid #ccc', padding: '10px', maxHeight: '300px', overflowY: 'scroll' }}>
                    <strong>Solution:</strong>
                    <pre style={{ whiteSpace: 'pre-wrap' }}>{solution}</pre>
                </div>
            )}
        </div>
    );
};

export default RealTimeMathRecognition;