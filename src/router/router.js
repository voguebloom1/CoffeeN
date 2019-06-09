const express = require('express');
const food = require('./food');
const router = express.Router();

router.use('/svc', food);


module.exports = router;