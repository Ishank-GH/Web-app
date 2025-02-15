const channelModel = require('../models/channel.model')

module.exports.createChannel = async ({
    name, type, community 
}) => {
    if(!name || !type || !community){
        throw new error('Name or type or community required')
    }

    const channel = await channelModel.create({
        name,
        type,
        community
    })

    return channel;

}