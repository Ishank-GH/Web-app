import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { toast } from "react-toastify";
import { getInitials } from "../utils/helpers";
import CommunityChat from "../components/CommunityChat";
import Loader from "../components/Loader";

const CommunityDetails = () => {
  const { communityId } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [channelData, setChannelData] = useState({ name: "", description: "" });

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/communities/${communityId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCommunity(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load community");
      } finally {
        setLoading(false);
      }
    };

    if (communityId) {
      fetchCommunityDetails();
    }
  }, [communityId]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/communities/${communityId}/avatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setCommunity((prev) => ({
          ...prev,
          avatar: response.data.data.avatar,
        }));
        toast.success("Community avatar updated!");
      } else {
        toast.error(
          response.data.message || "Failed to update community avatar"
        );
      }
    } catch (error) {
      console.error("Error updating community avatar:", error);
      toast.error(
        error.response?.data?.message || "Failed to update community avatar"
      );
    }
  };

  const handleGenerateInvite = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/communities/${communityId}/invite`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setInviteCode(response.data.data.inviteCode);
      setShowInviteModal(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate invite code"
      );
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.success("Invite code copied to clipboard!");
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/channels/${communityId}/channels`,
        channelData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Update community channels
      setCommunity((prev) => ({
        ...prev,
        channels: [...prev.channels, response.data.data],
      }));

      setShowCreateChannelModal(false);
      setChannelData({ name: "", description: "" });
      toast.success("Channel created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create channel");
    }
  };

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  if (!community) {
    return <div className="text-center">Community not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Community Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 transition-colors duration-200">
        <div className="flex items-center gap-6">
          {/* Avatar with upload */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-xl overflow-hidden">
              {community?.avatar?.url ? (
                <img
                  src={community.avatar.url}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold">
                  {getInitials(community.name)}
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <i className="ri-camera-line text-white text-2xl"></i>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>

          {/* Community Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {community.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {community.description}
            </p>
            
            {/* stats row */}
            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                <i className="ri-team-line text-gray-500 dark:text-gray-400 text-lg"></i>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {community.members?.length || 0} members
                </span>
              </div>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg">
                <i className="ri-hashtag text-gray-500 dark:text-gray-400 text-lg"></i>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {community.channels?.length || 0} channels
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleGenerateInvite}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Generate Invite Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors duration-200">
        <div className="flex h-[76vh]">
          {/* Channels Sidebar */}
          <div className="w-64 border-r dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Channels
                </h3>
                <button
                  onClick={() => setShowCreateChannelModal(true)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  <i className="ri-add-line text-xl"></i>
                </button>
              </div>
            </div>
            
            {/* channels list */}
            <div className="overflow-y-auto flex-1">
              <div className="p-2 space-y-1">
                {community?.channels?.map((channel) => (
                  <button
                    key={channel._id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center space-x-2 ${
                      selectedChannel?._id === channel._id
                        ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <i className="ri-hashtag-line flex-shrink-0"></i>
                    <span className="truncate">{channel.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1">
            {selectedChannel ? (
              <CommunityChat channel={selectedChannel} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                Select a channel to start chatting
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Code Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md transition-colors duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Invite Code
              </h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-500 dark:text-gray-400"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg mb-4">
              <span className="font-mono text-gray-900 dark:text-white">
                {inviteCode}
              </span>
              <button onClick={copyInviteCode}>
                <i className="ri-clipboard-line"></i>
              </button>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Channel Modal */}
      {showCreateChannelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md transition-colors duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Channel
              </h2>
              <button
                onClick={() => setShowCreateChannelModal(false)}
                className="text-gray-500 dark:text-gray-400"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleCreateChannel}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={channelData.name}
                  onChange={(e) =>
                    setChannelData({
                      ...channelData,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter channel name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={channelData.description}
                  onChange={(e) =>
                    setChannelData({
                      ...channelData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter channel description"
                  rows="3"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateChannelModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  Create Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default CommunityDetails;