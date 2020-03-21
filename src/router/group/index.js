const router = require('express').Router();
const controller = require('./group.controller');

router.get('/groups', controller.getGroups);
router.get('/groups/:group_id',controller.getGroup);
router.post('/groups', controller.insertGroup);
router.put('/groups/:group_id', controller.updateGroup);



router.get('/groups/:group_id/members', controller.getMembers);
router.post('/groups/:group_id/members', controller.addMember);
router.delete('/groups/:group_id/members/:member_id', controller.removeMember);



module.exports = router;