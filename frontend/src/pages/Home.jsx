import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from 'moment';

const Home = () => {
  const [trendingQuestions, setTrendingQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const questionsRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/questions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        const sorted = questionsRes.data
          .sort((a, b) => (b.votes?.upvotes?.length || 0) - (a.votes?.upvotes?.length || 0))
          .slice(0, 5);
        setTrendingQuestions(sorted);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className='flex-1 transition-all duration-300'>
        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Questions Section */}
            <div className="col-span-12">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Trending Questions</h2>
                  <Link to="/questions" className="text-blue-600 hover:underline">View all</Link>
                </div>
                <div className="space-y-4">
                  {trendingQuestions.map((question) => (
                    <div key={question._id} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-3">
                        {question.author?.avatar?.type === 'image' ? (
                          <img
                            src={question.author.avatar.url}
                            alt={question.author.username}
                            className="h-10 w-10 rounded-full mr-3"
                          />
                        ) : (
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${question.author?.avatar?.color || 'bg-blue-600 text-white'} mr-3`}>
                            {question.author.username.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{question.author.username}</h3>
                          <p className="text-sm text-gray-500">{moment(question.createdAt).format('MMM D, YYYY')}</p>
                        </div>
                      </div>
                      <Link to={`/questions/${question._id}`} className="hover:text-blue-600">
                        <h3 className="font-semibold text-lg mb-2">{question.title}</h3>
                      </Link>
                      <div className="flex items-center text-sm text-gray-600">
                        <span>👍 {question.voteCount}</span>
                        <span className="mx-2">•</span>
                        <span>💬 {question.answers?.length || 0}</span>
                        <span className="mx-2">•</span>
                        <span>👁️ {question.viewCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
