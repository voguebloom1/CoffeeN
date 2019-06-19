const express = require('express');
const food = require('./food');
const fatsecret = require('./fatsecret');
const itsite = require('./itsite');
const router = express.Router();

router.use('/', food);
router.use('/', fatsecret);
router.use('/', itsite);


module.exports = router;


