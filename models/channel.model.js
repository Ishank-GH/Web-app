const mongoose = require('mongoose');
const { channelType } = require('./enums');

const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: Object.values(channelType),
        default: channelType.TEXT,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'community',
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile',
        required: true
    },
    
}, { timestamps: true })


const channelModel = mongoose.model("channel", channelSchema);

module.exports = channelModel;

