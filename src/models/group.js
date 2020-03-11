const mongoose = require('mongoose');


const menuSchema = new mongoose.Schema({
    name : String,
    price : Number
})
const groupSchema = new mongoose.Schema({
    name: String,
    store : {
        name : String,
        menu : {
            type: [menuSchema],
            default: undefined
        }
    }
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

module.exports = mongoose.model('Group', groupSchema);