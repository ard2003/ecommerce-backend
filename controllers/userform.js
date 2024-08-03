const dotenv = require('dotenv')
const {UserSchema,validateUser}=require('../models/user')

//userregistration
const userRegistration = async (req,res)=>{
    const { error } = validateUser(req.body);
 
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const findUser =  await UserSchema.findOne({email:req.body.email})
    if(findUser){
     return res.status(400).json({message:'user allready exited'})
    }
}