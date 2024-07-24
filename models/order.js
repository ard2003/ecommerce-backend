const mongoose=require("mongoose")



const orderSchema=new mongoose.Schema({
  products:[ 
    {productId:{
        type:mongoose.Schema.ObjectId,
        ref:'product',
        required:true,
    },
            quantity:{
                type:Number,
                default:1
            },

        }],
userId:{
    type:mongoose.Schema.ObjectId,
    ref:'userSchema',
    required:true
},
totalItems:{
    type:Number,
    default:0,

},
totalPrice:{
    type:Number,
    default:0
},
orderId:{
    type:Number
}

})
module.exports=mongoose.model('orderSchema',orderSchema)