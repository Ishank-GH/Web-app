const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
   description: {
    type: String,
    default: 'No description provided'
   },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
  },
  { timestamps: true }
);





const communityModel = mongoose.model("community", communitySchema);

module.exports = communityModel;