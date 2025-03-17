const mongoose = require('mongoose');
const { channelType } = require('./enums');

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: Object.values(channelType),
    default: channelType.TEXT
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'community',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  activeMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
}, { timestamps: true });

module.exports = mongoose.model('channel', channelSchema);

