'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type:String,
        required:[true,'El campo es requerido']
    },
    date:{
        type:Date,
        required:[true,'El campo es requerido']
    },
    user: {
        type:Schema.Types.ObjectId,
        ref: 'user'
    }
});

const Comment = mongoose.model('comment',commentSchema);

module.exports = Comment;