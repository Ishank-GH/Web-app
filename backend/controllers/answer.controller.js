const answerModel = require('../models/answer.model');
const asyncHandler = require('../middlewares/asyncHandler.middleware')
const questionModel = require('../models/question.model')

exports.createAnswer = asyncHandler(async(req, res) => {
    const { body} = req.body;

    const answer = await answerModel.create({
        body,
        author: req.user._id,
        question: req.params.questionId
    })


    const question = await questionModel.findById(req.params.questionId).populate('answers');
    question.answers.push(answer._id, answer.author)
    await question.save();

    res.status(201).json({
        success: true,
        data: answer
    })
})

exports.voteAnswer = asyncHandler(async(req, res) => {
    const answer = await answerModel.findById(req.params.id)

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    const { vote } = req.body;

    // remove existing votes
    answer.votes.upvotes = answer.votes.upvotes.filter(
        (id) => !id.equals(req.user._id)
    );
    answer.votes.downvotes = answer.votes.downvotes.filter(
        (id) => !id.equals(req.user._id)
    );

    // adding votes
    if(vote === 'upvote'){
        answer.votes.upvotes.push(req.user._id);
    }
    else if(vote === 'downvote'){
        answer.votes.downvotes.push(req.user._id);
    }

    await answer.save();

    res.json(answer);
});


exports.updateAnswer = asyncHandler(async(req, res) => {
    const { title, body} = req.body;
    
    const answer = await answerModel.findById(req.params.id)

    if(!answer){
        return res.status(404).json({message: 'Answer not found'})
    }

    if(!answer.author.equals(req.user._id)){
        const err = new Error('Only the author can edit the answer')
        err.statusCode = 403;
        throw err;
    }

    answer.title = title || answer.title;
    answer.body = body || answer.body;
    await answer.save();

    res.status(200).json({
        success: true,
        message: 'Answer updated',
        data: answer
    })
})

exports.deleteAnswer = asyncHandler(async(req, res) => {
    const answer = await answerModel.findById(req.params.id)

    if(!answer.author.equals(req.user._id)){
        const err = new Error('Only author can delete the answer')
        err.statusCode = 403;
        throw err;
    }

    await answer.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Answer deleted',
    })
})