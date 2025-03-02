import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import formatDate from '../helper/Date';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

const QuestionDetail = () => {
  const { questionId } = useParams();
  const {answerId } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerBody, setAnswerBody] = useState('');
  const [answerSort, setAnswerSort] = useState('votes');
  const [isPreview, setIsPreview] = useState(false);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchQuestions = async () => {
      try{
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/questions/${questionId}`)
        setQuestion(res.data)        
        setAnswers(res.data.answers)
      }catch(err){
        console.error('Fetching Error', err)
      }
    };

    fetchQuestions();
  }, [questionId])

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/questions/${questionId}/answers`, {
        body: answerBody,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
      }
      });
      
      const newAnswer = res.data.data
      setAnswers((prevAnswers)=> [...prevAnswers, newAnswer])
      setAnswerBody('');
      // Refresh answers list (you may use state lifting or React Query)
    } catch (err) {
      console.error('Error posting answer:', err);
    }
  };

  const handleVote = async(voteType)=> {
    try{
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/questions/${questionId}/vote`,{
      vote: voteType
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    })
    setQuestion(res.data)
    }catch(err){
      console.error('Error voting', err);
    }
  }

  const handleAnswerVote = async(answerId, voteType) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/questions/${questionId}/answers/${answerId}/vote`,
        { vote: voteType },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      // Update the answers state with the new vote count
      setAnswers(prevAnswers => 
        prevAnswers.map(answer => 
          answer._id === answerId ? { ...answer, ...res.data } : answer
        )
      );
    } catch (err) {
      console.error('Error voting on answer:', err);
    }
  };

  const filteredAndSortedAnswers = answers
    .filter(q => 
      q.body
    ).sort((a, b) => {
    switch (answerSort) {
      case 'votes': return b.voteCount - a.voteCount;
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
      default: return 0;
    }
  });

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto p-6">
      <button 
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
      >
        <i className="ri-arrow-left-line mr-2"></i>
        Go Back
      </button>
      {/* Question Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex gap-6">
          {/* Vote Controls */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleVote("upvote")}
              className="transform hover:scale-110 transition-transform text-2xl text-gray-500 hover:text-blue-600"
            >
              <i className="ri-arrow-up-s-line"></i>
            </button>
            <span className="my-2 text-xl font-bold">{question?.voteCount || 0}</span>
            <button
              onClick={() => handleVote("downvote")}
              className="transform hover:scale-110 transition-transform text-2xl text-gray-500 hover:text-blue-600"
            >
              <i className="ri-arrow-down-s-line"></i>
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{question.title}</h1>
            <div className="prose prose-lg max-w-none mb-6">
              <ReactMarkdown>{question.body}</ReactMarkdown>
            </div>
            
            {/* for tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags?.map(tag => (
                <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4">
              <div className="flex items-center gap-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${question.author.username}&background=random`}
                  alt={question.author.username}
                  className="w-10 h-10 rounded-full ring-2 ring-blue-100"
                />
                <div>
                  <div className="font-semibold">{question.author.username}</div>
                  <div className="text-gray-500">Asked {formatDate(question.createdAt)}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span><i className="ri-eye-line mr-1"></i> {question.viewCount} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          <select
            value={answerSort}
            onChange={(e) => setAnswerSort(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white shadow-sm hover:border-blue-500 transition-colors"
          >
            <option value="votes">Highest Votes</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Answer List */}
        <div className="space-y-6">
          {filteredAndSortedAnswers.map(answer => (
            <div key={answer._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleAnswerVote(answer._id, "upvote")}
                    className="text-2xl text-gray-500 hover:text-blue-600 focus:outline-none"
                  >
                    <i className="ri-arrow-up-s-line"></i>
                  </button>
                  <span className="my-2 font-bold">{answer.voteCount || 0}</span>
                  <button
                    onClick={() => handleAnswerVote(answer._id, "downvote")}
                    className="text-2xl text-gray-500 hover:text-blue-600 focus:outline-none"
                  >
                    <i className="ri-arrow-down-s-line"></i>
                  </button>
                </div>
                <div className="flex-1">
                  <div className="prose max-w-none mb-4">
                    <ReactMarkdown>{answer.body}</ReactMarkdown>
                  </div>
                  <div className="flex justify-end items-center text-sm text-gray-500">
                    <img
                      src={`https://ui-avatars.com/api/?name=${answer.author.username}`}
                      alt={answer.author.username}
                      className="w-6 h-6 rounded-full mr-2"
                    />
                    <span>Answered by {answer.author.username}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(answer.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Answer form */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4">Your Answer</h3>
        <div className="mb-4">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isPreview ? "Edit" : "Preview"}
            </button>
          </div>
          {isPreview ? (
            <div className="prose max-w-none p-4 border rounded-lg bg-gray-50">
              <ReactMarkdown>{answerBody}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={answerBody}
              onChange={(e) => setAnswerBody(e.target.value)}
              rows="6"
              className="w-full border rounded-lg p-4 focus:ring-2 focus:ring-blue-500"
              placeholder="Write your answer here... Markdown is supported"
            />
          )}
        </div>
        <button
          onClick={handleAnswerSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Post Your Answer
        </button>
      </div>
    </div>
  );
};

export default QuestionDetail;