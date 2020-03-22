const router = require('express').Router();
const controller = require('./group.controller');

router.get('/groups', controller.getGroups);
router.get('/groups/:group_id',controller.getGroup);
router.post('/groups', controller.insertGroup);
router.put('/groups/:group_id', controller.updateGroup);


// member
router.get('/groups/:group_id/members', controller.getMembers);
router.get('/groups/:group_id/members/:member_id', controller.getMember);
router.put('/groups/:group_id/members/:member_id', controller.updateMember);
router.post('/groups/:group_id/members', controller.addMember);
router.delete('/groups/:group_id/members/:member_id', controller.removeMember);

// store
router.get('/groups/:group_id/stores', controller.getGroupStores);
router.get('/groups/:group_id/stores/:store_id', controller.getGroupStore);
router.post('/groups/:group_id/stores', controller.insertGroupStore);
router.put('/groups/:group_id/stores/:store_id', controller.updateGroupStore);
router.delete('/groups/:group_id/stores/:store_id', controller.removeGroupStore);

// menu
router.get('/groups/:group_id/stores/:store_id/menu', controller.getGroupStoreMenuList);
router.get('/groups/:group_id/stores/:store_id/menu/:menu_id', controller.getGroupStoreMenu);
router.put('/groups/:group_id/stores/:store_id/menu/:menu_id', controller.updateGroupStoreMenu);
router.delete('/groups/:group_id/stores/:store_id/menu/:menu_id', controller.removeGroupStoreMenu);
router.post('/groups/:group_id/stores/:store_id/menu', controller.insertGroupStoreMenu);




module.exports = router;