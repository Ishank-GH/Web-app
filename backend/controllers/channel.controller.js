const channelModel = require('../models/channel.model')
const communityModel = require('../models/community.model')
const channelService = require('../services/channel.service')


exports.createChannel = async(req, res, next) => {
    try{
        const {name, type, communityId } = req.body;

        const community = await communityModel.findById(communityId);

        if(!community.admins.includes(req.user._id)){
            throw new error(403, 'Admin access required')
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


    }catch(error){
        next(error)
    }
}

exports.updateChannel = async(req, res, next) => {
    try{
        const {name, type} = req.body
        const channel = await channelModel.findById(req.params.id)
        const community = await communityModel.findById(channel.community)

        if(!community.admins.includes(req.params._id)){
            throw new error(403, 'Admin access required')
        }
        channel.name = name || channel.name;
        channel.type = type || channel.type;
        await channel.save();

        res.status(200).json({
            success: true,
            message: 'Channel updated',
            data: channel
        })

    }catch(error){
        next(error)
    }
}

exports.deleteChannel = async(req, res, next) => {
    try{
        const {name, type} = req.body
        const channel = await channelModel.findById(req.params.id)
        const community = await communityModel.findById(channel.community)

        if(!community.admins.includes(req.params._id)){
            throw new error(403, 'Admin access required')
        }
        
        await channel.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Channel deleted',
            data: channel
        })

    }catch(error){
        next(error)
    }
}

exports.listOfChannels = async(req, res, next) => {
    const channels = await channelModel.find({ 
        communities: req.params.communityId});

    res.json(channels)
}
