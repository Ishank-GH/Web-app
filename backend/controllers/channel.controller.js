const asyncHandler = require('../middlewares/asyncHandler.middleware');
const channelModel = require('../models/channel.model')
const communityModel = require('../models/community.model')
const channelService = require('../services/channel.service')


exports.createChannel = asyncHandler(async(req, res) => {
        const {name, type, communityId } = req.body;

        const community = await communityModel.findById(communityId);

        if(!community.admins.includes(req.user._id)){
            const err = new Error('Admin access required')
            err.statusCode = 403;
            throw err;
        }

        const channel = await channelService.createChannel({
            name,
            type,
            community: communityId
        })

        res.status(201).json({
            success: true,
            data: channel
        })
})

exports.updateChannel = asyncHandler(async(req, res) => {
        const {name, type} = req.body
        const channel = await channelModel.findById(req.params.id)
        const community = await communityModel.findById(channel.community)

        if(!community.admins.includes(req.params._id)){
            const err = new Error('Admin access required')
            err.statusCode = 403;
            throw err;
        }
        channel.name = name || channel.name;
        channel.type = type || channel.type;
        await channel.save();

        res.status(200).json({
            success: true,
            message: 'Channel updated',
            data: channel
        })
})

exports.deleteChannel = asyncHandler(async(req, res) => {
        // const {name, type} = req.body
        const channel = await channelModel.findById(req.params.id)
        const community = await communityModel.findById(channel.community)

        if(!community.admins.includes(req.params._id)){
            const err = new Error('Admin access required')
            err.statusCode = 403;
            throw err;
        }
        
        await channel.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Channel deleted',
        })
})

exports.listOfChannels = asyncHandler(async(req, res) => {
    const channels = await channelModel.find({ 
        communities: req.params.communityId});

    res.json(channels)
})
