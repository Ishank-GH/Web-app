const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  imageUrl: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  inviteCode: {
    type: String,
    unique: true
  },
  channels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'channel'
  }],
  profilePicture: {
    type: String, 
    default: null
  },
  avatar: {
    type: Object,
    default: {
      type: 'initial',
      color: 'bg-blue-600 text-white',
      url: null,
      publicId: null
    }
  }
}, { timestamps: true });

const communityModel = mongoose.model('community', communitySchema);

module.exports = communityModel;