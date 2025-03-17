import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import UserLogout from "./UserLogout";
import ProfileDropdown from "./ProfileDropdown";
import axios from "axios";
import { toast } from "react-toastify";
import { getInitials } from "../utils/helpers"; 

const MasterLayout = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
const [formData, setFormData] = useState({
  name: '',
  description: ''
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


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
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
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : communities.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  No communities joined yet
                </div>
              ) : (
                communities.map(community => (
                  <Link
                    key={community._id}
                    to={`/communities/${community._id}`}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100 group"
                  >
                    {community.avatar?.url ? (
                      <img 
                        src={community.avatar.url} 
                        alt={community.name}
                        className="w-8 h-8 rounded-full mr-2 object-cover" 
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                        {getInitials(community.name)}
                      </div>
                    )}
                    <span className="truncate">{community.name}</span>
                    <span className="ml-auto opacity-0 group-hover:opacity-100">
                      <i className="ri-settings-4-line text-gray-400"></i>
                    </span>
                  </Link>
                ))
              )}
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
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MasterLayout;
