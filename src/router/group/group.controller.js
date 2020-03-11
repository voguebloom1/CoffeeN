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
    res.json({})
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