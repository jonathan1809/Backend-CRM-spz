'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    idEmployee: {    // numeros 
        type:String,
        required:[true,'El campo es requerido']
    },
    password: {       // numeros 
        type:String,
        required:[true,'El campo es requerido']
    },
    name: { 
        type:String,
        required:[true,'El campo es requerido']
    },
    surname: { // faker.name
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
    systemRole:{                                // ROLE_USER, ROLE_ADMIN
        type:String,
        required:[true,'El campo es requerido']
    },
    ideaRole:{                                   // COLLABORATOR O COACH
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