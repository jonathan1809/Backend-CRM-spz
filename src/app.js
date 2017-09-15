const express = require('express');
const userRoutes = require('./routes/userRoutes');
const ideaRoutes =require('./routes/ideaRoutes');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
import './fackeDataGenerator';

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'test'){
     var uri = 'mongodb://jonathan@192.168.0.15/wendy';
      mongoose.connect(uri, {
        useMongoClient: true,
        
        /* other options */
      })
      .on('error', console.error.bind(console, 'connection error:'))
      .once('open', function() {
        console.log('open')
      });
      

}

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

userRoutes(app);
ideaRoutes(app);

//err: population prev
//req and res: entrada y salida
//next function: pasar al siguiente middleware
app.use((err, req, res, next) => {
  res.header('Access-Control-Allow-Origin','*');
  res.header('Access-Control-Allow-Headers', 'Autorization, X-API-KEY,Origin, X-Requested_With,Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET;POST,OPTIONS,PUT,DELETE');
  res.header('Allow', 'GET;POST,OPTIONS,PUT,DELETE');
  next();
});

app.use((err, req, res, next) => {
  
  res.status(500).send({error: err.message});
});
module.exports = app;