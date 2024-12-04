const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
    },
    password:{
        type:String,
    },
    email:{
        type:String,
    },
    profileId:{
        type:String,
        unique:true,
    },
    loginTime:{
        type:Date,
        default:Date.now(),
    },
    dateCreated:{
        type:Date,
        default:Date.now()
    },
    givenName:{
        type:String,
    },
    familyName:{
        type:String,
    }
})

const User = mongoose.model("User",UserSchema)

module.exports = User