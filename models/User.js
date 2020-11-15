const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    email: String,
    password: String,
    nickname: {
        type: String,
        default: 'NoOne'
    },
    signature: {
        type: String,
        default: 'Nothing left behind'
    },
    avatar: {
        type: String,
        default: '/images/default_avatar.jpg'
    },
    createdTime: {
        type: Date,
        default: Date.now()
    }
})

let User = mongoose.model('User', userSchema)

module.exports = User