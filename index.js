'use strict'
const config = require('./config');
const app = require('./app');

var port = config.port;
app.listen(port, () => {
    console.log('Running on port 80');
})