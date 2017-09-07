'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema= new Schema({

});

const ideaSchema = new Schema({
    title: {
        type:String,
        required:[true,'El campo es requerido']
    },
    image: [{
        type:Schema.Types.ObjectId,
        ref: 'image',
        required:[true,'El campo es requerido']
    }],
    problem: {
        type:String,
        default: null
    },
    description:{
        type:String,
        default: null
    },
    result: {
        type:String,
        default: null
    },
    experiment: {
        type:String,
        default: null
    },
    verify: {
        type:Boolean,
        default: false
    },
    implementation:{
        type:String,
        default: null
    },
    startdate: {
        type: Date,
        required:[true,'El campo es requerido']
    },
    score:{
        type:Number,
        default: 0
    },
    likes: {
        type:Number,
        default: null
    },
    status: {
        type:Number,
        default: 0
    },
    isShow: {
        type:Boolean,
        default: false
    },
    author:{
        type:Schema.Types.ObjectId,
        ref: 'user'
    },
    coach: {
        type:Schema.Types.ObjectId,
        ref: 'user'
    },
    collaborator: [{
        type:Schema.Types.ObjectId,
        ref: 'user'
    }],
    comments: [{
        type:Schema.Types.ObjectId,
        ref: 'comment'
    }],
    review: {
        type: reviewSchema
    },
    step1date: {
        type: Date,
        default: null
    },
    step2date: {
        type: Date,
        default: null
    },
    step3date: {
        type: Date,
        default: null
    },
    step4date: {
        type: Date,
        default: null
    },
    step5date: {
        type: Date,
        default: null
    }


});


const Idea = mongoose.model('idea',ideaSchema);

module.exports = Idea;