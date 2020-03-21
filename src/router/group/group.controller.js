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
            console.log(group);
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

exports.getMembers = (req, res) => {
    const {group_id} = req.params;
    Group.findById(group_id)
        .then(group => {
            res.send(group.members);
        });
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