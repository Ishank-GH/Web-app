import React from 'react'

const EmptyChat = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm h-[78vh] flex items-center justify-center">
      <div className="text-center">
        <i className="ri-message-3-line text-6xl text-gray-300"></i>
        <h2 className="text-xl font-semibold text-gray-600 mt-4">Your Messages</h2>
        <p className="text-gray-500 mt-2">Select a user to start messaging</p>
      </div>
    </div>
  )
}

export default EmptyChat
