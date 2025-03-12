import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import UserLogout from "./UserLogout";
import ProfileDropdown from "./ProfileDropdown";
import axios from "axios";

const MasterLayout = ({ children }) => {
  const [communities, setCommunities] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/communities`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setCommunities(res.data);
      } catch (err) {
        console.error("Error fetching communities:", err);
      }
    };

    fetchCommunities();
  }, []);

  const handleCreateCommunity = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/communities/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setCommunities([...communities, res.data]);
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
    } catch (err) {
      console.error('Error creating community:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation / Top Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-1">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center ml-2">
              <img src="../public/Symmunity_Logo.jpg" alt="" className="w-48" />
              <div className="ml-6 flex items-center bg-gray-100 rounded-lg px-4 py-2">
                <input
                  type="text"
                  placeholder="Search communities..."
                  className="ml-2 bg-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex items-center space-x-5">
              <ProfileDropdown />
              <UserLogout />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-9xl mx-auto px-4 sm:px-4 lg:px-5 py-6 flex gap-6">
        {/* Sidebar */}
        <div className="w-[17vw] space-y-4">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <div className="h-10 w-10 flex items-center justify-center text-gray-700 bg-gray-50 rounded-lg">
                  <i className="ri-home-5-fill text-2xl"></i>
                </div>
                <span className="text-sm font-medium">Home</span>
              </Link>

              <Link
                to="/direct-messages"
                className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <div className="h-10 w-10 flex items-center justify-center text-gray-700 bg-gray-50 rounded-lg">
                  <i className="ri-message-3-fill text-2xl"></i>
                </div>
                <span className="text-sm font-medium">Messages</span>
              </Link>

              <Link
                to="/questions"
                className="flex items-center space-x-4 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <div className="h-10 w-10 flex items-center justify-center text-gray-700 bg-gray-50 rounded-lg">
                  <i className="ri-question-answer-fill text-2xl"></i>
                </div>
                <span className="text-sm font-medium">Questions</span>
              </Link>
            </div>
          </div>

          <hr className="w-full h-4 border-none bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition-colors" />

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Your Communities</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                <i className="ri-add-line"></i>
              </button>
            </div>
            
            <div className="space-y-1">
              {communities.map(community => (
                <Link
                  key={community._id}
                  to={`/communities/${community._id}`}
                  className="flex items-center p-2 rounded-lg hover:bg-gray-100 group"
                >
                  {community.imageUrl ? (
                    <img 
                      src={community.imageUrl} 
                      alt={community.name || ''}
                      className="w-8 h-8 rounded-full mr-2" 
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                      {(community?.name || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="truncate">{community?.name || 'Unnamed Community'}</span>
                  <span className="ml-auto opacity-0 group-hover:opacity-100">
                    <i className="ri-settings-4-line text-gray-400"></i>
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-4">
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full py-2 px-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                Create Community
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow">
          {/* Use children if provided, otherwise fallback to the Outlet */}
          {children || <Outlet />}
        </div>
      </div>

      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create a Community</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <form onSubmit={handleCreateCommunity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Community Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter community name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Describe your community"
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Community
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
