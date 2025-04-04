import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '../utils/helpers';
import axios from 'axios';
import Loader from '../components/Loader';

const Communities = () => {
    const navigate = useNavigate();
    const [communities, setCommunities] = useState([]);
    const [loading, setLoading] = useState(true);

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
            } catch (error) {
                console.error('Error fetching communities:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCommunities();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Your Communities</h1>
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
        </div>
    );
};

export default Communities;