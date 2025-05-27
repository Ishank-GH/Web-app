import React, { useEffect, useRef, useState } from "react";
import { useSocket } from '../context/SocketContext';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import EmojiPicker from "emoji-picker-react";
import ToolTip from "../helper/Tooltip";
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from '../components/Loader';

const Chat = ({ selectedUser, onMessageSent }) => {
  const fileInputRef = useRef();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const emojiRef = useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const { socket } = useSocket();
  const { user } = useUser();
  const messagesEndRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "instant", 
        block: "end"
      });
    }
  };

  useEffect(() => {scrollToBottom();}, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/messages/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setMessages(response.data);
        scrollToBottom();
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedUser?._id) {
      loadMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;

    socket.on('receiveDirectMessage', (newMessage) => {
      if (
        newMessage.sender._id === selectedUser._id || 
        newMessage.recipient._id === selectedUser._id
      ) {
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
      }
    });

    return () => {
      socket.off('receiveDirectMessage');
    };
  }, [socket, selectedUser]);

   

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

  const handleEmojiClick = (e) => {
    e.preventDefault();
    setEmojiPickerOpen(!emojiPickerOpen);
  };

  const handleAddEmoji = (emojiObject) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
    setEmojiPickerOpen(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if ((!message.trim() && !imagePreview) || !socket) return;

    if (message.trim()) {
      const messageData = {
        sender: user._id,
        recipient: selectedUser._id,
        content: message.trim(),
        messageType: 'text',
        fileUrl: undefined,
      };
      
      socket.emit('sendMessage', messageData);
      
      const newMessage = {
        _id: Date.now(),
        sender: {
          _id: user._id,
          username: user.username,
          avatar: user.avatar
        },
        recipient: {
          _id: selectedUser._id,
          username: selectedUser.username,
          avatar: selectedUser.avatar
        },
        content: message.trim(),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
      onMessageSent();
    }
    
    setMessage('');
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Create preview first
        const preview = URL.createObjectURL(file);
        setImagePreview({
          file,
          preview
        });

        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/messages/upload-file`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (response.data) {
          const messageData = {
            sender: user._id,
            recipient: selectedUser._id,
            content: '',
            messageType: 'file',
            fileUrl: response.data.filePath
          };

          socket.emit('sendMessage', messageData);
        
          handleRemoveImage();
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to upload file");
        handleRemoveImage();
      }
    }
  };

  const handleRemoveImage = () => {
    if (imagePreview?.preview) {
      URL.revokeObjectURL(imagePreview.preview); // Clean up preview URL
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview?.preview) {
        URL.revokeObjectURL(imagePreview.preview);
      }
    };
  }, [imagePreview]);

  return (
    <div className="max-w-7xl mx-auto flex gap-4">
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm h-[84vh] flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full overflow-hidden">
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
              </div>
              <div className="ml-3">
                <h2 className="font-bold text-gray-900 dark:text-white">{selectedUser.username}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
          ) : (
            messages.map((msg, index) => {
              const showDate = index === 0 || 
                moment(msg.timestamp).format('YYYY-MM-DD') !== 
                moment(messages[index - 1].timestamp).format('YYYY-MM-DD');

              return (
                <React.Fragment key={msg._id}>
                  {showDate && (
                    <div className="text-center my-4">
                      <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                        {moment(msg.timestamp).format('MMMM D, YYYY')}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${msg.sender._id === user._id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender._id === user._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}>
                      {msg.sender._id !== user._id && (
                        <p className="text-sm font-semibold mb-1">{msg.sender.username}</p>
                      )}
                      {msg.messageType === 'file' ? (
                        <img 
                          src={msg.fileUrl} 
                          alt="Shared file" 
                          className="max-w-full rounded-lg"
                          loading="lazy"
                        />
                      ) : (
                        <p>{msg.content}</p>
                      )}
                      <p className={`text-xs ${
                        msg.sender._id === user._id ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                      } text-right mt-1`}>
                        {moment(msg.timestamp).format('h:mm A')}
                      </p>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="relative inline-block">
              <img 
                src={imagePreview.preview} 
                alt="Preview" 
                className="max-h-32 rounded-lg"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          </div>
        )}

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 py-3 px-2 border-t dark:border-gray-700">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-700 dark:text-white"
          />
          <ToolTip message="Attachments">
            <button 
              type="button"
              className="px-2 py-1 focus:border-none focus:outline-none duration-300 transition-all text-neutral-800 dark:text-white rounded-lg hover:bg-blue-600 hover:text-white"
              onClick={handleFileClick}
            >
              <i className="ri-attachment-2 text-2xl"></i>
            </button>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
          </ToolTip>

          <div className="relative">
            <ToolTip message="Emojis">
              <button
                type="button"
                className="px-2 py-1 focus:border-none focus:outline-none duration-300 transition-all text-neutral-800 dark:text-white rounded-lg hover:bg-blue-600 hover:text-white"
                onClick={handleEmojiClick}
              >
                <i className="ri-emoji-sticker-fill text-2xl"></i>
              </button>
              <div className="absolute bottom-16 right-0" ref={emojiRef}>
                {emojiPickerOpen && (
                  <EmojiPicker
                    onEmojiClick={handleAddEmoji}
                    autoFocusSearch={false}
                    width={300}
                    height={400}
                  />
                )}
              </div>
            </ToolTip>
          </div>

          <button
            type="submit"
            className="bg-blue-600 focus:border-none focus:outline-none duration-300 transition-all text-white px-3 py-2 rounded-lg hover:bg-blue-700"
          >
            <i className="ri-send-plane-fill"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
