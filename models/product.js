const mongoose=require("mongoose")
const { type } = require("os")
const { stringify } = require("querystring")


const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    price:Number,
    description:String,
    image:{
        type:String,
        required:true
    },category:{
        type:String,
        enum:{
            values:['cat','dog']
        }
    },

})
module.exports=mongoose.model('productSchema',productSchema)