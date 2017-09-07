const Idea = require('../models/idea');
const Comment = require('../models/comment');
const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');
const populateQuery = [{path:'author', model:'user'}, 
                        {path:'collaborator', model:'user'}, 
                        {path:'coach', model:'user'},
                        {path: 'image', model: 'image'},
                        {path:'comments', model:'comment',
                            populate: {path:'user', model:'user'}
                        }];
module.exports = {
    create(req,res,next){
        //id de la idea
        var _id = req.params.id;
        var commentProps = req.body;

        const comment = new Comment();
        comment.content = commentProps.content;
        comment.date = commentProps.date;
        comment.user = commentProps.user;

        comment.save()
        .then(() => Idea.findById(_id))
        .then(idea => {
            idea.comments.push(comment)
            return idea.save();
        })
        .then(idea => {
            reshelperr(200,idea,res);
        })
        .catch((err) => reshelperr(500,err,res));
        

    },

    updateLikes(req,res,next){
        var _id = req.params.id;
        Idea.findByIdAndUpdate(_id,{$inc: {likes: 1}})
        .then(idea => reshelpobject(200,idea,res))
        .catch(next);
    }

};

function reshelperr(status,message,res){
    res.status(status).send({message: message});
}

function reshelpobject(status,comment,res){
    res.status(status).send(comment);
}