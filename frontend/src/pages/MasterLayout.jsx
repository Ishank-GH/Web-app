import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import UserLogout from "./UserLogout";
import ProfileDropdown from "./ProfileDropdown";
import axios from "axios";
import { toast } from "react-toastify";
import { getInitials } from "../utils/helpers"; 
import Loader from '../components/Loader';

const MasterLayout = () => {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    avatar: null
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/communities/user/communities`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setCommunities(response.data.data);
      } catch (err) {
        console.error("Error fetching communities:", err);
        toast.error("Failed to load communities");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleJoinCommunity = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/communities/join`,
        { inviteCode },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setCommunities(prev => [...prev, response.data.data]);
      setShowJoinModal(false);
      setInviteCode('');
      toast.success('Successfully joined community!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join community');
    }
  };

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('description', formData.description);
      if (formData.avatar) {
        formDataObj.append('avatar', formData.avatar);
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/communities/create`,
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setCommunities(prev => [...prev, response.data.data]);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', avatar: null });
      toast.success('Community created successfully!');
      navigate(`/communities/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create community');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <img 
                  src="/symmunity-bg_1.png" 
                  alt="" 
                  className="w-10 h-10 object-contain"
                />
                <span className="text-gray-900 dark:text-white text-3xl font-bold ml-2">
                  Symmun<span className="relative">i<span className="absolute top-[-15.5px] right-[0.1px] text-primary text-3xl">.</span></span>ty
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? (
                  <i className="ri-sun-line text-xl text-yellow-500"></i>
                ) : (
                  <i className="ri-moon-line text-xl text-gray-600"></i>
                )}
              </button>
              <ProfileDropdown />
              <UserLogout />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-9xl mx-auto px-4 sm:px-4 lg:px-5 py-6 flex gap-6">
        {/* Sidebar */}
        <div className="w-[17vw] space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 transition-colors duration-200">
            <div className="flex flex-col space-y-2">
              <Link
                to="/home"
                className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="h-9 w-9 flex items-center justify-center bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg">
                  <i className="ri-home-5-fill text-xl"></i>
                </div>
                <span className="font-medium dark:text-gray-300">Home</span>
              </Link>

              <Link
                to="/direct-messages"
                className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="h-9 w-9 flex items-center justify-center bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg">
                  <i className="ri-message-3-fill text-xl"></i>
                </div>
                <span className="font-medium dark:text-gray-300">Messages</span>
              </Link>

              <Link
                to="/questions"
                className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="h-9 w-9 flex items-center justify-center bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg">
                  <i className="ri-question-answer-fill text-xl"></i>
                </div>
                <span className="font-medium dark:text-gray-300">Questions</span>
              </Link>
            </div>
          </div>
          <hr className=" h-4 border-none bg-blue-600 py-2 rounded-full hover:bg-blue-700 transition-colors" />
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 transition-colors duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold dark:text-gray-300">Your Communities</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
              >
                <i className="ri-add-line"></i>
              </button>
            </div>
            <div className="space-y-1.5">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 dark:border-blue-400"></div>
                </div>
              ) : communities.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No communities joined yet
                </div>
              ) : (
                communities.map(community => (
                  <Link
                    key={community._id}
                    to={`/communities/${community._id}`}
                    className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 group transition-colors"
                  >
                    <div className="h-8 w-8  rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {community.avatar?.url ? (
                        <img 
                          src={community.avatar.url} 
                          alt={community.name}
                          className="h-full w-full rounded-xl overflow-hidden object-cover" 
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{getInitials(community.name)}</span>
                      )}
                    </div>
                    <span className="font-medium truncate flex-1 dark:text-gray-300">{community.name}</span>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-4 space-y-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full py-2 px-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-300 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              >
                Create Community
              </button>
              <button
                onClick={() => setShowJoinModal(true)}
                className="w-full py-2 px-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-green-500 dark:hover:border-green-300 hover:text-green-500 dark:hover:text-green-300 transition-colors"
              >
                Join Community
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow">
          <Outlet />
        </div>
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md transition-colors duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-gray-300">Create Community</h2>
              <button 
                onClick={() => setShowCreateModal(false)} 
                className="text-gray-500 dark:text-gray-400"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleCreateCommunity}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Community Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 focus:border-transparent dark:bg-gray-700 dark:text-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 focus:border-transparent dark:bg-gray-700 dark:text-gray-300"
                  rows="3"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Community Avatar (optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => setFormData({...formData, avatar: e.target.files[0]})}
                  className="w-full dark:text-gray-300"
                  accept="image/*"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Create Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Community Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md transition-colors duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold dark:text-gray-300">Join Community</h2>
              <button 
                onClick={() => setShowJoinModal(false)} 
                className="text-gray-500 dark:text-gray-400"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleJoinCommunity}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-300 focus:border-transparent dark:bg-gray-700 dark:text-gray-300"
                  placeholder="Enter invite code"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
                >
                  Join Community
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterLayout;
