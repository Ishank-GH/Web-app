const mongoose = require("mongoose");
const { memberRole} = require('../models/enums')

const communitySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
   description: {
        type: String,
        default: 'A vibrant community for discussions and fun activites'
   },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        role: {
          type: String,
          enum: Object.values(memberRole),
          default: memberRole.ADMIN,
        }
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        role: {
          type: String,
          enum: Object.values(memberRole),
          default: memberRole.MEMBER,
        }
    }],
    inviteCode: {
      type: String,
      unique: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'profile',
    },
    imageUrl: {
      type: String,
      // default: '',
    }
  },
  { timestamps: true }
);

const communityModel = mongoose.model("community", communitySchema);

// module.exports('membersCount', ()=> {
//   return this.members.length;
// })

module.exports = communityModel;