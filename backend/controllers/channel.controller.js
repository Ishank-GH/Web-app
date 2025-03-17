const asyncHandler = require('../middlewares/asyncHandler.middleware');
const Channel = require('../models/channel.model');
const Message = require('../models/message.model');
const Community = require('../models/community.model');
const { channelType } = require('../models/enums');
const mongoose = require('mongoose');

exports.getChannels = asyncHandler(async (req, res) => {
  const channels = await Channel.find()
    .populate('community', 'name')
    .populate('createdBy', 'username');

  res.json({
    success: true,
    data: channels
  });
});

exports.createChannel = asyncHandler(async (req, res) => {
  const { name, description, type = 'TEXT' } = req.body;
  const { communityId } = req.params;

  // First check if community exists
  const community = await Community.findById(communityId);
  if (!community) {
    return res.status(404).json({
      success: false,
      message: 'Community not found'
    });
  }

  // Create new channel
  const channel = await Channel.create({
    name,
    description,
    type,
    community: communityId,
    createdBy: req.user._id,
    members: [req.user._id]
  });

  // Add channel to community and save
  community.channels.push(channel._id);
  await community.save();

  // Fetch the populated channel
  const populatedChannel = await Channel.findById(channel._id)
    .populate('createdBy', 'username avatar')
    .populate('community', 'name');

  res.status(201).json({
    success: true,
    data: populatedChannel
  });
});

exports.getChannelMessages = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const messages = await Message.find({ channel: channelId })
    .populate('sender', 'username avatar') 
    .sort({ timestamp: 1 });

  res.json({
    success: true,
    data: messages
  });
});

exports.createChannelMessage = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  const { content, type = 'text' } = req.body;

  const channel = await Channel.findById(channelId)
    .populate('community');

  if (!channel) {
    return res.status(404).json({
      success: false,
      message: 'Channel not found'
    });
  }

  const message = await Message.create({
    channel: channelId,
    sender: req.user._id,
    content,
    type
  });

  const populatedMessage = await message.populate('sender', 'username avatar');

  // Emit to socket if needed
  if (req.io) {
    req.io.to(`channel:${channelId}`).emit('channel:message', message);
  }

  res.status(201).json({
    success: true,
    data: populatedMessage
  });
});

exports.listOfChannels = asyncHandler(async (req, res) => {
  const { communityId } = req.params;

  const channels = await Channel.find({ community: communityId })
    .populate('createdBy', 'username avatar')
    .sort({ createdAt: 1 });

  res.json({
    success: true,
    data: channels || [] // Ensure we always return an array
  });
});

