import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext'
import { toast } from 'react-toastify';
import { getInitials } from '../utils/helpers';
import CommunityChat from '../components/CommunityChat';

const CommunityDetails = () => {
    const { communityId } = useParams();
    const [community, setCommunity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user}= useUser();
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteCode, setInviteCode] = useState('');
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
    const [channelData, setChannelData] = useState({ name: '', description: '' });

    useEffect(() => {
        const fetchCommunityDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/communities/${communityId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setCommunity(response.data.data);
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to load community');
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
            formData.append('avatar', file);

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/communities/${communityId}/avatar`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                setCommunity(prev => ({
                    ...prev,
                    avatar: response.data.data.avatar
                }));
                toast.success('Community avatar updated!');
            } else {
                toast.error(response.data.message || 'Failed to update community avatar');
            }
        } catch (error) {
            console.error('Error updating community avatar:', error);
            toast.error(error.response?.data?.message || 'Failed to update community avatar');
        }
    };

    const handleGenerateInvite = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/communities/${communityId}/invite`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            setInviteCode(response.data.data.inviteCode);
            setShowInviteModal(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate invite code');
        }
    };

    const copyInviteCode = () => {
        navigator.clipboard.writeText(inviteCode);
        toast.success('Invite code copied to clipboard!');
    };

    const handleCreateChannel = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/channels/${communityId}/channels`,
                channelData,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );

            // Update community channels
            setCommunity(prev => ({
                ...prev,
                channels: [...prev.channels, response.data.data]
            }));
            
            setShowCreateChannelModal(false);
            setChannelData({ name: '', description: '' });
            toast.success('Channel created successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create channel');
        }
    };

    if (loading) {
        return <div className="text-center">Loading community details...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">Error: {error}</div>;
    }

    if (!community) {
        return <div className="text-center">Community not found.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center gap-6">
                    {/* Avatar with upload */}
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-full overflow-hidden">
                            {community?.avatar?.url ? (
                                <img
                                    src={community.avatar.url}
                                    alt={community.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
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
                        <h1 className="text-2xl font-bold">{community.name}</h1>
                        <p className="text-gray-600">{community.description}</p>
                        <div className="flex items-center gap-4 mt-4">
                            <button
                                onClick={handleGenerateInvite}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Generate Invite Code
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Channels and Chat Section */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="flex h-[calc(100vh-20rem)]">
                    {/* Channels Sidebar */}
                    <div className="w-64 border-r">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Channels</h3>
                                <button
                                    onClick={() => setShowCreateChannelModal(true)}
                                    className="p-1.5 rounded-lg hover:bg-gray-100"
                                >
                                    <i className="ri-add-line"></i>
                                </button>
                            </div>
                            <div className="space-y-1">
                                {community?.channels?.map(channel => (
                                    <button
                                        key={channel._id}
                                        onClick={() => setSelectedChannel(channel)}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center ${
                                            selectedChannel?._id === channel._id 
                                                ? 'bg-gray-100' 
                                                : 'hover:bg-gray-50'
                                        }`}
                                    >
                                        <i className="ri-hashtag-line mr-2"></i>
                                        {channel.name}
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
                            <div className="flex items-center justify-center h-full text-gray-500">
                                Select a channel to start chatting
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Invite Code Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Invite Code</h2>
                            <button onClick={() => setShowInviteModal(false)} className="text-gray-500">
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg mb-4">
                            <span className="font-mono">{inviteCode}</span>
                            <button onClick={copyInviteCode}>
                                <i className="ri-clipboard-line"></i>
                            </button>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
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
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Create Channel</h2>
                            <button 
                                onClick={() => setShowCreateChannelModal(false)} 
                                className="text-gray-500"
                            >
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <form onSubmit={handleCreateChannel}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Channel Name
                                </label>
                                <input
                                    type="text"
                                    value={channelData.name}
                                    onChange={(e) => setChannelData({
                                        ...channelData,
                                        name: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter channel name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Description (optional)
                                </label>
                                <textarea
                                    value={channelData.description}
                                    onChange={(e) => setChannelData({
                                        ...channelData,
                                        description: e.target.value
                                    })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter channel description"
                                    rows="3"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateChannelModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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