const asyncHandler = require('../middlewares/asyncHandler.middleware');
const communityModel = require('../models/community.model')
const userModel = require('../models/user.model')
const communityService = require('../services/community.service');
const { generateInviteCode } = require('../services/communitycode.service');

module.exports.createCommunity = asyncHandler(async (req, res) => {
        const { name, description, imageUrl } = req.body;

        const isCommunityAlreadyCreated = await communityModel.findOne({ name });

        if (isCommunityAlreadyCreated) {
            return res.status(400).json({ message: "Community already exists" });
        }

        const community = await communityService.createCommunity({
            name,
            description,
            imageUrl,
            inviteCode: generateInviteCode(),
            owner : req.user._id,
            admins: [req.user._id],
            members: [req.user._id]
        })

        //adding communtiy to the list of communities for the user
        await userModel.findOneAndUpdate(req,user,_id,{
            $push: {communities: community._id}
        });
        

        res.status(201).json({
            success: true,
            message: 'Community created',
            data: community
        })
})

exports.updateCommuntity = asyncHandler(async (req, res) => {
        const {name, description, imageUrl} = req.body;
        const community = await communityModel.findById(req.params.id)

        if(!community){
            return res.status(404).json({message: 'Community not found'})
        }


        if(!communityModel.admins.includes(req.user._id)){
            const err = new Error('Admin permission is required')
            err.statusCode = 401;
            throw err;
        }


        //check if name is given and isnt the same as the old name
        if(name && name !== community.name){
            const existingCommunity = await communityModel.findOne({name})
            if(existingCommunity){
                const err = new Error('Community name already exists')
                err.statusCode = 400;
                throw err;
            }
            
            community.name = name || community.name;
            community.description = description || community.description;
            community.imageUrl = imageUrl || community.imageUrl;
            await community.save();


            res.status(200).json({
                success: true,
                message: 'Community updated',
                data: community
            })

        }   
})

exports.deleteCommuntity = asyncHandler(async (req, res) => {

        const community = await communityModel.findById(req.params.id)

        if(!community.owner.equals(req.params._id)){
            const err = new Error('Only the owner can delete the community')
            err.statusCode = 401;
            throw err;
        }

         //remove the community from all members's list of community
        await userModel.updateMany(
            { _id: { $in: community.members}},
            { $pull: { communities: community._id}}
        )

        await community.deleteOne();



        res.status(200).json({
            success: true,
            message: 'Community deleted',
        })
})

exports.joinCommuntity = asyncHandler(async (req, res) => {
        const community = await communityModel.findById(req.params.id)

        if(!community){
            const err = new Error('Community Not found')
            err.statusCode = 404;
            throw err;
        }

        // Add user to members if the user is not already a member
        if(!community.members.includes(req.params._id)){
            community.members.push(req.user._id)
            await community.save();
            await userModel.findByIdAndUpdate(req.user._id, {
                $push: { communities: community._id},
            })
        }
        res.json({
            success: true,
            message: 'Community joined successfully',
            data: community
        })
})