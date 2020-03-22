const express = require('express');
const router = express.Router();

const group = require('./group');

router.use('/api/v1', group);

module.exports = router;


