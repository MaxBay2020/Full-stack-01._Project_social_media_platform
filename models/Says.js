const mongoose = require('mongoose')
const { Schema } = mongoose

let saysSchema = new Schema({
    email       :   String,
    content     :   String,
    date        :   String,
    like        :   [String],
    comment     :   [String]
})

let Says = mongoose.model('Says', saysSchema)

module.exports = Says