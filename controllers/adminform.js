const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { adminschema, validateAdmin } = require("../models/admin");
const dotenv = require('dotenv');
const router = express.Router();
dotenv.config();
//admin registratin section
const adminRegistration= async (req, res) => {
    const { error } = validateAdmin(req.body);
    //validating value
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let admin = await adminschema.findOne({ email: req.body.email });
    if (admin) {
        return res.status(400).send('User already exists, please sign in');
    }

    try {
      //passwod hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        admin = new adminschema({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        await admin.save();

        //generate jwt token
const token=jwt.sign({_id:admin.id},process.env.SECRET_KEY)

        return res.status(200).json({admin , token });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};//admin login section
const adminLogin= async (req,res)=>{
const{email,password}=req.body ;
let admin=await adminschema.findOne({email})
if(!admin){
  return res.status(400).send('invalid email or password')
}
const validPassword=await bcrypt.compare(password,admin.password)
if(!validPassword){
  return res.status(400).send('invalid email ir pass word ')
}
const token=jwt.sign({_id:admin._id},process.env.SECRET_KEY,)
 return res.status(200).json({admin,token})
} 


module.exports ={adminLogin,adminRegistration};
