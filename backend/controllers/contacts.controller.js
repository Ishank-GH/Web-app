const userModel = require('../models/user.model');
const asyncHandler = require('../middlewares/asyncHandler.middleware');

exports.searchUsers = asyncHandler(async (req, res) => {
    const searchTerm = req.query.search;
    
    if (!searchTerm) {
        return res.status(400).json({
            success: false,
            message: "Search term is required"
        });
    }
    // Sanitize and create case-insensitive regex
    const sanitizedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(sanitizedTerm, 'i');

    const users = await userModel.find({
        $or: [
            { username: { $regex: searchRegex } },
            { email: { $regex: searchRegex } }
        ],
        _id: { $ne: req.user._id } // Exclude current user
    }).select('username email avatar');

    res.status(200).json({
        success: true,
        data: users
    });
});