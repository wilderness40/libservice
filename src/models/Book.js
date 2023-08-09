const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: { ObjectId } } = Schema

const booksSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: ObjectId,
        trim: true,
        ref: 'Bookuser', // user.js 의 mongoose.model('Bookuser', userSchema) 에서 첫번째 인자값
    },
    category: {
        type: String,
        trim: true,
    },
    standardNum: {
        type: Number,
    },
    isBooked: {
        type: Boolean,
        default: false,
    },
    isRented: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    rentedAt: {
        type: Date,
        default: Date.now,
    },
    lastModifiedAt:{
        type: Date,
        default: Date.now,
    },
    finishedAt: {
        type: Date,
        default: Date.now,
    }
})

const Booklist= mongoose.model('Booklist', booksSchema)
module.exports = Booklist

