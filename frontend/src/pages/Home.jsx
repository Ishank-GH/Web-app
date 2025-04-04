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
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-6">
            {/* Questions Section */}
            <div className="col-span-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <div className="border-b dark:border-gray-700 px-6 py-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Trending Questions</h2>
                    <Link to="/questions" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm">
                      View all
                      <i className="ri-arrow-right-line ml-1"></i>
                    </Link>
                  </div>
                </div>
                <div className="divide-y dark:divide-gray-700">
                  {trendingQuestions.map((question) => (
                    <div key={question._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center mb-4">
                        {question.author?.avatar?.type === 'image' ? (
                          <img
                            src={question.author.avatar.url}
                            alt={question.author.username}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${question.author?.avatar?.color || 'bg-blue-600 dark:bg-blue-500 text-white'}`}>
                            {question.author.username.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="ml-3">
                          <h3 className="font-medium dark:text-white">{question.author.username}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {moment(question.createdAt).format('MMM D, YYYY')}
                          </p>
                        </div>
                      </div>
                      <Link to={`/questions/${question._id}`}>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-3">
                          {question.title}
                        </h3>
                      </Link>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                        <span className="flex items-center">
                          <i className="ri-thumb-up-line mr-1"></i>
                          {question.voteCount}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-message-2-line mr-1"></i>
                          {question.answers?.length || 0}
                        </span>
                        <span className="flex items-center">
                          <i className="ri-eye-line mr-1"></i>
                          {question.viewCount}
                        </span>
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
