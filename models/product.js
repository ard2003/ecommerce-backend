const mongoose=require("mongoose")
const joi=require("joi")



const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },category:{
        type:String,
        enum:['cat','dog'] 
        
    },

})

function validateProductDtl(product){
     const schema = joi.object({
        name:joi.string().required(),
        price:joi.number().required(),
        description:joi.string().required(),
        image:joi.string().required(),
        category:joi.string().valid("cat","dog")
     })

}
module.exports=validateProductDtl
module.exports=mongoose.model('productSchema',productSchema)