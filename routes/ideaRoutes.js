
const IdeaController = require('../controllers/ideaController');
const CommentController = require('../controllers/commentController');
const md_auth = require('../middlewares/authenticated');

const multipart= require('connect-multiparty');
const md_upload= multipart({uploadDir: './uploads/ideas'});

module.exports = (app) => {
    //poner verificacion de token despues de las pruebas
    app.post('/api/idea/register', IdeaController.create);//echo
    app.post('/api/idea/image', IdeaController.createImage);//echo
    app.put('/api/idea/:id', IdeaController.update);//echo
    app.delete('/api/idea/:id',md_auth.ensureAuth, IdeaController.delete);//echo
    app.get('/api/idea/:id', IdeaController.getIdea);//echo

    app.get('/api/ideas/score/:page?', IdeaController.getIdeasByScore);//echo
    app.get('/api/ideas/author/:author', IdeaController.getIdeasByAuthor);//echo
    app.get('/api/ideas/date/:page?', IdeaController.getIdeasByDate);//echo
    app.get('/api/ideas/likes/:page?', IdeaController.getIdeasByLikes);
    // falta hacerlo
    app.get('/api/ideas/serch/:text', IdeaController.getIdeasByLikes);

    

    app.get('/api/idea/get-image-idea/:imageFile', IdeaController.getImageFile);//echo
    app.post('/api/idea/upload-image-idea/:id',[md_auth.ensureAuth,md_upload], IdeaController.uploadImage);//echo

    app.post('/api/idea/comments/:id',md_auth.ensureAuth,CommentController.create);//echo
    app.put('/api/idea/updatelikes/:id',md_auth.ensureAuth,CommentController.updateLikes);//echo
};