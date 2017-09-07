'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    idEmployee: {
        type:String,
        required:[true,'El campo es requerido']
    },
    password: {
        type:String,
        required:[true,'El campo es requerido']
    },
    name: {
        type:String,
        required:[true,'El campo es requerido']
    },
    surname: {
        type:String,
        required:[true,'El campo es requerido']
    },
    email: {
        type:String,
        required:[true,'El campo es requerido']
    },
    workArea:{
        type:String,
        required:[true,'El campo es requerido']
    },
    workCharge: {
        type:String,
        required:[true,'El campo es requerido']
    },
    startDate: {
        type:Date,
        default: null
    },
    systemRole:{
        type:String,
        required:[true,'El campo es requerido']
    },
    ideaRole:{
        type:String,
        required:[true,'El campo es requerido']
    },
    phone:{
        type:Number,
        required:[true,'El campo es requerido']
    },
    image:String

});

const User = mongoose.model('user',userSchema);

module.exports = User;