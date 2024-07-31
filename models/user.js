const mongoose= require('mongoose')
const { type } = require('os')

const UserSchema = new mongoose.Schema({
name:String,
email:{
    type:String,
    unique:true,
    required:true
},
password:{
    type:String,
    required:true
}
})
module.exports=mongoose.model('UserSchema',UserSchema)