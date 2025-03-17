const channelModel = require('../models/channel.model')

module.exports.createChannel = async ({
    name, type, community, profile
}) => {
    if (!name || !type || !community || !profile) {
        throw new Error('Name, type, community and profile are required');
    }

    const channel = await channelModel.create({
        name,
        type,
        community,
        profile
    });

    return channel;
};