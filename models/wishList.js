const mongoose = require('mongoose')

const wishList = mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref :'UserSchema',
        required:true,
        unique:true

    },
    wishList:[
        {
            productID:{
                type:mongoose.Schema.Types.ObjectId,
                ref:Product,
                required:true
            }
        }
    ]
})
module.exports = mongoose.model('whishList',wishList)