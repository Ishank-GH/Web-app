const userModel = require('../models/user.model')

module.exports.createUser = async ({
    username, email, password
}) => {
    if(!username || !email || !password){
        throw new error('All fields are required')
    }

    const user = userModel.create({
        username,
        email,
        password
    })

    return user;

}