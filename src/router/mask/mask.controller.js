const mongoose = require('mongoose');
const Mask = require('../../models/mask');

exports.getMasks = (req, res) => {
    console.log(Mask);
    Mask.findAll()
        .then((masks)=> {
            res.json(masks);
        })
        .catch(err => res.status(500).send(err));
}

exports.getMask = (req, res) => {
    res.json({})
}

exports.insertMask = (req, res) => {

    const mask = new Mask(req.body);
    mask.cre_dtm = new Date();
    mask.upd_dtm = new Date();

    Mask.create(mask)
        .then(new_mask => res.send(new_mask))
        .catch(err => res.status(500).send(err));
}