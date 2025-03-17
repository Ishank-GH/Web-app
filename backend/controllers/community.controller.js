const asyncHandler = require('../middlewares/asyncHandler.middleware');
const communityModel = require('../models/community.model');
const userModel = require('../models/user.model');
const mongoose = require('mongoose');
const { uploadOnCloudinary } = require('../services/upload.service');
const cloudinary = require('cloudinary').v2;

const generateInviteCode = () => {
    const length = 8;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
};

exports.createCommunity = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const owner = req.user._id;

    // Generate unique invite code
    let inviteCode = generateInviteCode();
    while (await communityModel.findOne({ inviteCode })) {
        inviteCode = generateInviteCode();
    }

    const community = await communityModel.create({
        name,
        description,
        owner,
        members: [owner],
        inviteCode
    });

    // Add community to user's communities
    await userModel.findByIdAndUpdate(owner, {
        $push: { communities: community._id }
    });

    res.status(201).json({
        success: true,
        data: community
    });
});

exports.joinCommunity = asyncHandler(async (req, res) => {
    const { inviteCode } = req.body;
    const community = await communityModel.findOne({ inviteCode });

    if (!community) {
        return res.status(404).json({
            success: false,
            message: 'Invalid invite code'
        });
    }

    // Check if user is already a member
    if (community.members.includes(req.user._id)) {
        return res.status(400).json({
            success: false,
            message: 'You are already a member of this community'
        });
    }

    // Add user to community members
    community.members.push(req.user._id);
    await community.save();

    // Add community to user's communities
    await userModel.findByIdAndUpdate(req.user._id, {
        $addToSet: { communities: community._id }
    });

    res.status(200).json({
        success: true,
        message: 'Successfully joined community',
        data: community
    });
});

exports.getCommunityDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid community ID'
        });
    }

    const community = await communityModel
        .findById(id)
        .populate('owner', 'username avatar')
        .populate('members', 'username avatar')
        .populate({
            path: 'channels',
            populate: {
                path: 'createdBy',
                select: 'username avatar'
            }
        });

    if (!community) {
        return res.status(404).json({
            success: false,
            message: 'Community not found'
        });
    }

    res.status(200).json({
        success: true,
        data: community
    });
});

exports.getUserCommunities = asyncHandler(async (req, res) => {
  try {
    const communities = await communityModel
      .find({ members: req.user._id })
      .populate('owner', 'username avatar')
      .populate('members', 'username avatar')
      .populate('channels');

    res.status(200).json({
      success: true,
      data: communities
    });
  } catch (error) {
    console.error('Error fetching user communities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch communities'
    });
  }
});

exports.updateCommunityAvatar = asyncHandler(async (req, res) => {
    try {
        const community = await communityModel.findById(req.params.id);

        if (!community) {
            return res.status(404).json({
                success: false,
                message: 'Community not found'
            });
        }

        // Check if user is authorized to update avatar (owner only)
        if (!community.owner.equals(req.user._id)) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized: Only the owner can update the avatar'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Upload to cloudinary
        const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

        // Delete old image if exists
        if (community.avatar?.publicId) {
            await cloudinary.uploader.destroy(community.avatar.publicId);
        }

        community.avatar = {
            type: 'image',
            url: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.public_id
        };

        await community.save();

        res.status(200).json({
            success: true,
            data: community
        });
    } catch (error) {
        console.error('Error updating community avatar:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update community avatar'
        });
    }
});

exports.getInviteCode = asyncHandler(async (req, res) => {
    const community = await communityModel.findById(req.params.id);

    if (!community) {
        return res.status(404).json({
            success: false,
            message: 'Community not found'
        });
    }

    res.status(200).json({
        success: true,
        data: { inviteCode: community.inviteCode }
    });
});