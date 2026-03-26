// --- START OF FILE src/App.jsx ---
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import { projectService } from './services/api';  

function App() {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const[chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProjects();
  },[]);

  useEffect(() => {
    if (activeProjectId) {
      loadHistory(activeProjectId);
    }
  }, [activeProjectId]);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
      if (data.length > 0 && !activeProjectId) {
        setActiveProjectId(data[0].id);
      }
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  const loadHistory = async (id) => {
    setIsLoading(true);
    try {
      const history = await projectService.getHistory(id);
      setChatHistory(history);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewProject = async () => {
    const name = prompt("Enter project name:"); 
    if (!name) return;

    try {
      const newProject = await projectService.create(name);
      setProjects([...projects, newProject]);
      setActiveProjectId(newProject.id); 
      setChatHistory([]); 
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleUserMessage = async (text) => {
    if (!activeProjectId) return alert("Select a project first!");

    // 1. Add User message
    const tempUserMsg = { role: 'user', content: text };
    
    // 2. Create the placeholder for AI with role 'assistant'
    const tempAiId = Date.now(); 
    const tempAiMsg = { 
      id: tempAiId, 
      role: 'assistant', // Changing from 'ai' to 'assistant' to match industry standard
      content: '', 
      currentAction: 'Initializing agent...', 
      agentName: 'A2gent' 
    };

    setChatHistory((prev) => [...prev, tempUserMsg, tempAiMsg]);

    let agentType = "chat"; // Default role
    if (text.includes("@ppt")) agentType = "ppt_agent";
    if (text.includes("@finance")) agentType = "finance_agent";

    try {
      await projectService.streamMessage(activeProjectId, text, agentType, (data) => {
        setChatHistory((prev) => 
          prev.map(msg => {
            if (msg.id === tempAiId) {
              if (data.type === 'status') {
                return { ...msg, currentAction: data.data };
              }
              if (data.type === 'final') {
                // When we get the final answer, hide the spinner (currentAction: null)
                return { ...msg, content: data.data, currentAction: null };
              }
            }
            return msg;
          })
        );
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setChatHistory((prev) => prev.map(msg => 
        msg.id === tempAiId ? { ...msg, content: "Error: Connection to Agent failed.", currentAction: null } : msg
      ));
    }
  };

  return (
    <div className="flex h-screen w-screen bg-bg-app font-sans text-text-primary overflow-hidden">
      <Sidebar 
        projects={projects} 
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        onNewProject={handleNewProject}
      />
      <main className="flex-1 flex flex-col relative h-full">
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-8 border-b border-gray-200 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400' : 'bg-green-500'} animate-pulse`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isLoading ? "Syncing..." : "Super Agent Ready"}
            </span>
          </div>
        </header>
        <ChatArea history={chatHistory} />
        <InputArea onSendMessage={handleUserMessage} />
      </main>
    </div>
  );
}

export default App;
// --- END OF FILE src/App.jsx ---