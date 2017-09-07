'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    image: {
        type:String,
        required:[true,'El campo es requerido']
    },
    comment:{
        type:String,
        required:[true,'El campo es requerido']
    },
    user: {
        type:Schema.Types.ObjectId,
        ref: 'user',
        required:[true,'El campo es requerido']
    }
});

const Image = mongoose.model('image',ImageSchema);

module.exports = Image;