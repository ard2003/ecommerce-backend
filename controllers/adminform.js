const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { adminschema, validateAdmin } = require("../models/admin");
const dotenv = require("dotenv");
const multer = require("multer");
const{validateProductDtl,productSchema}=require('../models/product')

const path=require('path')

dotenv.config();
//admin registratin section
const adminRegistration = async (req, res) => {
  const { error } = validateAdmin(req.body);
  //validating value
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let admin = await adminschema.findOne({ email: req.body.email });
  if (admin) {
    return res.status(400).send("User already exists, please sign in");
  }

  try {
    //passwod hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    admin = new adminschema({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    await admin.save();

    //generate jwt token
    const token = jwt.sign({ _id: admin.id }, process.env.SECRET_KEY);

    return res.status(200).json({ admin, token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}; //admin login section
const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  let admin = await adminschema.findOne({ email });
  if (!admin) {
    return res.status(400).send("invalid email or password");
  }
  const validPassword = await bcrypt.compare(password, admin.password);
  if (!validPassword) {
    return res.status(400).send("invalid email ir pass word ");
  }
  const token = jwt.sign({ _id: admin._id }, process.env.SECRET_KEY);
  return res.status(200).json({ admin, token });
};

//set storage engine
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage,
  fileFilter:(req,file,cb)=>{
        checkFileType(file,cb)
  }
 }).single('productImage');
//only uploding image cheking
function checkFileType(file,cb){
  const fileTypes=/jpeg|jpg|png|gif/
  const extname=fileTypes.test(path.extname(file.originalname).toLowerCase())
  if(extname){
    return cb(null,true)
  }else{
    cb('Error: images only')
  }
}
//addproduct section
const addproduct = async (req, res) => {
  //validate product dtls
  const {error} = validateProductDtl(req.body);
  if(error){
    return res.status(400).send(error.details[0].message)
  }
  try{const { name, category,  description, price } = req.body;
const product=new product({
  name,
  description,
  price,
  category,
  image:req.file.path
})
await product.save()
res.status(201).json({product})
}catch(err){
  res.status (500)
}
}

module.exports = { adminLogin, adminRegistration ,addproduct};
