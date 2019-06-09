const express = require('express');
const path    = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 10000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', require('./router/router'));

app.listen(port, function () {
    console.log('Example app listening on port %s!', port);
});