import API from './api';

export const login = async (email, password) => {
  const res = await API.post('/auth/login', { email, password });
  return res.data;
};

export const register = async (userData) => {
  const res = await API.post('/auth/register', userData);
  return res.data;
};
