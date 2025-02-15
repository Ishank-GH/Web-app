const communityModel = require('../models/community.model')

module.exports.createCommunity = async ({
    name, description, imageUrl 
}) => {
    if(!name){
        throw new error('Name required')
    }

    const community = communityModel.create({
        name, 
        description, 
        imageUrl
    })

    return community
}