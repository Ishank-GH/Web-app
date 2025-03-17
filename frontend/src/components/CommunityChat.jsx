import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useUser } from '../context/UserContext';
import EmojiPicker from 'emoji-picker-react';
import moment from 'moment';
import { toast } from 'react-toastify';

const CommunityChat = ({ channel }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { socket } = useSocket();
  const { user } = useUser();
  const messagesEndRef = useRef(null);
  const emojiRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    // Add small timeout to ensure DOM has updated
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const getInitials = (name) => {
    return name ? name.slice(0, 2).toUpperCase() : "??";
  };

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/channels/${channel._id}/messages`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setMessages(response.data.data);
        scrollToBottom();
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    if (channel?._id) {
      loadMessages();
      socket?.emit('joinChannel', channel._id);
    }

    return () => {
      if (channel?._id) {
        socket?.emit('leaveChannel', channel._id);
      }
    };
  }, [channel, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on('communityMessage', (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    });

    socket.on('userJoinedCommunity', (data) => {
      const systemMessage = {
        _id: Date.now(),
        content: `${data.username} joined the channel`,
        type: 'system',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    socket.on('userLeftCommunity', (data) => {
      const systemMessage = {
        _id: Date.now(),
        content: `${data.username} left the channel`,
        type: 'system',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    return () => {
      socket.off('communityMessage');
      socket.off('userJoinedCommunity');
      socket.off('userLeftCommunity');
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Allow sending if there's either text or image
    if ((!message.trim() && !imagePreview) || !socket) return;

    try {
      // First handle image if present
      if (imagePreview) {
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
          const imageMessageData = {
            channelId: channel._id,
            messageType: 'file',
            fileUrl: response.data.filePath
          };
          
          socket.emit('sendCommunityMessage', imageMessageData);
        }
      }

      // Then handle text if present
      if (message.trim()) {
        const textMessageData = {
          channelId: channel._id,
          content: message.trim(),
          messageType: 'text'
        };
        
        socket.emit('sendCommunityMessage', textMessageData);
      }
      
      // Clear both message and image preview
      setMessage('');
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to send message');
    }
  };

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
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm h-[78vh] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <div className="flex-1">
            <h2 className="font-semibold text-lg">#{channel.name}</h2>
            <p className="text-sm text-gray-500">{channel.description}</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4" style={{ scrollBehavior: 'smooth' }}>
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
                <div className={`flex ${msg.type === 'system' ? 'justify-center' : msg.sender?._id === user._id ? 'justify-end' : 'justify-start'} mb-4`}>
                  {msg.type === 'system' ? (
                    <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-500">
                      {msg.content}
                    </div>
                  ) : (
                    <div className={`flex items-start max-w-[70%] ${msg.sender?._id === user._id ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* User Avatar */}
                      <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden mx-2">
                        {msg.sender?.avatar?.url ? (
                          <img 
                            src={msg.sender.avatar.url} 
                            alt={msg.sender.username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className={`h-full w-full flex items-center justify-center bg-blue-100 text-blue-600`}>
                            {getInitials(msg.sender?.username)}
                          </div>
                        )}
                      </div>

                      {/* Message Content */}
                      <div className={`rounded-lg p-3 ${
                        msg.sender?._id === user._id ? 'bg-blue-600 text-white' : 'bg-gray-100'
                      }`}>
                        {msg.sender?._id !== user._id && (
                          <p className="text-sm font-semibold mb-1">{msg.sender?.username}</p>
                        )}
                        {msg.messageType === 'file' ? (
                          <img src={msg.fileUrl} alt="Shared file" className="max-w-full rounded mt-2" />
                        ) : (
                          <p>{msg.content}</p>
                        )}
                        <p className={`text-xs ${
                          msg.sender?._id === user._id ? 'text-blue-100' : 'text-gray-500'
                        } text-right mt-1`}>
                          {moment(msg.timestamp).format('h:mm A')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} className="h-[1px]" /> 
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4">
            <div className="relative inline-block">
              <img 
                src={imagePreview.preview} 
                alt="Preview" 
                className="max-h-32 rounded-lg"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="ri-emotion-line text-xl"></i>
          </button>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-gray-700"
          >
            <i className="ri-attachment-2 text-xl"></i>
          </button>
          
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message #${channel.name}`}
            className="flex-1 rounded-lg border p-2 focus:outline-none focus:border-blue-500"
          />
          
          <button
            type="submit"
            disabled={!message.trim() && !imagePreview}
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*"
      />

      {/* Emoji Picker */}
      {emojiPickerOpen && (
        <div ref={emojiRef} className="absolute bottom-20 left-4">
          <EmojiPicker
            onEmojiClick={(emojiObject) => {
              setMessage(prev => prev + emojiObject.emoji);
              setEmojiPickerOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CommunityChat;