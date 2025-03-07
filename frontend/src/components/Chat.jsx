import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import ToolTip from "../helper/ToolTip";

const Chat = ({ selectedUser }) => {
  const [message, setMessage] = useState("");
  const emojiRef = useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const getInitials = (name) => {
    return name ? name.slice(0, 2).toUpperCase() : "??";
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Add logic to send message
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex gap-4">
      <div className="flex-1 bg-white rounded-xl shadow-sm h-[78vh] flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center overflow-hidden ${
              selectedUser.avatar?.type !== 'image' ? 'bg-blue-100' : ''
            }`}>
              {selectedUser.avatar?.type === 'image' ? (
                <img 
                  src={selectedUser.avatar.url} 
                  alt={selectedUser.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className={`h-full w-full flex items-center justify-center ${selectedUser.avatar?.color || 'bg-blue-100'}`}>
                  {getInitials(selectedUser.username)}
                </div>
              )}
            </div>
            <div className="ml-3">
              <h2 className="font-semibold">{selectedUser.username}</h2>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.isSender
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {!msg.isSender && (
                  <p className="text-sm font-semibold mb-1">{msg.sender}</p>
                )}
                <p>{msg.text}</p>
                <p
                  className={`text-xs ${
                    msg.isSender ? "text-blue-100" : "text-gray-500"
                  } text-right mt-1`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex items-center space-x-2 py-3 px-2 border-t">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <ToolTip message="Attachments">
            <button className="px-2 py-1 focus:border-none focus:outline-none duration-300 transition-all text-neutral-800 rounded-lg hover:bg-blue-600 hover:text-white ">
              <i className="ri-attachment-2 text-2xl"></i>
            </button>
          </ToolTip>

          <div className="relative">
            <ToolTip message="Emojis">
              <button
                className="px-2 py-1 focus:border-none focus:outline-none duration-300 transition-all text-neutral-800 rounded-lg hover:bg-blue-600 hover:text-white"
                onClick={() => setEmojiPickerOpen(true)}
              >
                <i className="ri-emoji-sticker-fill text-2xl"></i>
              </button>
              <div className="absolute bottom-16 right-0" ref={emojiRef}>
                <EmojiPicker
                  open={emojiPickerOpen}
                  onEmojiClick={handleAddEmoji}
                  autoFocusSearch={false}
                  width={300}
                  height={400}
                />
              </div>
            </ToolTip>
          </div>

          <button
            type="submit"
            className="bg-blue-600 focus:border-none focus:outline-none duration-300 transition-all text-white px-3 py-2 rounded-lg hover:bg-blue-700"
            onClick={handleSendMessage}
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
