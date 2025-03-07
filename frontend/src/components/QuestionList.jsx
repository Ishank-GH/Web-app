import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import formatDate from "../helper/Date";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [filter, setFilter] = useState("");
  const questionsPerPage = 10;

  // Add useRef for scroll functionality
  const questionsRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/questions`);
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };
    fetchQuestions();
  }, []);

  const filteredAndSortedQuestions = questions
    .filter(question => 
      question.title.toLowerCase().includes(filter.toLowerCase()) ||
      question.body.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "votes": return b.voteCount - a.voteCount;
        case "answers": return b.answers.length - a.answers.length;
        case "views": return b.viewCount - a.viewCount;
        default: return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const currentQuestions = filteredAndSortedQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const totalPages = Math.ceil(filteredAndSortedQuestions.length / questionsPerPage);

  // Modify page change handlers
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top of questions
    questionsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  console.log(questions)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div ref={questionsRef} className="bg-white rounded-xl shadow-sm p-6 mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All Questions</h1>
            <p className="text-gray-500 text-sm mt-1">{questions.length} questions</p>
          </div>
          <Link
            to="/questions/create"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            Ask Question
          </Link>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-3 top-2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search questions..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="votes">Most Votes</option>
            <option value="answers">Most Answers</option>
            <option value="views">Most Views</option>
          </select>
        </div>
      </div>

      {/* Question List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      ) : currentQuestions.length > 0 ? (
        <div className="space-y-4">
          {currentQuestions.map((question) => (
            <div key={question._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex gap-4 p-5">
                <div className="flex flex-col items-center text-center min-w-[80px]">
                  <div className="text-gray-700">
                    <div className="font-bold text-xl">{question.voteCount}</div>
                    <div className="text-sm">votes</div>
                  </div>
                  <div className={`mt-2 ${question.answers.length > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                    <div className="font-bold text-xl">{question.answers.length}</div>
                    <div className="text-sm">answers</div>
                  </div>
                  <div className="mt-2 text-gray-500">
                    <div className="text-sm">{question.viewCount} views</div>
                  </div>
                </div>
                         
                <div className="flex-1">
                  <Link to={`/questions/${question._id}`} className="text-xl font-semibold text-blue-600 hover:text-blue-800">
                    {question.title}
                  </Link>
                  <p className="mt-2 text-gray-600 line-clamp-2">{question.body}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {question.tags?.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end text-sm text-gray-500">
                    <div className="flex items-center">
                      {question.author?.avatar?.type === 'image' ? (
                        <img
                          src={question.author.avatar.url}
                          alt={question.author.username}
                          className="w-6 h-6 rounded-full mr-2"
                        />
                      ) : (
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${question.author?.avatar?.color || 'bg-blue-600 text-white'} mr-2`}>
                          {question.author.username.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span>Asked by {question.author.username}</span>
                      <span className="mx-2">•</span>
                      <span>{formatDate(question.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <i className="ri-questionnaire-line text-5xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">No questions found matching your criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white rounded-lg border disabled:opacity-50 hover:bg-gray-50"
          >
            <i className="ri-arrow-left-s-line"></i>
          </button>
          {/* Add page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white rounded-lg border disabled:opacity-50 hover:bg-gray-50"
          >
            <i className="ri-arrow-right-s-line"></i>
          </button> 
        </div>
      )}
    </div>
  );
};

export default QuestionList;