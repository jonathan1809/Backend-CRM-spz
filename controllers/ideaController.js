const Idea = require('../models/idea');
const comment = require('../models/comment');
const image = require('../models/image')
const fs = require('fs');
const path = require('path');
const mongoosePaginate = require('mongoose-pagination');
const populateQuery = [{path:'author', model:'user'}, 
                        {path:'collaborator', model:'user'}, 
                        {path:'coach', model:'user'},
                        {path: 'image', model: 'image', 
                            populate: {path:'user', model:'user'}
                        },
                        {path:'comments', model:'comment',
                            populate: {path:'user', model:'user'}
                        }];
module.exports = {

    getIdea(req,res,next) {
        const _id = req.params.id;
       
        Idea.findById(_id)
        .populate(populateQuery)
        .exec( (err,idea) => {
            
            if(idea !== null)
                reshelpobject(200,idea,res);
            else
                reshelperr(403,err.message,res);
        });
          
    },

    createImage(req,res,next){
        console.log('add image');
        var imageProps = req.body;
        image.create(imageProps)
        .then(image => reshelpobject(200,image,res))
        .catch(error => {
            reshelperr(500,error.message,res)
        });
    },
    create(req,res,next){
        console.log("add idea");
        var ideaProps = req.body;
        Idea.create(ideaProps)
        .then(idea => reshelpobject(200,idea,res))
        .catch(error => {
            reshelperr(500,error.message,res)
        });

    },

    getIdeasByAuthor(req,res,next){
        var authorId = req.params.author;
        
        if(!authorId){
            
                    reshelperr(403,'No existen ideas',res)
            
        }
        else{
            var page = 1;
            var itemsPage = 10;
            const query = 
            Idea.find({author: authorId})
            .sort({ score: -1 })
            .populate(populateQuery)
            .paginate(page,itemsPage);
    
            Promise.all([query, Idea.count({author: authorId})])
            .then((results) => {
                const object = {
                    pages: results[1],
                    ideas: results[0]
                };
                reshelpobject(200,object,res); 
            })
            .catch(error => {
                reshelperr(500,error.message,res)
            });
        }

       
    },
    //verificar que no sean falsas
    getIdeasByScore(req,res,next){
        var page = req.params.page;
        if(!page)
            page = 1;
       
        var itemsPage = 10;
        const query = 
        Idea.find({isShow:true})
        .sort({ score: -1 })
        .populate(populateQuery)
        .paginate(page,itemsPage);

        Promise.all([query, Idea.count({isShow:true})])
        .then((results) => {
            const object = {
                pages: results[1],
                ideas: results[0]
            };
            reshelpobject(200,object,res); 
        })
        .catch(error => {
            reshelperr(500,error.message,res)
        });
    },
    getIdeasByDate(req,res,next){
        var page = req.params.page;
        if(!page)
            page = 1;
       
        var itemsPage = 10;
        const query = 
        Idea.find({isShow:true})
        .sort('-date')
        .populate(populateQuery)
        .paginate(page,itemsPage);

        Promise.all([query, Idea.count({isShow:true})])
        .then((results) => {
            const object = {
                pages: results[1],
                ideas: results[0]
            };
            reshelpobject(200,object,res); 
        })
        .catch(error => {
            reshelperr(500,error.message,res)
        });
    },

    getIdeasByLikes(req,res,next){
        var page = req.params.page;
        if(!page)
            page = 1;
       
        var itemsPage = 10;
        const query = 
        Idea.find({isShow:true})
        .sort({ likes: -1 })
        .populate(populateQuery)
        .paginate(page,itemsPage);

        Promise.all([query, Idea.count({isShow:true})])
        .then((results) => {
            const object = {
                pages: results[1],
                ideas: results[0]
            };
            reshelpobject(200,object,res); 
        })
        .catch(error => {
            reshelperr(500,error.message,res)
        });
    },
    

    update(req,res,next){
        const ideaId = req.params.id;
        const ideaProps = req.body;
        console.log(ideaProps);
        Idea.findByIdAndUpdate({_id: ideaId},ideaProps)
        .then(idea => reshelpobject(200,idea,res))
        .catch(error => {
            reshelperr(500,error.message,res)
        });
    },
    //borrar comentarios y reviews
    delete(req,res,next){
        const ideaId = req.params.id;

        Idea.findById({_id: ideaId})
        .then(idea => {
           
            if(idea !== null)
            return comment.remove({ _id: { $in: idea.comments } })
        })
        .then((err,idea) => {
               Idea.findByIdAndRemove({_id: ideaId});
               return Idea.findById({_id: ideaId});
        })
        .then((idea) => {
            if(idea === null)
                reshelperr(200,'Idea eliminada',res)
            else
                reshelperr(200,'Idea no se elimino',res)
        })
        .catch(error => {
            reshelperr(500,error.message,res)
        });
    },
    

    uploadImage(req,res,next){
        //_id del usuario
        const _id = req.params.id;
        var file_name = 'no subido';
        
        if(req.files){
            const file_path = req.files.image.path;
            var file_split = file_path.split('\\');
            var file_name = file_split[2];

            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];

            if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
                image.findByIdAndUpdate(_id, {image: file_name})
                .then(() => image.findById({_id}))
                .then(idea => {
                    if(idea !== null)
                        reshelpobject(200,idea,res);
                    else
                        reshelperr(500,'No se encontro el usuario',res);
                
                })
                .catch(error => {
                    reshelperr(500,error.message,res)
                });
            }
            else{
                reshelperr(500,'Extension del archivo no valida',res);
            
            }
            console.log(file_ext);
        }
        else{
            reshelperr(403,'No has subido una imagen ...',res);
        
        }
    },

    getImageFile(req,res,next){
        const imageFile = req.params.imageFile;
        const pathfile = './uploads/Ideas/' + imageFile;
        console.log(pathfile)
        fs.exists(pathfile, (exists) => {
            if(exists)
                res.sendFile(path.resolve(pathfile));
            else
                reshelperr(403,'No has subido una imagen ...',res);
        });
    },

    
    
};

function reshelperr(status,message,res){
    res.status(status).send({message: message});
}

function reshelpobject(status,album,res){
    res.status(status).send(album);
}