const express = require('express');
const path    = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = 10000;
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

app.use('/svc', require('./router/router'));
app.use('/', express.static(__dirname + '/public', options));

app.listen(port, function () {
    console.log('Example app listening on port %s!', port);
});