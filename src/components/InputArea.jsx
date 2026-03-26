import React, { useState, useRef } from 'react';
import { projectService } from '../services/api';

const InputArea = ({ onSendMessage }) => {
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]); // 🚨 NEW: Track uploaded files locally
  const fileInputRef = useRef(null);

  // Handle sending message
  const handleSend = () => {
    if (!input.trim() && attachedFiles.length === 0) return;
    
    onSendMessage(input);
    setInput('');
    setAttachedFiles([]); // Clear file view after sending
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addAgentTag = (tag) => {
    if (!input.includes(tag)) {
      setInput(`${tag} ` + input);
    }
  };

  // Handle File Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await projectService.uploadFile(formData);
      
      // 🚨 ADD TO UI VIEW: response contains {filename, tokens} from your backend
      const newFile = {
        name: response.filename,
        tokens: response.tokens,
        id: Date.now()
      };
      
      setAttachedFiles(prev => [...prev, newFile]);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message;
      alert(`Upload failed: ${errorMsg}`);
    } finally {
      setIsUploading(false);
      e.target.value = null; 
    }
  };

  // Remove file from UI
  const removeFile = (id) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
    // Note: In a real app, you might want to call a backend "delete" here,
    // but for Volatile memory, removing it from UI is enough for now.
  };

  return (
    <div className="flex-shrink-0 p-6 bg-gradient-to-t from-bg-app via-bg-app to-transparent">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={handleFileChange} 
        accept=".pdf,.csv,.txt,.json"
      />

      <div className="max-w-4xl mx-auto flex flex-col gap-3">
        
        {/* Agent Chips */}
        <div className="flex gap-2 px-1">
          <Chip label="PPT Agent" icon="📊" onClick={() => addAgentTag('@ppt')} />
          <Chip label="Financial" icon="💰" onClick={() => addAgentTag('@finance')} />
          <Chip label="Best Product" icon="🔍" onClick={() => addAgentTag('@search')} />
          <Chip label="Writer" icon="✍️" onClick={() => addAgentTag('@writer')} />
        </div>

        {/* Input Box Container */}
        <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-4 transition-all focus-within:shadow-xl focus-within:border-primary">
          
          {/* 🚨 NEW: ATTACHED FILES PREVIEW AREA */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-gray-100">
              {attachedFiles.map((file) => (
                <FilePill 
                  key={file.id} 
                  name={file.name} 
                  tokens={file.tokens} 
                  onRemove={() => removeFile(file.id)} 
                />
              ))}
            </div>
          )}

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isUploading ? "Uploading file..." : "Type a message or ask about your files..."}
            className="w-full max-h-40 min-h-[24px] border-none resize-none outline-none text-text-primary bg-transparent placeholder-gray-400"
            rows={1}
          />
          
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current.click()} 
                disabled={isUploading}
                className="group relative"
              >
                <ToolButton icon={isUploading ? "⏳" : "📎"} />
                <span className="absolute -top-8 left-0 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Upload document (max 10k tokens)
                </span>
              </button>
              <ToolButton icon="🎤" /> 
            </div>
            
            <button 
              onClick={handleSend}
              disabled={(!input.trim() && attachedFiles.length === 0) || isUploading}
              className="bg-primary text-white w-9 h-9 rounded-lg flex items-center justify-center hover:bg-primary-hover disabled:bg-gray-200 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🚨 NEW COMPONENT: THE FILE PILL
const FilePill = ({ name, tokens, onRemove }) => (
  <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl animate-in fade-in slide-in-from-bottom-1">
    <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center text-primary text-lg">
      📄
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-bold text-text-primary truncate max-w-[150px]">{name}</span>
      <span className="text-[10px] text-text-secondary font-medium uppercase tracking-tighter">
        {tokens.toLocaleString()} Tokens
      </span>
    </div>
    <button 
      onClick={onRemove}
      className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
);

const Chip = ({ label, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white border border-gray-200 px-4 py-1.5 rounded-full text-sm font-medium hover:border-primary hover:text-primary hover:shadow-md transition-all flex items-center gap-2 active:scale-95"
  >
    <span>{icon}</span> {label}
  </button>
);

const ToolButton = ({ icon }) => (
  <div className="p-2 text-gray-400 hover:text-text-primary hover:bg-gray-100 rounded-md transition-colors cursor-pointer">
    {icon}
  </div>
);

export default InputArea;