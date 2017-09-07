
const UserController = require('../controllers/userController');
const md_auth = require('../middlewares/authenticated');

const multipart= require('connect-multiparty');
const md_upload= multipart({uploadDir: './uploads/users'});

module.exports = (app) => {
    
    app.post('/api/user/register', UserController.create); //echo
    app.post('/api/web', UserController.loginWeb); //echo
    app.post('/api/movil', UserController.loginMovil); //echo
    app.get('/api/users/:page?',md_auth.ensureAuth, UserController.getUsers);//echo
    app.get('/api/coach/:page?',md_auth.ensureAuth, UserController.getCoachs);//echo
    app.get('/api/colaborator/:page?',md_auth.ensureAuth, UserController.getCollaborators);//echo
    app.put('/api/user/update/:id',md_auth.ensureAuth, UserController.update);//echo
    app.delete('/api/user/:id',md_auth.ensureAuth, UserController.delete);//echo
    
    app.get('/api/user/get-image-user/:imageFile', UserController.getImageFile);//echo
    app.post('/api/user/upload-image-user/:id',[md_auth.ensureAuth,md_upload], UserController.uploadImageWeb);//echo
};