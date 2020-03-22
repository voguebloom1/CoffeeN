require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 10000;
const cors = require('cors');
const domains = ['http://localhost:3000'];

const morgan = require('morgan');
const winston = require('../config/winston')

const corsOptions = {
  origin: function(origin, callback){
  	const isTrue = domains.indexOf(origin) !== -1;
    callback(null, isTrue);
  }
  ,
  credentials: true
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan('combined', {stream: winston.stream})); 


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

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(()=>winston.info('Successfully connected to mongodb'))
  .catch(e => winston.error(e));

app.use('/svc', require('./router'));
app.use('/', express.static(__dirname + '/public', options));

app.listen(port, function () {
    winston.info('Example app listening on port : ' + port);
});