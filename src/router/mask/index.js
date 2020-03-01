const router = require('express').Router();
const controller = require('./mask.controller');

router.get('/masks', controller.getMasks);
router.post('/masks', controller.insertMask);

module.exports = router;