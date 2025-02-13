import React, { useState, useEffect, useRef } from 'react';

const Message = ({ content, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-[80%] p-3 rounded-lg ${
      isUser ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-100 text-black mr-auto'
    }`}>
      <p className="text-sm">{content}</p>
    </div>
  </div>
);

const EquationDisplay = ({ recognizedText }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (recognizedText && !messages.some(msg => msg.content === recognizedText)) {
      // Add user's equation as a message
      setMessages(prev => [...prev, { content: recognizedText, isUser: true }]);
      // Generate solution using Gemini
      generateSolution(recognizedText);
    }
  }, [recognizedText]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
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
    <div className="equation-display w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <div className="border-b p-4">
        <h3 className="text-lg font-semibold text-center">Chat with NumBuddy</h3>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="h-[400px] overflow-y-auto p-4"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Write an equation on the canvas and I'll help you solve it!
          </div>
        ) : (
          <>
            {messages.map((message, index) => (
              <Message key={index} {...message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-sm">Thinking...</p>
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