import React, { useEffect, useRef } from 'react';

const ChatArea = ({ history }) => {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when a new message arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // If no messages, show the "Welcome" state
  if (!history || history.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center opacity-60">
        <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4 flex items-center justify-center text-3xl">
          🤖
        </div>
        <h3 className="text-xl font-semibold mb-2">Super Agent Ready</h3>
        <p>Select a specific agent below or just start typing.</p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth bg-[#f9f9fb]">
      {history.map((msg, index) => {
        const isAi = msg.role === 'ai'; 
        return (
          <div key={index} className={`flex gap-4 max-w-4xl mx-auto w-full ${isAi ? '' : 'justify-end'}`}>
            
            {/* AI Avatar */}
            {isAi && (
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm">
                A2
              </div>
            )}

            {/* Bubble */}
            <div className={`relative px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed max-w-[80%]
                ${isAi 
                  ? 'bg-white border border-gray-100 text-text-primary rounded-tl-none' 
                  : 'bg-primary text-white rounded-br-none'
                }`}>
              {/* Optional: Agent Name Tag */}
              {isAi && msg.agentName && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1 block">
                  {msg.agentName}
                </span>
              )}
              {msg.content}
            </div>

            {/* User Avatar */}
            {!isAi && (
              <div className="w-8 h-8 rounded-lg bg-gray-800 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm">
                JD
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatArea;