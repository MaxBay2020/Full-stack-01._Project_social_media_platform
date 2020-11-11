const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    email: String,
    password: String,
    nickname: {
        type: String,
        default: 'NoOne'
    },
    signature: String,
    createdTime: {
        type: Date,
        default: Date.now()
    }
})

let User = mongoose.model('User', userSchema)

module.exports = User