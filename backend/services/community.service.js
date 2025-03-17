const communityModel = require('../models/community.model')

module.exports.createCommunity = async ({
    name, description, imageUrl, owner, admins, members, inviteCode
}) => {
    if (!name || !owner) {
        throw new Error('Name and owner are required');
    }

    const community = await communityModel.create({
        name,
        description,
        imageUrl,
        owner,
        admins,
        members,
        inviteCode
    });

    return community;
};