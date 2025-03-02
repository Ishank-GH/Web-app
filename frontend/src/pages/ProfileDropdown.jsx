import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [color, setColor] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const colors = [
    "bg-[#712c4a57] text-white border-[1px] border-[#ff06faa]",
    "bg-[#ff006e] text-white border-[1px] border-[#ff06fa]",
    "bg-[#ff06fa] text-white border-[1px] border-[#ff06fa]",
  ];

  const getInitials = (name) => {
    return name ? name.slice(0, 2).toUpperCase() : "??";
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setUserInfo(response.data);
        setUsername(response.data.username);
        setAvatar(response.data.avatar);
        setColor(response.data.color || colors[0]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user info");
      }
    };
    fetchUserInfo();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        username,
        avatar,
        color,
      };
      
      // Changed from post to put and added userId
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/update-profile/${userInfo._id}`,
        updatedUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        setUserInfo(response.data.data);
        toast.success(response.data.message);
        setIsOpen(false);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleImageChange = async (e) => {
    try {
      const image = e.target.files[0];
      if (image) {
        const formData = new FormData();
        formData.append("profile-image", image);
        
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/add-profile-image`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        if (response.data.avatar) {
          setAvatar(response.data.avatar);
          toast.success('Profile Image Updated');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update profile image");
    }
  };

  const handleDeleteImage = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/users/remove-profile-image`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
      );

      if (response.data.success) {
        setAvatar(null);
setUserInfo(prev => ({ ...prev, avatar: null }));
        toast.success(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to remove profile image");
    }
  };

  return (
    <div className="relative inline-block text-left">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100"
      >
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
            {getInitials(username)}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative"
                     onMouseEnter={() => setIsHovered(true)}
                     onMouseLeave={() => setIsHovered(false)}>
                  {avatar ? (
                    <div className="relative">
                      <img
                        src={avatar}  
                        alt="Avatar"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {isHovered && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                          <i className="ri-add-line text-white text-2xl"></i>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${color} relative`}>
                      {getInitials(username)}
                      {isHovered && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                          <i className="ri-add-line text-white text-2xl"></i>
                        </div>
                      )}
                    </div>
                  )}
                  <input
                    type="file"
                    name="profile-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                
                <div className="flex-1">
                  <label className="block">
                    <span className="text-gray-700 text-sm">Username</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                  </label>
                </div>
              </div>

              {avatar && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="text-red-600 text-sm hover:text-red-700"
                >
                  Remove Photo
                </button>
              )}

              {!avatar && (
                <div className="flex space-x-2">
                  {colors.map((colorOption, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setColor(colorOption)}
                      className={`w-8 h-8 rounded-full ${colorOption} ${
                        color === colorOption ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
                    />
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
