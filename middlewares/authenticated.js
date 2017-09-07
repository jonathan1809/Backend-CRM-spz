const jwt = require('jwt-simple');
//moment manejador de token
const moment = require('moment');
const secret = 'clave_secreta';
var resh;
exports.ensureAuth = (req, res, next) => {
    resh = res;
        if(!req.headers.authorization){
            return reshelp(403,'La petición no tiene la cabecera de autenticación',res);
        }
        var token = req.headers.authorization.replace(/['"]+/g,'');

        try{
            var payload = jwt.decode(token,secret);
            if(payload.exp <= moment().unix()){
                return reshelp(401,'el token ha expirado',res);
            }
        }catch(ex){
            ///console.log(ex);
            return reshelp(404,'El token no es valido',res);
        }

        req.user = payload;
        next();
};

function reshelp(status,message,res){
      res.status(status).send({message: message});
}