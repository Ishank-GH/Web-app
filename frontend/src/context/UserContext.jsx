import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

export const UserDataContext = createContext();

export const useUser = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/profile`,
        { withCredentials: true }
      );
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth Check Error:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { email, password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      // Set default authorization header for subsequent requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login Error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/logout`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/update-profile/${user._id}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setUser(response.data.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Update failed'
      };
    }
  };

  return (
    <UserDataContext.Provider value={{
      user,
      setUser,
      loading,
      isAuthenticated,
      login,
      logout,
      updateProfile,
      checkAuth
    }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
