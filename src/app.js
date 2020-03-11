require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 10000;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


var options = {
    dotfiles: 'ignore',
    etag: true,
    extensions: ['htm', 'html'],
    index: 'index.html',
    lastModified: true,
    maxAge: '1d',
    setHeaders: function (res, path, stat) {
      res.set('x-timestamp', Date.now());
      res.header('Cache-Control', 'public, max-age=1d');
    }
};    

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

app.use('/svc', require('./router'));
app.use('/', express.static(__dirname + '/public', options));

app.listen(port, function () {
    console.log('Example app listening on port %s!', port);
});