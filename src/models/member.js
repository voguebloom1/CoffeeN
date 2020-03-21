const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: String
},
{
    timestamps: true
})

memberSchema.statics.findAll = function(){
    return this.find({});
}

memberSchema.statics.create = function(member){
    const new_member = new this(member);
    return new_member.save();
}

module.exports = mongoose.model('Member', memberSchema);