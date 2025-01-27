import axios from 'axios';

const API_URL = 'http://your-backend-url.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (username, password) => {
  try {
    const response = await api.post('/login', { username, password });
    return response.data; // Return server response
  } catch (error) {
    throw error; // Error handling (could add more error info)
  }
};

export const loginWithGoogle = async (idToken) => {
  try {
    const response = await api.post('/login/google', { idToken });
    return response.data; // Return server response
  } catch (error) {
    throw error; // Error handling (could add more error info)
  }
};
