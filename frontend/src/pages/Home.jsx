import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const [trendingTags, setTrendingTags] = useState(['react', 'javascript', 'node.js', 'python', 'mongodb']);
  const [trendingQuestions, setTrendingQuestions] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrendingQuestions = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/questions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        // Sort by vote count and take top 5
        const sorted = res.data.sort((a, b) => 
          (b.votes?.upvotes?.length || 0) - (a.votes?.upvotes?.length || 0)
        ).slice(0, 5);
        setTrendingQuestions(sorted);
      } catch (err) {
        console.error("Error fetching trending questions:", err);
      }
    };

    // Add tags based on questions
    const extractTags = (questions) => {
      const tagMap = {};
      questions.forEach(q => {
        q.tags?.forEach(tag => {
          tagMap[tag] = (tagMap[tag] || 0) + 1;
        });
      });
      return Object.entries(tagMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag]) => tag);
    };

    fetchTrendingQuestions().then(() => {
      setTrendingTags(extractTags(trendingQuestions));
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Navigation Sidebar */}
      {/* <div className="fixed left-0 h-full w-16 bg-gray-900 flex flex-col items-center py-6 space-y-4">
        <button 
          onClick={() => navigate('/')}
          className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
        >
          <i className="ri-home-line text-xl"></i>
        </button>
        <button 
          onClick={() => setIsMessageOpen(!isMessageOpen)}
          className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
        >
          <i className="ri-message-line text-xl"></i>
        </button>
      </div> */}

      {/* Messages Panel */}
      {/* <div className={`fixed top-0 left-16 h-full bg-white shadow-lg transition-all duration-300 overflow-hidden ${
        isMessageOpen ? 'w-72' : 'w-0'
      }`}>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">Messages</h3> */}
          {/* Add message content here */}
        {/* </div>
      </div> */}

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Questions Section */}
            <div className="col-span-12 lg:col-span-9">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Trending Questions</h2>
                  <Link to="/questions" className="text-blue-600 hover:underline">View all</Link>
                </div>
                <div className="space-y-4">
                  {trendingQuestions.map((question) => (
                    <div key={question._id} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        <img src={question.author.avatar} 
                             className="h-10 w-10 rounded-full mr-3" />
                        <div>
                          <h3 className="font-semibold">{question.author.username}</h3>
                          <p className="text-sm text-gray-500">{new Date(question.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <Link to={`/questions/${question._id}`} className="hover:text-blue-600">
                        <h3 className="font-semibold text-lg mb-2">{question.title}</h3>
                      </Link>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <span>👍 {question.voteCount}</span>
                        <span className="mx-2">•</span>
                        <span>💬 {question.answers?.length || 0}</span>
                        <span className="mx-2">•</span>
                        <span>👁️ {question.viewCount}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {question.tags?.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-span-12 lg:col-span-3 space-y-4">
              {/* Trending Tags */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <h3 className="text-base font-semibold mb-3">Trending Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {trendingTags.map((tag) => (
                    <Link 
                      key={tag} 
                      to={`/questions/tagged/${tag}`}
                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs hover:bg-blue-100"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Ask Question Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm p-4">
                <h3 className="text-base font-semibold mb-2">Share Knowledge</h3>
                <p className="text-sm text-gray-600 mb-3">Help others by answering questions</p>
                <Link 
                  to="/questions/create"
                  className="block text-center bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ask a Question
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
