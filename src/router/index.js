const express = require('express');
const router = express.Router();

const group = require('./group');
const member = require('./member');


router.use('/api/v1', group);
router.use('/api/v1', member);

module.exports = router;


