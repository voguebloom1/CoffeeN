const router = require('express').Router();
const controller = require('./group.controller');

router.get('/groups', controller.getGroups);
router.post('/groups', controller.insertGroup);

module.exports = router;