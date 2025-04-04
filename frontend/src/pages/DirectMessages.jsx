import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Chat from '../components/Chat'
import EmptyChat from '../components/EmptyChat'
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

const DirectMessages = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecentChats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/messages/recent-chats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setRecentChats(response.data);
    } catch (error) {
      console.error('Error fetching recent chats:', error);
      toast.error('Failed to load recent chats');
    }
  };

  useEffect(() => {
    fetchRecentChats();
  }, []);

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/contacts/search?search=${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setSearchResults(response.data.data);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleMessageSent = () => {
    fetchRecentChats();
  };

  const getInitials = (name) => {
    return name ? name.slice(0, 2).toUpperCase() : "??";
  };

  const displayedUsers = searchQuery ? searchResults : recentChats;

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-4 gap-3 h-[calc(100vh-8rem)]">
      {/* Users Panel */}
      <div className="col-span-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col transition-colors duration-200">
        {/* Search Bar */}
        <div className="p-4 border-b dark:border-gray-700 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            
            {searchQuery && !loading && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            )}
            {/* Small loader in search */}
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-400"></div>
              </div>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div></div>
          ) : displayedUsers.length > 0 ? (
            displayedUsers.map((user) => (
              <div 
                key={user._id} 
                className={`p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                  selectedUser?._id === user._id ? 'bg-gray-100 dark:bg-gray-700' : ''
                } transition-colors duration-200`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-center">
                  {user.avatar?.type === 'image' ? (
                    <img
                      src={user.avatar.url}
                      alt={user.username}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${user.avatar?.color || 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'}`}>
                      {getInitials(user.username)}
                    </div>
                  )}
                  <div className="ml-3">
                    <h3 className="font-semibold dark:text-white">{user.username}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              {loading ? 'Loading...' : 
               searchQuery ? 'No users found' : 'No recent conversations'}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="col-span-3">
        {selectedUser ? (
          <Chat selectedUser={selectedUser} onMessageSent={handleMessageSent} />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  )
}

export default DirectMessages
