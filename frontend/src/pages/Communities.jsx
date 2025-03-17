import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getInitials } from '../utils/helpers';

const Communities = () => {
    const [communities, setCommunities] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        avatar: null
    });
    const [inviteCode, setInviteCode] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/communities/user/communities`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setCommunities(response.data.data); 
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to load communities');
            }
        };

        fetchCommunities();
    }, []);

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
            
            // Navigate to the new community
            navigate(`/communities/${response.data.data._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create community');
        }
    };

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

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Communities</h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                        Create Community
                    </button>
                    <button
                        onClick={() => setShowJoinModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        Join with Code
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map((community) => (
                    <div
                        key={community._id}
                        onClick={() => navigate(`/communities/${community._id}`)}
                        className="bg-white border rounded-xl p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    >
                        <div className="flex items-center space-x-4 mb-4">
                            {community.avatar?.url ? (
                                <img
                                    src={community.avatar.url}
                                    alt={community.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-semibold">
                                    {getInitials(community.name)}
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-xl">{community.name}</h3>
                                <p className="text-gray-600 text-sm">Created by {community.owner.username}</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-2">{community.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                            <div className="flex items-center mr-4">
                                <i className="ri-user-line mr-1"></i>
                                {community.members?.length || 0} members
                            </div>
                            <div className="flex items-center">
                                <i className="ri-hashtag mr-1"></i>
                                {community.channels?.length || 0} channels
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Community Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Create Community</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-500">
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <form onSubmit={handleCreateCommunity}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Community Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter community name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter description"
                                    rows="3"
                                    required
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Community Avatar</label>
                                <div className="flex items-center space-x-4">
                                    <div className="relative w-20 h-20 rounded-full overflow-hidden group">
                                        {formData.avatar ? (
                                            <img
                                                src={URL.createObjectURL(formData.avatar)}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                                                {formData.name ? getInitials(formData.name) : '?'}
                                            </div>
                                        )}
                                        <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                            <i className="ri-camera-line text-white text-2xl"></i>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        setFormData(prev => ({ ...prev, avatar: e.target.files[0] }));
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Join Community Modal */}
            {showJoinModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Join Community</h2>
                            <button onClick={() => setShowJoinModal(false)} className="text-gray-500">
                                <i className="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <form onSubmit={handleJoinCommunity}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Invite Code</label>
                                <input
                                    type="text"
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter invite code"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowJoinModal(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

export default Communities;