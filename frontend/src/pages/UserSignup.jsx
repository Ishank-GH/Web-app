import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {UserDataContext} from '../context/UserContext'


const UserSignup = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ username, setUsername ] = useState('')


  const navigate = useNavigate()

  const { user, setUser } = useContext(UserDataContext)


  const submitHandler = async (e)=>{
    e.preventDefault()
    const newUser = {
      username: username,
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

    if(response.status === 201){
      const data = response.data
      setUser(data.user) //setting email and username in context
      localStorage.setItem('token', data.token)
      navigate('/')
  }
    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('') 
  }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Create Account
          </h1>
  
          <form className="space-y-6" onSubmit={(e) => {
            submitHandler(e)
          }}>
            <div>
              <label className="block text-gray-700 mb-2">Username</label>
              <div className="relative">
                <input
                  required
                  type="text"
                  placeholder='John Doe'
                  value={username}
                  onChange={(e) => {
                     setUsername(e.target.value)
                  }}
                  className="w-full pl-2 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">What's your Email</label>
              <div className="relative">
                <input
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                  }}
                  type="email"
                  placeholder='email@example.com'
                  className="w-full pl-2 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
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
                  className="w-full pl-2 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
              </div>
            </div>
  
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Create Account
            </button>
  
            <p className="text-center text-gray-600">
              Already have an account?
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  };

  export default UserSignup