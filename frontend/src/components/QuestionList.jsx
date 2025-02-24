import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import formatDate from "../helper/Date";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/questions`
        );
        console.log("Fetched questions", res.data);

        setQuestions(res.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };
    fetchQuestions();
  }, []);

  //calculating total pages
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  //last question index for the current page
  const lastQuestionIndex = currentPage * questionsPerPage;

  //first question index for the current page
  const firstQuestionIndex = lastQuestionIndex - questionsPerPage;

  //slicing questions array to get questions for this page
  const currentQuestions = questions.slice(
    firstQuestionIndex,
    lastQuestionIndex
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Questions</h1>
        <Link
          to="/questions/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Ask Question
        </Link>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : questions.length > 0 ? (
        currentQuestions.map((question) => {
          return (
            <div
              key={question._id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow mb-4"
            >
              
              <div className="mb-1 flex items-center text-sm text-gray-600">
                <span>{question.voteCount} votes</span>
                <span className="mx-2">•</span>
                <span>{question.answers.length} answers</span>
                <span className="mx-2">•</span>
                <span>{question.viewCount} views</span>
              </div>

              <div className="flex justify-between">
                <div>
                  <h2 className="text-lg font-bold mb-2">{question.title}</h2>

                  <p className=" text-gray-700 mb-3 line-clamp-3 overflow-hidden text-ellipsis break-words ">
                    {question.body}
                  </p>

                  <Link
                    to={`/questions/${question._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </Link>
                </div>
                <div className="text-xs mt-[81px] text-gray-500 font-semibold flex items-center justify-between">
                  <div> Asked by: {question.author.username} </div>
                  <span className="ml-2">|</span>
                  <div className="ml-2"> {formatDate(question.createdAt)}</div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center">No questions found. </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-center space-x-4 mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 hover:bg-blue-700 transition"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page <strong>{currentPage}</strong> of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 hover:bg-blue-700 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};
export default QuestionList;
