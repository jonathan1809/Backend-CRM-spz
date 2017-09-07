'use strict'
const app = require('./app');
var port = process.env.PORT || 80;
app.listen(port, () => {
    console.log('Running on port 80');
})