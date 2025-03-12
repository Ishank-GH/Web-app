import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { useUser } from '../context/UserContext';

const ProfileDropdown = () => {
  const defaultAvatar = {
    type: 'initial',
    color: 'bg-blue-600 text-white',
    url: null,
    publicId: null
  };

  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: '',
    _id: null,
    avatar: defaultAvatar
  });
  const [tempUsername, setTempUsername] = useState("");
  const [tempColor, setTempColor] = useState(defaultAvatar.color);

  const colors = [
    { bg: "bg-blue-600", text: "text-white", hover: "hover:bg-blue-700", ring: "ring-blue-400" },
    { bg: "bg-emerald-600", text: "text-white", hover: "hover:bg-emerald-700", ring: "ring-emerald-400" },
    { bg: "bg-purple-600", text: "text-white", hover: "hover:bg-purple-700", ring: "ring-purple-400" },
    { bg: "bg-rose-600", text: "text-white", hover: "hover:bg-rose-700", ring: "ring-rose-400" },
    { bg: "bg-orange-600", text: "text-white", hover: "hover:bg-orange-700", ring: "ring-orange-400" },
    { bg: "bg-slate-600", text: "text-white", hover: "hover:bg-slate-700", ring: "ring-slate-400" },
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
        
        // Ensure avatar object exists with default values
        const userData = {
          ...response.data,
          avatar: response.data.avatar || defaultAvatar
        };
        
        setUserInfo(userData);
        setTempUsername(userData.username);
        setTempColor(userData.avatar.color || defaultAvatar.color);
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

  const { user, updateProfile } = useUser();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile({
      username: tempUsername,
      avatar: {
        ...user.avatar,
        color: tempColor
      }
    });

    if (result.success) {
      toast.success('Profile updated successfully');
      setIsOpen(false);
    } else {
      toast.error(result.error);
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
        
        if (response.data.success) {
          setUserInfo(prev => ({ ...prev, avatar: response.data.avatar }));
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
        setUserInfo(prev => ({ ...prev, avatar: response.data.data.avatar }));
        toast.success(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to remove profile image");
    }
  };

  const handleCancel = () => {
    setTempUsername(userInfo.username);
    setIsOpen(false);
  };

  const handleColorSelect = (colorOption) => {
    const newColor = `${colorOption.bg} ${colorOption.text}`;
    setTempColor(newColor);
    setUserInfo(prev => ({
      ...prev,
      avatar: {
        ...prev.avatar,
        color: newColor
      }
    }));
  };

  return (
    <div className="relative inline-block text-left">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 transition-all"
      >

        {(userInfo?.avatar?.type === 'image' && userInfo?.avatar?.url) ? (
          <div className="relative">
            <img
              src={userInfo.avatar.url}
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-offset-2 ring-gray-200"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        ) : (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${userInfo?.avatar?.color || defaultAvatar.color} ring-2 ring-offset-2 transition-all`}>
            {getInitials(userInfo?.username)}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl z-50 border border-gray-200">
          <div className="p-6">
            <h1 className="font-bold mb-3 text-lg">Edit Profile</h1>
            <div className="flex items-center space-x-4 mb-6">
              {userInfo.avatar.type === 'image' ? (
                <div className="relative group">
                  <img
                    src={userInfo.avatar.url}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-offset-2 ring-gray-100"
                  />
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                    <i className="ri-camera-line text-white text-2xl"></i>
                  </div>
                </div>
              ) : (
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${userInfo.avatar.color} relative group`}>
                  {getInitials(userInfo.username)}
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                    <i className="ri-camera-line text-white text-2xl"></i>
                  </div>
                </div>
              )}
              
              <div className="flex-1">
                <h1 className="font-medium mb-1 text-lg">Username</h1>
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Color selection */}
            {userInfo.avatar.type === 'initial' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Color
                </label>
                <div className="flex space-x-3">
                  {colors.map((colorOption, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleColorSelect(colorOption)}
                      className={`w-10 h-10 rounded-full ${colorOption.bg} ${colorOption.hover} transition-all
                        ${tempColor === `${colorOption.bg} ${colorOption.text}` ? 
                          `ring-2 ring-offset-2 ${colorOption.ring}` : ''}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-between items-center">
              {userInfo.avatar.type === 'image' && (
                <button
                  type="button"
                  onClick={handleDeleteImage}
                  className="flex items-center text-red-600 hover:text-red-700 text-sm"
                >
                  <i className="ri-delete-bin-line mr-1"></i>
                  Remove Avatar
                </button>
              )}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;