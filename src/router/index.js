const express = require('express');
const router = express.Router();

const mask = require('./mask');
const group = require('./group');


router.use('/api/v1', mask);
router.use('/api/v1', group);

module.exports = router;


