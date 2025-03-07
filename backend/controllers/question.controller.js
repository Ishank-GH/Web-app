const questionModel = require('../models/question.model');
const asyncHandler = require('../middlewares/asyncHandler.middleware')
const { uploadOnCloudinary } = require('../services/upload.service');

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
        .populate('author', 'username avatar')
        .populate({
            path: 'answers',
            populate: {
                path: 'author',
                select: 'username avatar'
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
        .populate('author', 'username avatar')
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

exports.updateQuestion = asyncHandler(async (req, res) => {
  const { title, body } = req.body;
  const question = await questionModel.findById(req.params.id);

  if (!question) {
    return res.status(404).json({ message: 'Question not found' });
  }

  if (!question.author.equals(req.user._id)) {
    return res.status(403).json({ message: 'Only the author can edit the question' });
  }

  // Handle image uploads
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
    const uploadedImages = await Promise.all(uploadPromises);
    imageUrls = uploadedImages.map(img => ({
      url: img.secure_url,
      publicId: img.public_id
    }));
  }

  question.title = title || question.title;
  question.body = body || question.body;
  question.images = [...question.images, ...imageUrls];
  await question.save();

  res.status(200).json({
    success: true,
    message: 'Question updated',
    data: question
  });
});

exports.deleteQuestion = asyncHandler(async (req, res) => {
  const question = await questionModel.findById(req.params.id);

  if (!question.author.equals(req.user._id)) {
    return res.status(403).json({ message: 'Only the author can delete the question' });
  }

  // Delete images from Cloudinary
  const deletePromises = question.images.map(img => cloudinary.uploader.destroy(img.publicId));
  await Promise.all(deletePromises);

  await question.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Question deleted',
  });
});