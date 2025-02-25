const mongoose = require('mongoose')

const answerSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        maxlength: [2000, 'Max length is 2000']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question',
        required: true,
    },
    votes: {
        upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
        downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
    },
    views: {
        type: Number,
        default: 0
    }
}, {timestamps: true})

//its a net vote count and total vote count
answerSchema.virtual('voteCount').get(function(){
    return this.votes.upvotes.length - this.votes.downvotes.length
})

const answerModel = mongoose.model('answer', answerSchema)

module.exports = answerModel;