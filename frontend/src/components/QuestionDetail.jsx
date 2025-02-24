import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import formatDate from '../helper/Date'

const QuestionDetail = () => {
  const {questionId} = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerBody, setAnswerBody] = useState('');

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
    console.log(res.data)
    }catch(err){
      console.error('Error voting', err);
    }
  }

  if(!question){
    return <div className='max-w-4xl mx-auto p-4'>Loading Question..</div>
  }

  return (
    <div className="max-w-4xl mx-auto border border-gray-400 bg-white p-6 px-8 rounded-lg hover:shadow-md mb-4 mt-10">
      {/* Question Section */}
      <div className='flex justify-between items-center mb-4'>
      <div>
      <h1 className='text-2xl font-bold text-gray-800 mb-4'>{question.title}</h1>
      <p className='mb-4 mt-1 text-gray-500'>{question.body}</p>
      </div>
      {/* Voting Controls */}
      <div className=' mb-8'>
           <div className="flex flex-col items-center ">
             <button className='text-base hover:text-gray-600 focus:outline-none' onClick={() => handleVote("upvote")}>
               ▲
             </button>
             <span className='text-black'>{question.voteCount}</span>
             <button className='text-base hover:text-gray-600 focus:outline-none' onClick={() => handleVote("downvote")}>
               ▼
             </button>
           </div>
           </div>
           </div>

<hr className='w-full mb-5 mt-4 border-t-2 border-gray-400'/>

      <h2 className="text-xl font-bold mb-4">{answers?.length || 0} Answers</h2>
      {/* Existing Answers */}
      {answers?.map((answer, index) => (
        <div key={answer._id || index} className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-gray-800">{answer.body}</p>
            <div className="mt-2 text-sm text-gray-500">
                Answered by {answer.author?.username || 'Unknown'}  •  {formatDate(answer.createdAt)}
            </div>
        </div>
      ))}

      {/* Answer Input */}
      <form onSubmit={handleAnswerSubmit} className="mt-6 space-y-4">
        <textarea
          value={answerBody}
          onChange={(e) => setAnswerBody(e.target.value)}
          rows="5"
          className="mt-1 w-full rounded-md border border-gray-400 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Write your answer..."
          required
        />
        <button
          type="submit"
          onClick={handleAnswerSubmit}
          className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Post Answer
        </button>
      </form>
    </div>
  );
};

export default QuestionDetail;