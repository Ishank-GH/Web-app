const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");
const cloudinary = require('cloudinary').v2;
const { uploadOnCloudinary } = require('../services/upload.service');

module.exports.registerUser = async (req, res, next) => {
//for atomic operations
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const isUserAlreadyRegistered = await userModel.findOne({ email });

    if (isUserAlreadyRegistered) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser(
      {
        username,
        email,
        password: hashedPassword,
        avatar: {
          type: 'initial',
          color: 'bg-blue-600 text-white',
          url: null,
          publicId: null
        }
      },
      { session }
    );

    const token = user.generateAuthToken();

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User registered",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = user.generateAuthToken();

  res.cookie("token", token);

  res.status(200).json({ token, user });
};

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Check if username is being updated
    if (updates.username) {
      const existingUser = await userModel.findOne({ 
        username: updates.username,
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username already exists"
        });
      }
    }

    // If updating avatar color
    if (updates.avatarColor) {
      updates.avatar = {
        ...updates.avatar,
        type: 'initial',
        color: updates.avatarColor,
        url: null,
        publicId: null
      };
      delete updates.avatarColor;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully"
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message
    });
  }
};

module.exports.addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded" 
      });
    }

    let cloudinaryResponse;
    try {
      cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    } catch (uploadError) {
      return res.status(500).json({ 
        success: false,
        message: "Failed to upload image: " + uploadError.message
      });
    }

    if (!cloudinaryResponse) {
      return res.status(500).json({ 
        success: false,
        message: "Failed to get response from cloud storage" 
      });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { 
        avatar: {
          type: 'image',
          url: cloudinaryResponse.secure_url,
          publicId: cloudinaryResponse.public_id,
          color: null
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      try {
        await cloudinary.uploader.destroy(cloudinaryResponse.public_id);
      } catch (deleteError) {
        console.error('Failed to delete image after user update failure:', deleteError);
      }

      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      avatar: updatedUser.avatar
    });

  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error uploading image"
    });
  }
};

module.exports.removeProfileImage = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.avatar.publicId) {
      await cloudinary.uploader.destroy(user.avatar.publicId);
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { 
        avatar: {
          type: 'initial',
          color: 'bg-blue-600 text-white',
          url: null,
          publicId: null
        }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile image removed',
      data: updatedUser
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error removing profile image"
    });
  }
};

module.exports.logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  await blackListTokenModel.create({ token });

  res.status(200).json({ message: "Logged out" });
};
