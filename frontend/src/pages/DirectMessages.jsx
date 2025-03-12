import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Chat from '../components/Chat'
import EmptyChat from '../components/EmptyChat'
import { toast } from 'react-toastify';

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
    <div className="max-w-7xl mx-auto grid grid-cols-4 gap-4 h-[78vh]">
      {/* Users Panel */}
      <div className="col-span-1 bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            
            {/* Clear button */}
            {searchQuery && !loading && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            )}
            
            {/* Loading spinner */}
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>

        {/* Users List */}
        <div className="overflow-y-auto h-[calc(100%-73px)]">
          {displayedUsers.length > 0 ? (
            displayedUsers.map((user) => (
              <div 
                key={user._id} 
                className={`p-3 hover:bg-gray-200 cursor-pointer ${
                  selectedUser?._id === user._id ? 'bg-gray-200' : ''
                }`}
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
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${user.avatar?.color || 'bg-blue-100'}`}>
                      {getInitials(user.username)}
                    </div>
                  )}
                  <div className="ml-3">
                    <h3 className="font-semibold">{user.username}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              {loading ? 'Loading...' : 
               searchQuery ? 'No users found' : 'No recent conversations'}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="col-span-3">
        {selectedUser ? (
          <Chat 
            selectedUser={selectedUser} 
            onMessageSent={handleMessageSent}
          />
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  )
}

export default DirectMessages
