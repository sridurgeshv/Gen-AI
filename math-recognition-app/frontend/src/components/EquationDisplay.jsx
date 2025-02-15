import React, { useState, useEffect, useRef } from 'react';
import '../styles/Eqdisplay.css';

const Message = ({ content, isUser }) => (
  <div className={`message-container ${isUser ? 'user-message' : 'assistant-message'}`}>
    <div className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
      {isUser ? (
        <p className="message-text">{content}</p>
      ) : (
        <div className="solution-text">
          {content.split('\n').map((line, index) => (
            <p key={index} className={
              line.startsWith('Step') ? 'solution-step' :
              line.startsWith('Conclusion') ? 'solution-conclusion' :
              'solution-detail'
            }>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  </div>
);

const EquationDisplay = ({ recognizedText }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (recognizedText && !messages.some(msg => msg.content === recognizedText)) {
      setMessages(prev => [...prev, { content: recognizedText, isUser: true }]);
      generateSolution(recognizedText);
    }
  }, [recognizedText]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const generateSolution = async (equation) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/solve_equation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ equation }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate solution');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { content: data.solution, isUser: false }]);
    } catch (error) {
      console.error('Error generating solution:', error);
      setMessages(prev => [...prev, { 
        content: "I'm sorry, I couldn't generate a solution. Please try again.", 
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="equation-display">
      <div className="display-header">
        <h3 className="header-title">Chat with NumBuddy</h3>
      </div>
      
      <div ref={chatContainerRef} className="chat-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            Write an equation on the canvas and I'll help you solve it!
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <Message key={index} {...message} />
            ))}
            {isLoading && (
              <div className="loading-indicator">
                <div className="loading-bubble">
                  <p className="loading-text">Thinking...</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EquationDisplay;