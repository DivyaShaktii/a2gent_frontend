import React, { useState } from 'react';

const InputArea = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  // Handle sending
  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  // Allow pressing "Enter" to send
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to add agent tag to input
  const addAgentTag = (tag) => {
    if (!input.includes(tag)) {
      setInput(`${tag} ` + input);
    }
  };

  return (
    <div className="flex-shrink-0 p-6 bg-gradient-to-t from-bg-app via-bg-app to-transparent">
      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        
        {/* Agent Chips */}
        <div className="flex gap-2 px-1">
          <Chip label="PPT Agent" icon="📊" onClick={() => addAgentTag('@ppt')} />
          <Chip label="Financial" icon="💰" onClick={() => addAgentTag('@finance')} />
          <Chip label="Best Product" icon="🔍" onClick={() => addAgentTag('@search')} />
          <Chip label="Writer" icon="✍️" onClick={() => addAgentTag('@writer')} />
        </div>

        {/* Input Box */}
        <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-4 transition-shadow focus-within:shadow-xl focus-within:border-primary">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full max-h-40 min-h-[24px] border-none resize-none outline-none text-text-primary bg-transparent placeholder-gray-400"
            rows={1}
          />
          
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
            <div className="flex gap-2">
              <ToolButton icon="📎" /> {/* Attachment Icon Placeholder */}
              <ToolButton icon="🎤" /> {/* Voice Icon Placeholder */}
            </div>
            
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-primary text-white w-9 h-9 rounded-lg flex items-center justify-center hover:bg-primary-hover disabled:bg-gray-200 disabled:cursor-not-allowed transition-all"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small helper components for this file only
const Chip = ({ label, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white border border-gray-200 px-4 py-1.5 rounded-full text-sm font-medium hover:border-primary hover:text-primary hover:shadow-md transition-all flex items-center gap-2"
  >
    <span>{icon}</span> {label}
  </button>
);

const ToolButton = ({ icon }) => (
  <button className="p-2 text-gray-400 hover:text-text-primary hover:bg-gray-100 rounded-md transition-colors">
    {icon}
  </button>
);

export default InputArea;