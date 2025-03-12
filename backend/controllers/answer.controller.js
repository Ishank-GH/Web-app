const answerModel = require('../models/answer.model');
const asyncHandler = require('../middlewares/asyncHandler.middleware')
const questionModel = require('../models/question.model')
const { uploadOnCloudinary } = require('../services/upload.service');

exports.createAnswer = asyncHandler(async(req, res) => {
    const { body } = req.body;

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

    const answer = await answerModel.create({
        body,
        author: req.user._id,
        question: req.params.questionId,
        images: imageUrls
    });

    const question = await questionModel.findById(req.params.questionId).populate('answers');
    question.answers.push(answer._id);
    await question.save();

    // Populate author details before sending response
    await answer.populate('author', 'username avatar');

    res.status(201).json({
        success: true,
        data: answer
    });
});

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


exports.updateAnswer = asyncHandler(async (req, res) => {
  const { body } = req.body;
  const answer = await answerModel.findById(req.params.id);

  if (!answer) {
    return res.status(404).json({ message: 'Answer not found' });
  }

  if (!answer.author.equals(req.user._id)) {
    return res.status(403).json({ message: 'Only the author can edit the answer' });
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

  answer.body = body || answer.body;
  answer.images = [...answer.images, ...imageUrls];
  await answer.save();

  res.status(200).json({
    success: true,
    message: 'Answer updated',
    data: answer
  });
});

exports.deleteAnswer = asyncHandler(async (req, res) => {
  const answer = await answerModel.findById(req.params.id);

  if (!answer.author.equals(req.user._id)) {
    return res.status(403).json({ message: 'Only the author can delete the answer' });
  }

  // Delete images from Cloudinary
  const deletePromises = answer.images.map(img => cloudinary.uploader.destroy(img.publicId));
  await Promise.all(deletePromises);

  await answer.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Answer deleted',
  });
});