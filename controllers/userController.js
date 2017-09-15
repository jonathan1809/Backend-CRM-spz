const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const fs = require('fs');
const path = require('path');

module.exports = {
//falta validación
    create(req,res,next) {
        const userProps = req.body;
            bcrypt.hash(userProps.password,null,null, (err,hash) => {
                userProps.password=hash;
                userProps.image = null;
                console.log(hash);
                User.create(userProps)
                .then(user => reshelpobject(200,user,res))
                .catch(error => {
                    reshelperr(500,error.message,res)
                });
            });      
    },

    getUsers(req,res,next){
        var page = req.params.page;
        if(!page)
            page = 1;
       
        var itemsPage = 10;
        const query = User.find()
        .sort('surname')
        .paginate(page,itemsPage);

        Promise.all([query, User.count()])
        .then((results) => {
            const object = {
                pages: results[1],
                users: results[0]
            };
            reshelpobject(200,object,res); 
        })
        .catch(error => {
            reshelperr(500,error.message,res)
        });
    },
    getCoachs(req,res,next){
       
        var page = req.params.page;
        if(!page)
            page = 1;
       
        var itemsPage = 10;
        const query = User.find({ideaRole: 'COACH'})
        .sort('surname')
        .paginate(page,itemsPage);

        Promise.all([query, User.count({ideaRole: 'COACH'})])
        .then((results) => {
            console.log('entro peticion');
            const object = {
                pages: results[1],
                coaches: results[0]
            };
            reshelpobject(200,object,res); 
        })
        .catch(error => {
            reshelperr(500,error.message,res)
        });
    },

    getCollaborators(req,res,next){
        var page = req.params.page;
        if(!page)
            page = 1;
            console.log('entro')
        var itemsPage = 10;
        const query = User.find({ideaRole: 'COLLABORATOR'})
        .sort('surname')
        
        
        Promise.all([query, User.count({ideaRole: 'COLLABORATOR'})])
        .then((results) => {
            const object = {
                pages: results[1],
                collaborators: results[0]
            };
            reshelpobject(200,object,res); 
        })
        .catch(error => {
            console.log(error);
            reshelperr(500,error.message,res)
        });
    },
//falta validación
    loginWeb(req,res,next){
        const userProps = req.body;
       
       if(userProps.systemRole === 'ROLE_ADMIN'){
        User.findOne({idEmployee: userProps.idEmployee.toLowerCase()})
        .then(user => {
            console.log('entro');
            if(user != null){
                bcrypt.compare(userProps.password, user.password,(err, check) => {
                    if(check){
                        //devolver token de JWT
                        if(userProps.getHash)
                            reshelpobject(200,{ token: jwt(user) }, res);
                        else
                            reshelpobject(200,user,res);
                    }
                    else
                        reshelperr(400,'La contraseña es incorrecta' + err,res);
                });
            }
            else
                reshelperr(400,'No existe el usuario',res);
            
        })
        .catch(error => {
            reshelperr(500,error.message,res)
        });
    }
    else{
        reshelperr(400,'No tienes los permisos suficientes para entrar al sistema',res);
    }

    },
    loginMovil(req,res,next){
        const userProps = req.body;
        
         User.findOne({idEmployee: userProps.idEmployee.toLowerCase()})
         .then(user => {
             if(user != null){
                if(userProps.getHash)
                    reshelpobject(200,{ token: jwt(user) }, res);
                else
                    reshelpobject(200,user,res);
             }
             else
                 reshelperr(400,'No existe el usuario',res);
             
         })
         .catch(next);
     
    },

    delete(req,res,next) {
        const userId = req.params.id;
        
        User.findByIdAndRemove({_id: userId})
        .then(user =>  res.status('200').send(user))
        .catch(next);
    },
    //cambiar contraseña
    update(req,res,next) {
        const userId = req.params.id;
        const userProps = req.body;
        User.findByIdAndUpdate({_id: userId} , userProps)
        .then(() => User.findById({_id: userId}))
        .then(user => {
            console.log(user);
            res.status('200').send(user)
        })
        .catch(next);
    },

    uploadImageWeb(req,res,next) {
        const _id = req.params.id;
        var file_name = 'no subido';
        console.log(req.files);
        if(req.files){
            const file_path = req.files.image.path;
            console.log(file_path);
            var file_split = file_path.split('\\');
            var file_name = file_split[2];

            var ext_split = file_name.split('\.');
            var file_ext = ext_split[1];

            if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
                User.findByIdAndUpdate(_id, {image: file_name})
                .then(() => User.findById({_id}))
                .then(user => {
                    if(user !== null)
                        res.status('200').send({user, image: file_name})
                    else
                        reshelperr(400,'no se encuentr el usuario')
                    
                })
                .catch(next);
            }
            else{
                res.status(200).send({message: 'Extension del archivo no valida'});
            }
            console.log(file_ext);
        }
        else{
            res.status(400).send({message: 'No has subido una imagen ...'});
        }
    },

    getImageFile(req,res,next){
        const imageFile = req.params.imageFile;
        const pathfile = './uploads/users/' + imageFile;
        console.log(pathfile)
        fs.exists(pathfile, (exists) => {
            if(exists)
            res.sendFile(path.resolve(pathfile));
            else
                res.status(200).send({message: 'No has subido una imagen ...'});
        });
        

    }
};


function reshelperr(status,message,res){
    res.status(status).send({message: message});
}

function reshelpobject(status,album,res){
    res.status(status).send(album);
}