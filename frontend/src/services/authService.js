import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify({
      token: response.data.token,
      ...response.data.user
    }));
  }
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify({
      token: response.data.token,
      ...response.data.user
    }));
  }
  return response.data;
};

const logout = async () => {
  await api.get('/auth/logout');
  localStorage.removeItem('user');
};

const authService = { register, login, logout };
export default authService;
