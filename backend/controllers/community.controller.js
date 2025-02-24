const communityModel = require('../models/community.model')
const userModel = require('../models/user.model')
const communityService = require('../services/community.service');
const { generateInviteCode } = require('../services/communitycode.service');

module.exports.createCommunity = async (req, res, next) => {
    try {
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

    } catch (error) {
        
        next(error)
    }
}

exports.updateCommuntity = async (req, res, next) => {
    try{
        const {name, description, imageUrl} = req.body;
        const community = await communityModel.findById(req.params.id)

        if(!communityModel.admins.includes(req.user._id)){
            throw new Error(401, 'Admin permission is required')
        }


        if(name && name !== community.name){
            const existingCommunity = await communityModel.findById({name})
            if(existingCommunity){
                throw new Error(400, 'Community name already exists')
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

    }catch(error){
        next(error)
    }
    
}


exports.deleteCommuntity = async (req, res, next) => {
    try{
        const community = await communityModel.findById(req.params.id)

        if(!community.owner.equals(req.params._id)){
            throw new Error(401, 'Only the owner can delete the community')
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
            data: community
        })

    }catch(error){
        next(error)
    }
    
}

exports.joinCommuntity = async (req, res, next) => {
    try{
        const community = await communityModel.findById(req.params.id)

        if(!community){
            throw Error(404, 'Community Not found')
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

    }catch(error){
        next(error)
    }
    
}