import React, { useEffect, useRef, useState } from "react";
import { useSocket } from '../context/SocketContext';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import EmojiPicker from "emoji-picker-react";
import ToolTip from "../helper/ToolTip";
import { toast } from 'react-toastify';
import moment from 'moment';

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
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    if (imagePreview) {
      await handleSendWithImage();
    }

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
    if(fileInputRef.current){
      fileInputRef.current.click()
    }
  }
  const handleFileChange = async(e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new formData();
        formData.append('file', file)
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/messages/upload-file`,
          file,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        
        if (response.status===200 && response.data) {
          const messageData = {
            sender: user._id,
            recipient: selectedUser._id,
            content: undefined,
            messageType: 'file',
            fileUrl: response.data.filePath
          };
          
          socket.emit('sendMessage', messageData);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to upload file");
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const preview = URL.createObjectURL(file);
      setImagePreview({
        file,
        preview
      });
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

  const handleSendWithImage = async () => {
    if (imagePreview) {
      try {
        const formData = new FormData();
        formData.append('file', imagePreview.file);
        
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
           
            channelId: channel._id,
            messageType: 'file',
            fileUrl: response.data.filePath
          };
          
          socket.emit('sendCommunityMessage', messageData); 
          setImagePreview(null);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to upload image');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex gap-4">
      <div className="flex-1 bg-white rounded-xl shadow-sm h-[78vh] flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
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
                <h2 className="font-bold text-gray-900">{selectedUser.username}</h2>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-500">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <i className="ri-search-line text-gray-600"></i>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <i className="ri-more-2-fill text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
                      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        {moment(msg.timestamp).format('MMMM D, YYYY')}
                      </span>
                    </div>
                  )}
                  <div className={`flex ${msg.sender._id === user._id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender._id === user._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {msg.sender._id !== user._id && (
                        <p className="text-sm font-semibold mb-1">{msg.sender.username}</p>
                      )}
                      <p>{msg.content}</p>
                      <p className={`text-xs ${
                        msg.sender._id === user._id ? "text-blue-100" : "text-gray-500"
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
          <div className="p-4 border-t">
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
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 py-3 px-2 border-t">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          />
          <ToolTip message="Attachments">
            <button 
              type="button"
              className="px-2 py-1 focus:border-none focus:outline-none duration-300 transition-all text-neutral-800 rounded-lg hover:bg-blue-600 hover:text-white"
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
                className="px-2 py-1 focus:border-none focus:outline-none duration-300 transition-all text-neutral-800 rounded-lg hover:bg-blue-600 hover:text-white"
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
