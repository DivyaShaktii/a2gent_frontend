import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const API = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectService = {
  getAll: async () => {
    // Add the slash at the end
    const response = await API.get('/api/v1/projects/'); 
    return response.data;
  },

  create: async (name) => {
    // Add the slash at the end
    const response = await API.post('/api/v1/projects/', { name }); 
    return response.data;
  },

  getHistory: async (projectId) => {
    // Add the slash at the end
    const response = await API.get(`/api/v1/projects/${projectId}/history/`); 
    return response.data;
  },

  uploadFile: async (formData) => {
    const response = await API.post('/api/v1/files/upload', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data' 
      }
    });
    return response.data;
  },

  streamMessage: async (projectId, message, agent, onUpdate) => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/chat/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({ 
          project_id: projectId, 
          message: message, 
          agent_type: agent,
          use_react: true 
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      // SSE can send multiple lines in one chunk, we must split them correctly
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data:')) continue;
          
          try {
            // Remove 'data: ' prefix and parse
            const jsonStr = trimmedLine.replace('data:', '').trim();
            const data = JSON.parse(jsonStr);
            onUpdate(data);
          } catch (e) {
            console.warn("Skipping partial/malformed line:", trimmedLine);
          }
        }
      }
    } catch (error) {
      console.error("Stream connection failed:", error);
      onUpdate({ type: 'final', data: `Error connecting to backend: ${error.message}` });
    }
  }
};

export default API;