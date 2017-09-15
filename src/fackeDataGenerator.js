const mongoose = require('mongoose'); // tomo el modelo 
const uuidv4 = require('uuid/v4'); // generador de idetidficadores unicos
const faker = require('faker');
const _ = require('lodash');
const  create = require('../controllers/userController');
const fakeSystemRole = require('./arryasFaker/fakeSystemRole');
const fakeideaRol = require('./arryasFaker/fakeideaRol');



const MINIMUM_USERS = 200;
const USERS_TO_ADD = 2000;

let usersCollaction;
module.exports = () => {
var uri = 'mongodb://jonathan@192.168.0.15/wendy';
mongoose.connect(uri, {
    useMongoClient: true,

    /* other options */
  })
  .on('error', console.error.bind(console, 'connection error:'))
  .once('open', function () {
    console.log('open')
  })
  .then(() => {
    // obtenemos el modelo con mongoose 
    usersCollaction = mongoose.connection.collection("user") 
    return usersCollaction.count();

  })
  .then((count) => {
    if (count < MINIMUM_USERS) {
      const user = _.times(USERS_TO_ADD, () => (create.create));

      usersCollaction.insertMany(user);
    }
  })
  .catch(e => console.log(e));

create(() => {
  return {
    idEmployee: uuidv4(),
    password: randomBetween(10000000, 152036849),
    name: faker.name.firstName(),
    surname: faker.name.LastName(),
    email: faker.internet.email(),
    workArea: faker.name.jobArea(),
    workCharge: faker.name.jobTitle(),
    startDate: new Date(2017, 9, 15),
    systemRole: getfakeSystemRole(), // ROLE_USER, ROLE_ADMIN
    fakeideaRol: faker.getfakeideaRol(), // COLLABORATOR O COACH
    phone: faker.phone.phoneNumber(),
    image: feker.image.avatar()
  }
})

getfakeideaRol(() => {
  return randomEntry(fakeideaRol);
});

getfakeSystemRole(() => {
  return randomEntry(fakeSystemRole);
});

randomEntry((array) => {
  return array[~~(Math.random() * array.length)];
})

randomBetween((min, max) => {
  return ~~(Math.random() * (max - min)) + min;
})
}