import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import { projectService } from './services/api';  

function App() {
  const [projects, setProjects] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load Projects (Mock)
  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (activeProjectId) {
      loadHistory(activeProjectId);
    }
  }, [activeProjectId]);

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll();
      setProjects(data);
      // Auto-select the first project if exists
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
    const name = prompt("Enter project name:"); // Simple prompt for now
    if (!name) return;

    try {
      const newProject = await projectService.create(name);
      setProjects([...projects, newProject]);
      setActiveProjectId(newProject.id); // Switch to new project
      setChatHistory([]); // Clear chat
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const handleUserMessage = async (text) => {
    if (!activeProjectId) return alert("Select a project first!");

    // 1. Optimistic UI: Show user message immediately
    const tempUserMsg = { role: 'user', content: text };
    setChatHistory((prev) => [...prev, tempUserMsg]);

    // 2. Determine Agent (Simple parsing)
    let agentType = "super_agent";
    if (text.includes("@ppt")) agentType = "ppt_agent";
    if (text.includes("@finance")) agentType = "finance_agent";

    // 3. Send to Backend
    try {
      const response = await projectService.sendMessage(activeProjectId, text, agentType);
      
      // 4. Add AI Response
      setChatHistory((prev) => [...prev, { 
        role: 'ai', 
        content: response.response, // Assuming your backend returns { reply: "..." }
        agentName: response.model_used
      }]);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optional: Add an error message to chat
      setChatHistory((prev) => [...prev, { role: 'ai', content: "Error: Could not reach agent." }]);
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