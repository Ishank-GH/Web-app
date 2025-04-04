import React from 'react'

const EmptyChat = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-[78vh] flex items-center justify-center transition-colors duration-200">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="ri-message-3-line text-4xl text-blue-600 dark:text-blue-400"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Messages</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Send private messages to a friend or colleague</p>
        <button className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
          Start a Conversation
        </button>
      </div>
    </div>
  );
};

export default EmptyChat
