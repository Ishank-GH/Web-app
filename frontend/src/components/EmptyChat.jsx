import React from 'react'

const EmptyChat = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm h-[78vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-message-3-line text-4xl text-blue-600"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Messages</h2>
        <p className="text-gray-600 mb-6">Send private messages to a friend or colleague</p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Start a Conversation
        </button>
      </div>
    </div>
  );
};

export default EmptyChat
