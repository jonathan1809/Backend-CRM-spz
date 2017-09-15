const express = require('express');
const userRoutes = require('./routes/userRoutes');
const ideaRoutes =require('./routes/ideaRoutes');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


mongoose.Promise = global.Promise;


const uuidv4 = require('uuid/v4'); // generador de idetidficadores unicos
const faker = require('faker');
const _ = require('lodash');
const  create = require('./controllers/fakecontroler');
const fakeSystemRole = require('./src/arryasFaker/fakeSystemRole');
const fakeideaRol = require('./src/arryasFaker/fakeideaRol');




const MINIMUM_USERS = 200;
const USERS_TO_ADD = 2000;

let usersCollaction;

var uri = 'mongodb://jonathan@localhost/wendy';
mongoose.connect(uri, {
    useMongoClient: true,
  })
  .on('error', console.error.bind(console, 'connection error:'))
  .once('open', function () {
    console.log('open')
  })
  .then(() => {
   
    // obtenemos el modelo con mongoose 
    usersCollaction = mongoose.connection.collection("users") 
    return usersCollaction.count();

  })
  .then((count) => {
    if (count < MINIMUM_USERS) {

      const user = _.times(USERS_TO_ADD, () => (createFake()));

      usersCollaction.insertMany(user);
    }
  })
  .catch(e => console.log(e));

function createFake() {
  return {
    idEmployee: uuidv4(),//
    password: randomBetween(10000000, 152036849),//
    name: faker.name.firstName(), //name
    surname: faker.name.lastName(), //este
    email: faker.internet.email(), //email
    workArea: faker.name.jobArea(), //este
    workCharge: faker.name.jobTitle(), //este
    startDate: new Date(2017, 9, 15),
    systemRole: getfakeSystemRole(), // ROLE_USER, ROLE_ADMIN falta
    ideaRole: getfakeideaRol(), // COLLABORATOR O COACH
    phone: faker.phone.phoneNumber(),
    image: faker.image.avatar()
  };
}

function getfakeideaRol()  { return randomEntry(fakeideaRol)};
  


function getfakeSystemRole() { 
  return randomEntry(fakeSystemRole);
}

function randomEntry(array) {
  return array[~~(Math.random() * array.length)];
}

function randomBetween(min, max) {
  return ~~(Math.random() * (max - min)) + min;
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