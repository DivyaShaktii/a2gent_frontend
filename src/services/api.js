import axios from 'axios';

// 1. Point this to your backend
const API = axios.create({
  baseURL: 'http://localhost:8000', // <--- CHANGE THIS TO YOUR BACKEND PORT
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Define your API calls
export const projectService = {
  // GET /api/v1/projects
  getAll: async () => {
    const response = await API.get('/api/v1/projects');
    return response.data;
  },

  // POST /api/v1/projects
  create: async (name) => {
    const response = await API.post('/api/v1/projects', { name });
    return response.data;
  },

  // GET /api/v1/projects/{id}/history
  getHistory: async (projectId) => {
    const response = await API.get(`/api/v1/projects/${projectId}/history`);
    return response.data;
  },

  // (Optional) We need an API to send a message!
  // Assuming POST /api/v1/chat or similar
  sendMessage: async (projectId, message, agent) => {
    const response = await API.post('/api/v1/chat', { 
      project_id: projectId,
      message: message,
      agent_type: agent 
    });
    return response.data;
  }
};

export default API;