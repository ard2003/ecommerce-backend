const mongoose=require("mongoose")



const cartSchema=new mongoose.Schema({
  cart:[ 
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
    
    required:true
},


})
module.exports=mongoose.model('cartSchema',cartSchema)



