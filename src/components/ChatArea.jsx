import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// SAFETY: Using a more stable import path for the style
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatArea = ({ history }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Guard 1: If history is missing, show a loading state instead of crashing
  if (!history) return <div className="flex-1 bg-[#f9f9fb]"></div>;

  if (history.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center opacity-60">
        <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-4 flex items-center justify-center text-3xl">🤖</div>
        <h3 className="text-xl font-semibold mb-2">Super Agent Ready</h3>
        <p>Select a project or type a message to begin.</p>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth bg-[#f9f9fb]">
      {history.map((msg, index) => {
        // Guard 2: If a message object is malformed, skip it
        if (!msg) return null;

        const isAi = msg.role === 'ai' || msg.role === 'assistant'; 
        
        return (
          <div key={index} className={`flex gap-4 max-w-4xl mx-auto w-full ${isAi ? '' : 'justify-end'}`}>
            
            {isAi && (
              <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm mt-1">
                A2
              </div>
            )}

            <div className={`flex flex-col max-w-[85%] ${isAi ? 'items-start' : 'items-end'}`}>
              
              {msg.content && (
                <div className={`relative px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed w-full
                    ${isAi ? 'bg-white border border-gray-100 text-text-primary rounded-tl-none' : 'bg-primary text-white rounded-br-none'}`}>
                  
                  {isAi && msg.agentName && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2 block">
                      {msg.agentName}
                    </span>
                  )}

                  <div className="markdown-container">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={oneLight}
                              language={match[1]}
                              PreTag="div"
                              className="rounded-md my-2"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className="bg-gray-100 px-1 rounded text-primary font-mono" {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {isAi && msg.currentAction && (
                <div className={`mt-2 px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-200 flex items-center text-xs text-gray-600 font-medium ${!msg.content ? 'animate-pulse' : ''}`}>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {msg.currentAction}
                </div>
              )}
            </div>

            {!isAi && (
              <div className="w-8 h-8 rounded-lg bg-gray-800 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm mt-1">
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