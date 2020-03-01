const express = require('express');
const router = express.Router();

const mask = require('./mask');


router.use('/api/v1', mask);

module.exports = router;


