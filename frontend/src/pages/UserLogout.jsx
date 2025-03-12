import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext';

export const UserLogout = () => {
  const { logout } = useUser();
  const navigate = useNavigate();
    
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <button 
      onClick={handleLogout} 
      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
    >
      Logout
    </button>
  );
};

export default UserLogout
