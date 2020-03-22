const mongoose = require('mongoose');
const Group = require('../../models/group');

exports.getGroups = (req, res) => {
    Group.findAll()
        .then((groups)=> {
            res.json(groups);
        })
        .catch(err => res.status(500).send(err));
}

exports.getGroup = (req, res) => {
    const {group_id} = req.params;
    Group.findById(group_id)
        .then(group => {
            res.send(group);
        });
}

exports.insertGroup = (req, res) => {
    const group = new Group(req.body);
    if(group.name){
        Group.create(group)
        .then(newGroup => res.send(newGroup))
        .catch(err => res.status(500).send(err));
    }else{
        res.status(400).send("이름이 필요해요!");
   }
}

exports.updateGroup = (req, res) => {
    const group = req.body;
    const {group_id} = req.params;
    Group.findByGroupIdAndUpdate(group_id, group)
        .then((group) => res.json(group))
        .catch(err => res.status(500).send(err));
}

// member

exports.getMembers = (req, res) => {
    const {group_id} = req.params;
    Group.findById(group_id)
        .then(group => {
            res.send(group.members);
        });
}

exports.getMember = (req, res) => {
    const {group_id, member_id} = req.params;
    Group.findById(group_id)
        .then(group => {
            const member = group.members.find(m => m._id == member_id);
            res.send(member);
        });
}

exports.updateMember = (req, res) => {
    const {group_id, member_id} = req.params;
    const member = req.body;
    Group.findByGroupIdAndUpdateMember(group_id, member_id, member)
        .then(group => {
            res.json(group.members);
        })
}

exports.addMember = (req, res) => {
    const member = req.body;
    const {group_id} = req.params;
    Group.findByGroupIdAndAddMember(group_id, member)
        .then(group => res.json(group))
        .catch(err => res.status(500).send(err));
}

exports.removeMember = (req, res) => {

    const { group_id, member_id } = req.params; 
    Group.findByGroupIdAndRemoveMember(group_id, member_id)
        .then((group) => res.json(group))
        .catch(err => res.status(500).send(err));
}

// store

exports.getGroupStores = (req, res) => {
    const {group_id} = req.params;
    Group.findById(group_id)
        .then(group => {
            res.send(group.store);
        });
}

exports.getGroupStore = (req, res) => {
    const {group_id, store_id} = req.params;
    Group.findById(group_id)
        .then(group => {
            const store = group.store.find((s) => s._id == store_id);
            if(store){
                res.json(store);
            }else{
                res.json({});
            }
        });
}

exports.insertGroupStore = (req, res) => {
    const store = req.body;
    const {group_id} = req.params;
    Group.findByGroupIdAndAddStore(group_id, store)
        .then(group => res.json(group))
        .catch(err => res.status(500).send(err));
}

exports.updateGroupStore = (req, res) => {
    const store = req.body;
    const {group_id, store_id} = req.params;
    Group.findByGroupIdAndUpdateStore(group_id, store_id, store)
        .then(group => res.json(group))
        .catch(err => res.status(500).send(err));
}

exports.removeGroupStore = (req, res) => {
    const {group_id, store_id} = req.params;
    Group.findByGroupIdAndRemoveStore(group_id, store_id)
    .then(group => res.json(group.store))
    .catch(err => res.status(500).send(err));
}

// Menu

exports.getGroupStoreMenuList = (req, res) => {
    const {group_id, store_id} = req.params;
    Group.findById(group_id)
        .then(group => {
            const store = group.store.find(s => store_id == s._id);
            res.json(store.menu);
        });
}

exports.getGroupStoreMenu = (req, res) => {
    const {group_id, store_id, menu_id} = req.params;
    Group.findById(group_id)
        .then(group => {
            const store = group.store.find(s => store_id == s._id);
            const menu = store.menu.find(m => menu_id == m._id);
            res.json(menu);
        });
}

exports.insertGroupStoreMenu = (req, res) => {
    const menu = req.body;
    const {group_id, store_id} = req.params;
    Group.findByGroupIdAndAddStoreMenu(group_id, store_id, menu)
        .then(group => res.json(group))
        .catch(err => res.status(500).send(err));}

exports.updateGroupStoreMenu = (req, res) => {
    const menu = req.body;
    const {group_id, store_id, menu_id} = req.params;
    Group.findByGroupIdAndUpdateStoreMenu(group_id, store_id, menu_id, menu)
        .then(group => res.json(group))
        .catch(err => res.status(500).send(err));
}

exports.removeGroupStoreMenu = (req, res) => {
    const {group_id, store_id, menu_id} = req.params;
    Group.findByGroupIdAndRemoveStoreMenu(group_id, store_id, menu_id)
        .then(group => {
            res.json(group);
        });
}