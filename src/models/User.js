const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types : { ObjectId }} = Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default :false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now,
    },
    isOverdue: {
        type: Boolean,
        default :false
    }
})

const Bookuser = mongoose.model('Bookuser', userSchema) 
module.exports = Bookuser


