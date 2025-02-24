import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const UserLogout = () => {

    const navigate = useNavigate();
    
    const handleLogout = () => {

    const token = localStorage.getItem('token')
    

    axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response)=>{
        if(response.status === 200){
            localStorage.removeItem('token')
            navigate('/login')
            console.log('logging out')
        }
    })
}
  return (
    <div><button onClick={handleLogout} className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'>
        Logout
    </button>
      
    </div>
  )
}

export default UserLogout
