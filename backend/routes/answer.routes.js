const express = require('express');
const router = express.Router();
const { body } = require('express-validator')
const answerController = require('../controllers/answer.controller');
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/:questionId/answers/', authMiddleware.authUser, [
    body("body").trim().notEmpty().withMessage("Body is required").isLength({max: 5000}).withMessage("Max 5000 characters"),
], answerController.createAnswer)


router.put('/:questionId/answers/:id', authMiddleware.authUser, [
    body("body").trim().notEmpty().withMessage("Body is required").isLength({max: 5000}).withMessage("Max 5000 characters"),
], answerController.updateAnswer)


router.delete('/:questionId/answers/:id', authMiddleware.authUser, answerController.deleteAnswer)

router.post('/:questionId/answers/:id/vote', authMiddleware.authUser, [
    body("voteType").isIn(["upvote", "downvote"]).withMessage("Invalid vote Type")
], answerController.voteAnswer )

module.exports = router;