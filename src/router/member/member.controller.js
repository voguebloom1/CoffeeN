const mongoose = require('mongoose');
const Member = require('../../models/member');

exports.getMembers = (req, res) => {
    Member.findAll()
        .then((members)=> {
            res.json(members);
        })
        .catch(err => res.status(500).send(err));
}

exports.getMember = (req, res) => {
    console.log(req.params);
    res.json({})
}


exports.insertGroup = (req, res) => {

    const request = new Member(req.body);
    if(request.name){
        Member.create(request)
        .then(newMember => res.send(newMember))
        .catch(err => res.status(500).send(err));
    }else{
        res.status(400).send("이름이 필요해요!");
    }


}