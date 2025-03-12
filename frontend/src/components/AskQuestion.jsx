import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const navigate = useNavigate();

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
      
      imageFiles.forEach(file => {
        formData.append('images', file);
      });

      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/questions/create`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      navigate("/questions");
    } catch (err) {
      console.error("Error posting question:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 flex items-center text-gray-600 hover:text-gray-800"
      >
        <i className="ri-arrow-left-line mr-2"></i>
        Go Back
      </button>
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Ask a Question</h1>
          <p className="text-gray-600 mt-1">Share your knowledge with the community</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="What's your programming question? Be specific."
              required
            />
          </div>

          {/* Description field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {isPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
            {isPreview ? (
              <div className="prose max-w-none p-4 border rounded-lg bg-gray-50">
                <ReactMarkdown>{body}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows="8"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Include all the information someone would need to answer your question... Markdown is supported"
                required
              />
            )}
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Images (optional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {images.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImages(images.filter((_, i) => i !== index));
                        setImageFiles(imageFiles.filter((_, i) => i !== index));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors font-medium"
          >
            Post Your Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;