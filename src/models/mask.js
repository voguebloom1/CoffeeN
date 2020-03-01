const mongoose = require('mongoose');

const maskSchema = new mongoose.Schema({
    mask_id : { type: String, required: true, unique: true},
    title: String,
    content: String,
    price: Number,
    total : Number,
    max: Number,
    start_date: String,
    end_date: String,
    soldout: Boolean,
    prev_img_url : {type: String},
},
{
    timestamps: true
})

maskSchema.statics.findAll = function(){
    return this.find({});
}

maskSchema.statics.create = function(new_mask){
    const mask = new this(new_mask);
    return mask.save();
}

module.exports = mongoose.model('Mask', maskSchema);