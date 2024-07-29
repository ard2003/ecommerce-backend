// controllers/adminform.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { adminschema, validateAdmin } = require("../models/admin");
const { validateProductDtl } = require("../models/product");
const productSchema = require("../models/product");
const dotenv = require("dotenv");
dotenv.config();
//VALIDATE ADMIN REGISTRAION
const adminRegistration = async (req, res) => {
  const { error } = validateAdmin(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //finding same ADMIN
  let admin = await adminschema.findOne({ email: req.body.email });
  if (admin) {
    return res.status(400).send("User already exists, please sign in");
  }
  //password hashing
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    admin = new adminschema({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    await admin.save();
    const token = jwt.sign({ _id: admin.id }, process.env.SECRET_KEY);

    return res.status(200).json({ admin, token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//ADMIN LOGIN SECTION
const adminLogin = async (req, res) => {
  //VALIDATE ADMIN LOGIN
  const { email, password } = req.body;
  let admin = await adminschema.findOne({ email });
  if (!admin) {
    return res.status(400).send("Invalid email or password");
  }
  const validPassword = await bcrypt.compare(password, admin.password);
  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  }
  //JWT TOKE CREATION
  const token = jwt.sign({ _id: admin._id }, process.env.SECRET_KEY);
  return res.status(200).json({ admin, token });
};
//PRODUCT ADDING SECTION
const addproduct = async (req, res) => {
  console.log("Request Body:", req.body);

  const { error } = validateProductDtl(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const { name, category, description, price, image } = req.body;
    const product = await new productSchema({
      name,
      description,
      price,
      category,
      image: req.cloudinaryImageUrl,
    });
    await product.save();
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//update product

const updateProduct = async (req, res) => {
  // const { token } = req.cookies;
  const { id } = req.params;

  const { error } = validateProductDtl(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }try {
    const { name, category, description, price, image } = req.body
    const product=await productSchema.findById(id)
    console.log(id)
if(!product){
  return res.status(400).json('message item not found')
}

product.image = req.cloudinaryImageUrl
await productSchema.findByIdAndUpdate({
  _id:id
},
{
  name:name,
  price:price,
  image:req.cloudinaryImageUrl,
  description:description,
  category:category,

})
res.status(200).json({success:true,
  message:"updated successfully"
})
  } catch (error) {
    res.status(500).json({ message: error.message }) 
  }
};
//delete products
const deleteProduct=async(req,res)=>{
  const {id}=req.params
  console.log(req.head)

  const deleted=await productSchema.findByIdAndDelete(id)
  if (!deleted) {
  
    return res.status(404).json({
      success: false,
      message: "Product not found",
    })
  }
 res.status(200).json({
  message:"success fully deleted"
 })
}


module.exports = { adminLogin, adminRegistration, addproduct ,updateProduct,deleteProduct};
