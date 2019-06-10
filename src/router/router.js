const express = require('express');
const food = require('./food');
const router = express.Router();

router.use('/', food);


module.exports = router;


