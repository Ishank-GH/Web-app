const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
  {
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, "Username must be atleast 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      minlength: [5, "Email must be atleast 3 characters long"],
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    socketId: {
      type: String,
    },
    communities: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Community'
    }],
    profilePicture: {
      type: String,
      // default: ''
    },
    // googleId: String,
    // githubId: String,
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  //hashing rounds
  const salt = await bcrypt.genSalt(10);
  
  return await bcrypt.hash(password, salt);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
