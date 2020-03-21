const mongoose = require('mongoose');


const menuSchema = new mongoose.Schema({
    name: String,
    price: Number,
    shot_name: String
})

const memberSchema = new mongoose.Schema({
    name: String
})

const groupSchema = new mongoose.Schema({
    name: String,
    store : {
        name : String,
        menu : [menuSchema]
    },
    members : [memberSchema]
},
{
    timestamps: true
})

groupSchema.statics.findAll = function(){
    return this.find({});
}

groupSchema.statics.create = function(group){
    const mask = new this(group);
    return mask.save();
}

groupSchema.statics.findByGroupId = function(group_id){
    const id = mongoose.Types.ObjectId(group_id);
    console.log(id);
    return this.findOne({_id : id});
}

groupSchema.statics.findByGroupIdAndUpdate = function(group_id, group){
    const id = mongoose.Types.ObjectId(group_id);
    return this.findOneAndUpdate({_id: id}, group, {new : true});
}

groupSchema.statics.findByGroupIdAndAddMember = function(group_id, new_member){
    return this.findOne({_id: group_id})
        .then(group => {
            console.log(group);
            group.members.push(new_member);
            return group.save();
            })
}

groupSchema.statics.findByGroupIdAndRemoveMember = function(group_id, member_id){
    return this.findOne({_id: group_id})
        .then(group => {
            const arr = group.members;  
            for(let i = arr.length-1; i>=0; i--){
                if(arr[i]._id == member_id){
                    group.members.splice(i, 1);
                }
            }
            return group.save();
        }) 
}

module.exports = mongoose.model('Group', groupSchema);