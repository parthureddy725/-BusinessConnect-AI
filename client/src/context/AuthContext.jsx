import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Set default API base URL (can point to backend domain on Render in production)
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('/auth/profile');
      setUser(res.data);
    } catch (err) {
      console.error('Session expired or invalid token');
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      const { token: userToken, user: userData } = res.data;
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  const register = async (name, email, password, company, phone) => {
    try {
      const res = await axios.post('/auth/register', {
        name,
        email,
        password,
        company,
        phone,
        role: 'client' // Default signup role
      });
      const { token: userToken, user: userData } = res.data;
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await axios.put('/auth/profile/update', profileData);
      setUser(res.data);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
