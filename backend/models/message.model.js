const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'channel'
    },
    messageType: {
        type: String,
        enum: ['text', 'file', 'system'],
        default: 'text'
    },
    content: {
        type: String,
        required: function() {
            return this.messageType === 'text' || this.messageType === 'system';
        }
    },
    fileUrl: {
        type: String,
        required: function() {
            return this.messageType === 'file';
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

messageSchema.index({ sender: 1, recipient: 1, timestamp: -1 });
messageSchema.index({ recipient: 1, read: 1 });

messageSchema.methods.markAsRead = function() {
    this.read = true;
    return this.save();
};

const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;