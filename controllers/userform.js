const dotenv = require('dotenv')
const {UserSchema,validateUser}=require('../models/user')
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken')
const productSchema=require('../models/product')

//userregistration
const userRegistration = async (req,res)=>{
    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message,"error from joi");
    }
    const findUser =  await UserSchema.findOne({email:req.body.email})
    if(findUser){
     return res.status(400).json({message:'user allready exited'})
     
    }//password hashing
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user = new UserSchema({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
  
      await user.save();
    
      return res.status(201).json(user);
  
      
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
}
//userlogin
const userLogin= async (req,res)=>{
  const { email, password } = req.body;
  


  //finding same email
  const user = await UserSchema.findOne({ email });
  if (!user) {
    return res.status(404).send("Invalid email or password");
  }
  //password validating
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(404).send("Invalid email or password");
  }
  //JWT TOKE CREATION
  // const token = jwt.sign(
  //   { _id: user._id, email: user.email, username: user.username },
  //   process.env.SECRET_KEY
    
  // );
  // res.cookie('token',token)
  return res.status(201).json(user);
}
//product section

//all productd
const viewProducts = async (req, res) => {
  const token=req.cookies
console.log(token)
  const products = await productSchema.find();
  if (products.length === 0) {
    res.status(404).json({ message: "no products found" });
  } else {
    res.status(200).json(products);
  }
};
// specific product
const viewProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await productSchema.findById(productId);
  if (!product) {
    res.status(404).json({message:'product not found'})
  } else {
    res.status(200).json(product);
  }
};
//product by catagory

const productByCatagory = async (req, res) => {
  const category = req.params.id;
  const productCatagory = await productSchema.aggregate([
    { $match: { category: category } },
  ]);
  if (productCatagory.length === 0) {
    res.status(404).json({ message: "product not found" });
  }
  {
    res.status(201).json(productCatagory);
  }
};

//add to cart
const addToCart=async(req,res)=>{
  
}

module.exports={userRegistration,userLogin,viewProducts,viewProduct,productByCatagory}