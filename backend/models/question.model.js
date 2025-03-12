const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: [250, 'Max length is 250 characters']
    },
    images: [{
        url: String,
        publicId: String
    }],
    body: {
        type: String,
        required: true,
        maxlength: [5000, 'Max length is 5000 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    votes: {
        upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
        downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user'}]
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'answer'
    }],
    views: {
        type: Number,
        default: 0
    }
}, {timestamps: true})


//a net vote count 
questionSchema.virtual('voteCount').get(function(){
    return this.votes.upvotes.length - this.votes.downvotes.length
})

questionSchema.virtual('viewCount').get(function(){
    return this.views
})

//creates text index on title and body
questionSchema.index({ title: "text", body:"text"});
//creates index for createdAt field  in descending order to sort by creating date
questionSchema.index({ createdAt: -1});
//creates index for voteCount in descending order to sort efficiently
questionSchema.index({ voteCount: -1});

questionSchema.set('toJSON', {virtuals: true})
questionSchema.set('toObject', {virtuals: true})

const questionModel = mongoose.model('question', questionSchema)

module.exports = questionModel