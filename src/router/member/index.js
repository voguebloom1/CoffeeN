const router = require('express').Router();
const controller = require('./member.controller');

router.get('/members', controller.getMembers);
router.get('/members/:id', controller.getMember);
router.post('/members', controller.insertGroup);

module.exports = router;