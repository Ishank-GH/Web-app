const questionModel = require('../models/question.model');
const asyncHandler = require('../middlewares/asyncHandler.middleware')

exports.createQuestion = asyncHandler(async(req, res) => {
        const { title, body} = req.body;

        const question = await questionModel.create({
            title,
            body,
            author: req.user._id
        })

        res.status(201).json({
            success: true,
            data: question
        })
})

exports.getQuestion = asyncHandler(async(req, res) => {
    const question = await questionModel.findByIdAndUpdate(req.params.id,
        { $inc: { views: +1}},
        { new: true} //ensures to get the updated document
    )
        .populate('author', 'username profilePicture')
        .populate({
            path: 'answers',
            populate: {
                path: 'author',
                select: 'username profilePicture'
            }
        });

    if(!question){
        res.status(404).json({ message: "Question not found"})
    }

    res.json(question);
});

exports.getQuestions = asyncHandler(async(req, res) => {
        const { sort = "-createdAt"} = req.query

        const questions = await questionModel.find()
        .sort(sort)
        .populate('author', 'username profilePicture')
        .populate({
            path: "answers",
            select: "body createdAt",
            option: { limit : 1}
        })

        res.json(questions);
})

exports.voteQuestion = asyncHandler(async(req, res) => {

        const question = await questionModel.findById(req.params.id)
        const {vote} = req.body;

        // remove existing votes
        question.votes.upvotes = question.votes.upvotes.filter(
            (id) => !id.equals(req.user._id)
        );
        question.votes.downvotes = question.votes.downvotes.filter(
            (id) => !id.equals(req.user._id)
        );

        // adding votes
        if(vote === 'upvote'){
            question.votes.upvotes.push(req.user._id);
        }
        else if(vote === 'downvote'){
            question.votes.downvotes.push(req.user._id);
        }
        
        await question.save();

        res.json(question)

})

exports.updateQuestion = asyncHandler(async(req, res) => {
    const { title, body} = req.body;
    
    const question = await questionModel.findById(req.params.id)

    if(!question){
        return res.status(404).json({message: 'Question not found'})
    }

    if(!question.author.equals(req.user._id)){
        const err = new Error('Only the author can edit the question')
        err.statusCode = 403;
        throw err;
    }

    question.title = title || question.title;
    question.body = body || question.body;
    await question.save();

    res.status(200).json({
        success: true,
        message: 'Question updated',
        data: question
    })
})

exports.deleteQuestion = asyncHandler(async(req, res) => {
    const question = await questionModel.findById(req.params.id)

    if(!question.author.equals(req.user._id)){
        const err = new Error('Only author can delete the question')
        err.statusCode = 403;
        throw err;
    }

    await question.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Question deleted',
    })
})