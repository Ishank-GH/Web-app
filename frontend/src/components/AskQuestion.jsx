import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AskQuestion = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/questions/create`, { 
        title,
        body,
      },
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
      navigate('/questions');
    } catch (err) {
      console.error('Error posting question:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-20 border border-gray-400 rounded-lg hover:shadow-md mb-4">
      <h1 className="text-2xl font-bold mb-6">Ask a Question</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className='max-w-2xl'>
          <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter Question Title'
            className="border border-gray-300 p-2 mb-4 mt-1 block w-full rounded-md focus:outline-none shadow-sm focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={body}
            type="text"
            onChange={(e) => setBody(e.target.value)}
            rows="6"
            className="mt-1 border p-2 mb-4 block w-full rounded-md border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
            placeholder='Enter Question Description'
          />
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Post Question
        </button>
      </form>
    </div>
  );
};

export default AskQuestion;