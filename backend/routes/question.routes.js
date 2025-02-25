const express = require('express');
const router = express.Router();
const { body } = require('express-validator')
const questionController = require('../controllers/question.controller');
const authMiddleware = require('../middlewares/auth.middleware')

router.get('/', questionController.getQuestions)
router.get('/:id', questionController.getQuestion)

router.post('/create', authMiddleware.authUser, [
    body("title").trim().notEmpty().withMessage("Title is required").isLength({max: 250}).withMessage("Max 250 characters"),
    body("body").trim().notEmpty().withMessage("Body is required").isLength({max: 5000}).withMessage("Max 5000 characters"),
], questionController.createQuestion)


router.put('/:id', authMiddleware.authUser, [
    body("title").trim().notEmpty().withMessage("Title is required").isLength({max: 250}).withMessage("Max 250 characters"),
    body("body").trim().notEmpty().withMessage("Body is required").isLength({max: 5000}).withMessage("Max 5000 characters"),
], questionController.updateQuestion)


router.delete('/:id', authMiddleware.authUser, questionController.deleteQuestion)


router.post('/:id/vote', authMiddleware.authUser, [
    body("voteType").isIn(["upvote", "downvote"]).withMessage("Invalid vote Type")
], questionController.voteQuestion )



module.exports = router;