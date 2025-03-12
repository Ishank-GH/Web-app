import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Welcome Back
        </h1>
        
        <form className="space-y-6" onSubmit={(e) => {
            submitHandler(e)
          }}>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <div className="relative">
             <input
                required
                value={email}
                onChange={(e) => {
                 setEmail(e.target.value)
                 }}
                type="email"
                placeholder='email@example.com'
                className="w-full pl-2 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition "
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                required type="password"
                placeholder='Password'
                className="w-full pl-2 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              />
            </div>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Sign In
          </button>

          <div className="flex items-center justify-center space-x-2">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-500 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <div className="flex space-x-4">
            <button className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors">
             Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition-colors">
              GitHub
            </button>
          </div>

          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserLogin