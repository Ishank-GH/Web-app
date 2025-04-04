const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      maxlength: [2000, "Max length is 2000"],
    },
    images: [{
      url: String,
      publicId: String
    }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "question",
      required: true,
    },
    votes: {
      upvotes: { 
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        default: []
      },
      downvotes: { 
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
        default: []
      }
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

answerSchema.virtual("voteCount").get(function () {
    const upvotes = this.votes?.upvotes?.length || 0;
    const downvotes = this.votes?.downvotes?.length || 0;
    return upvotes - downvotes;
});

answerSchema.set('toJSON', {virtuals: true})

const answerModel = mongoose.model("answer", answerSchema);

module.exports = answerModel;
