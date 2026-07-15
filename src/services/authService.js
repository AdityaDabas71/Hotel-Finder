import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const register = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    name,
    email,
    password
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password
  });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('stayred_auth_token');
  localStorage.removeItem('stayred_auth_user');
};

export const getProfile = async (token) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
