const mongoose = require('mongoose');


const menuSchema = new mongoose.Schema({
    name: String,
    price: Number,
    shot_name: String
})

const storeSchema = new mongoose.Schema({
    name : String,
    menu : [menuSchema]
})

const memberSchema = new mongoose.Schema({
    name: String
})

const groupSchema = new mongoose.Schema({
    name: String,
    store : [storeSchema],
    members : [memberSchema]
},
{
    timestamps: true
})

const MemberModel = mongoose.model('Member', memberSchema);
const StoreModel = mongoose.model('Store', storeSchema);
const MenuModel = mongoose.model('Menu', menuSchema);

groupSchema.statics.findAll = function(){
    return this.find({});
}

groupSchema.statics.create = function(new_group){
    const group = new this(new_group);
    return group.save();
}

groupSchema.statics.findByGroupId = function(group_id){
    return this.findOne({_id : group_id});
}

groupSchema.statics.findByGroupIdAndUpdate = function(group_id, group){
    return this.findOneAndUpdate({_id: group_id}, group, {new : true});
}

// member

groupSchema.statics.findByGroupIdAndAddMember = function(group_id, new_member){
    return this.findOne({_id: group_id})
        .then(group => {
            const member = new MemberModel(new_menu);
            group.members.push(member);
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

groupSchema.statics.findByGroupIdAndUpdateMember = function(group_id, member_id, member){
    return this.findOne({_id: group_id})
        .then(group => {
            const i = group.members.findIndex(m => m._id == member_id);
            console.log(i);
            if(i >= 0 && member.name) {
                
                group.members[i].name = member.name;
            }
            return group.save();
        }) 
}

// Store
groupSchema.statics.findByGroupIdAndAddStore = function(group_id, new_store){
    console.log("findByGroupIdAndAddStore");
    return this.findOne({_id: group_id})
        .then(group => {
            const store = new StoreModel(new_store);
            group.store.push(store)
            return group.save();
        })
}

groupSchema.statics.findByGroupIdAndUpdateStore = function(group_id, store_id, store){
    return this.findOne({_id: group_id})
        .then(group => {
            console.log(group);
            const i = group.store.findIndex( s => s._id == store_id);
            if(store.name && i >= 0){
                group.store[i].name = store.name;
            }
            return group.save();
        })
}

groupSchema.statics.findByGroupIdAndRemoveStore = function(group_id, store_id){
    return this.findOne({_id: group_id})
    .then(group => {
        const arr = group.store;  
        for(let i = arr.length-1; i>=0; i--){
            if(arr[i]._id == store_id){
                group.store.splice(i, 1);
            }
        }
        return group.save();
    }) 
}

//Menu
groupSchema.statics.findByGroupIdAndAddStoreMenu = function(group_id, store_id, new_menu){
    return this.findOne({_id: group_id})
        .then(group => {
            const arr = group.store; 
            for(let i = arr.length-1; i>=0; i--){
                if(arr[i]._id == store_id){
                    const menu = new MenuModel(new_menu);
                    group.store[i].menu.push(menu);
                }
            }
            return group.save();
        })
}

groupSchema.statics.findByGroupIdAndRemoveStoreMenu = function(group_id, store_id, menu_id){
    return this.findOne({_id: group_id})
    .then(group => {
        const arr = group.store;  
        for(let i = arr.length-1; i>=0; i--){
            if(arr[i]._id == store_id){
                for(let j = arr[i].menu.length-1; j>=0; j--){
                    if(arr[i].menu[j]._id == menu_id){
                        group.store[i].menu.splice(j,1);
                    }
                }
            }
        }
        return group.save();
    }) 
}

groupSchema.statics.findByGroupIdAndUpdateStoreMenu = function(group_id, store_id, menu_id, menu){
    return this.findOne({_id: group_id})
        .then(group => {
            const si = group.store.findIndex(s => s._id = store_id);
            if(si >= 0){
                const mi = group.store[si].menu.findIndex(m => m._id = menu_id);
                if(mi >= 0){
                    if(menu.name) group.store[si].menu[mi].name = menu.name;
                    if(menu.shot_name) group.store[si].menu[mi].shot_name = menu.shot_name;
                    if(menu.price) group.store[si].menu[mi].price = menu.price;
                }
            }
            return group.save();
        });
}


module.exports = mongoose.model('Group', groupSchema);