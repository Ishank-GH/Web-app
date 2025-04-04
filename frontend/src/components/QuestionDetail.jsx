import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';

const QuestionDetail = () => {
  const { questionId } = useParams();
  const { answerId } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerBody, setAnswerBody] = useState('');
  const [answerSort, setAnswerSort] = useState('votes');
  const [isPreview, setIsPreview] = useState(false);
  const [answerImages, setAnswerImages] = useState([]);
  const [answerImageFiles, setAnswerImageFiles] = useState([]);
  const navigate = useNavigate();

  const getInitials = (name) => {
    return name ? name.slice(0, 2).toUpperCase() : "??";
  };

  const renderAvatar = (user, size = "w-10 h-10") => {
    if (user?.avatar?.type === 'image') {
      return (
        <img
          src={user.avatar.url}
          alt={user.username}
          className={`${size} rounded-full ring-2 ring-blue-100`}
        />
      );
    }
    return (
      <div className={`${size} rounded-full flex items-center justify-center ${user.avatar?.color || 'bg-blue-600 text-white'} ring-2 ring-blue-100`}>
        {getInitials(user.username)}
      </div>
    );
  };

  const renderVoteButtons = (count, onUpvote, onDownvote, size = "text-2xl") => (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={onUpvote}
        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${size} text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all`}
      >
        <i className="ri-arrow-up-circle-line"></i>
      </button>
      <span className={`${size} font-bold text-gray-900 dark:text-white`}>{count || 0}</span>
      <button
        onClick={onDownvote}
        className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${size} text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all`}
      >
        <i className="ri-arrow-down-circle-line"></i>
      </button>
    </div>
  );

  const renderImageGrid = (images, altPrefix = "Image") => {
    if (!images?.length) return null;
    
    return (
      <div className="grid grid-cols-2 gap-4 mt-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.url}
            alt={`${altPrefix} ${index + 1}`}
            className="rounded-lg max-h-96 object-contain"
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/questions/${questionId}`)
        setQuestion(res.data)
        setAnswers(res.data.answers)
      } catch (err) {
        console.error('Fetching Error', err)
      }
    };

    fetchQuestions();
  }, [questionId])

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    // Validate answer body
    if (!answerBody.trim()) {
      toast.error('Answer body is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('body', answerBody.trim());

      // Only append images if they exist
      if (answerImageFiles.length > 0) {
        answerImageFiles.forEach(file => {
          formData.append('images', file);
        });
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/questions/${questionId}/answers`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setAnswers(prevAnswers => [...prevAnswers, response.data.data]);

      setAnswerBody('');
      setAnswerImages([]);
      setAnswerImageFiles([]);
      setIsPreview(false);

      toast.success('Answer posted successfully');
    } catch (err) {
      console.error('Error posting answer:', err);
      toast.error(err.response?.data?.message || 'Failed to post answer');
    }
  };

  const handleVote = async (voteType) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/questions/${questionId}/vote`, {
        vote: voteType
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      setQuestion(res.data)
    } catch (err) {
      console.error('Error voting', err);
    }
  }

  const handleAnswerVote = async (answerId, voteType) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/questions/${questionId}/answers/${answerId}/vote`,
        { vote: voteType },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setAnswers(prevAnswers =>
        prevAnswers.map(answer =>
          answer._id === answerId ? { ...answer, ...res.data } : answer
        )
      );
    } catch (err) {
      console.error('Error voting on answer:', err);
    }
  };

  const handleAnswerImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setAnswerImageFiles(files);

    const previews = files.map(file => URL.createObjectURL(file));
    setAnswerImages(previews);
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

  return (
    <div className="max-w-6xl mx-auto">
      {question ? (
        <div className="space-y-6">
          {/* Question Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-6"
            >
              <i className="ri-arrow-left-line text-2xl hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1"></i>
            </button>

            <div className="flex gap-6">
              {renderVoteButtons(
                question.voteCount,
                () => handleVote("upvote"),
                () => handleVote("downvote")
              )}

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{question.title}</h1>
                <div className="prose dark:prose-invert prose-gray max-w-none mb-6 text-gray-800 dark:text-gray-200">
                  <ReactMarkdown>{question.body}</ReactMarkdown>
                  {renderImageGrid(question.images, "Question image")}
                </div>

                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 border-t dark:border-gray-700 pt-4">
                  <div className="flex items-center gap-3">
                    {renderAvatar(question.author)}
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{question.author.username}</div>
                      <div className="text-gray-500 dark:text-gray-400">Asked {moment(question.createdAt).fromNow()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center"><i className="ri-eye-line mr-1"></i> {question.viewCount} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
              </h2>
              <select
                value={answerSort}
                onChange={(e) => setAnswerSort(e.target.value)}
                className="px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-blue-500 dark:hover:border-blue-400"
              >
                <option value="votes">Highest Votes</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            <div className="space-y-6">
              {filteredAndSortedAnswers.map(answer => (
                <div key={answer._id} className="border dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                  <div className="flex gap-6">
                    {renderVoteButtons(
                      answer.voteCount,
                      () => handleAnswerVote(answer._id, "upvote"),
                      () => handleAnswerVote(answer._id, "downvote"),
                      "text-xl"
                    )}
                    <div className="flex-1">
                      <div className="prose dark:prose-invert prose-gray max-w-none mb-4 text-gray-800 dark:text-gray-200">
                        <ReactMarkdown>{answer.body}</ReactMarkdown>
                        {renderImageGrid(answer.images, "Answer image")}
                      </div>
                      <div className="flex justify-end items-center text-sm text-gray-500 dark:text-gray-400">
                        {renderAvatar(answer.author, "w-6 h-6 mr-2")}
                        <span>Answered by <span className="text-gray-700 dark:text-gray-300">{answer.author.username}</span></span>
                        <span className="mx-2">•</span>
                        <span>{moment(answer.createdAt).fromNow()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Answer Form Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Your Answer</h3>
            <form onSubmit={handleAnswerSubmit}>
              <div className="mb-4">
                <div className="flex justify-end mb-2">
                  <button
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {isPreview ? "Edit" : "Preview"}
                  </button>
                </div>
                {isPreview ? (
                  <div className="prose dark:prose-invert prose-gray max-w-none p-4 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                    <ReactMarkdown>{answerBody}</ReactMarkdown>
                  </div>
                ) : (
                  <textarea
                    value={answerBody}
                    onChange={(e) => setAnswerBody(e.target.value)}
                    rows="6"
                    className="w-full border dark:border-gray-600 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Write your answer here... Markdown is supported"
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Add Images (optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAnswerImageSelect}
                  className="w-full p-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
                />

                {answerImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {answerImages.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border dark:border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setAnswerImages(answerImages.filter((_, i) => i !== index));
                            setAnswerImageFiles(answerImageFiles.filter((_, i) => i !== index));
                          }}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-sm transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Post Your Answer
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;