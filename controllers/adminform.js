// controllers/adminform.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { adminschema, validateAdmin } = require("../models/admin");
const { validateProductDtl } = require("../models/product");
const UserSchema = require("../models/user");
const productSchema = require("../models/product");
const cartSchema = require("../models/cart");
const orderSchema = require("../models/order");
const dotenv = require("dotenv");
dotenv.config();
//VALIDATE ADMIN REGISTRAION
const adminRegistration = async (req, res) => {
  console.log("dsfdsfds ",req.body);
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
  console.log(req.body)


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
    const product = new productSchema({
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
  }
  try {
    const { name, category, description, price, image } = req.body;
    const product = await productSchema.findById(id);
    console.log(id);
    if (!product) {
      return res.status(400).json("message item not found");
    }

    product.image = req.cloudinaryImageUrl;
    await productSchema.findByIdAndUpdate(
      {
        _id: id,
      },
      {
        name: name,
        price: price,
        image: req.cloudinaryImageUrl,
        description: description,
        category: category,
      }
    );
    res.status(200).json({ success: true, message: "updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//delete products
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  const deleted = await productSchema.findByIdAndDelete(id);

  if (!deleted) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Successfully deleted",
  });
};
// viewAllproducts
const viewProducts = async (req, res) => {
  const products = await productSchema.find();
  if (products.length === 0) {
    res.status(404).json({ message: "no products found" });
  } else {
    res.status(201).json(products);
  }
};
// view product

const viewProduct = async (req, res) => {
  const productId = req.params.id;
  const product = await productSchema.findById(productId);
  if (!product) {
    res.status(404);
  } else {
    res.status(201).json(product);
  }
};
// view users

const viewUsers = async (req, res) => {
  const users = await UserSchema.find();
  if (users.length === 0) {
    res.status(404).json({ message: "no users found" });
  } else {
    res.status(201).json(users);
  }
};

// view user
const viewUser = async (req, res) => {
  const userId = req.params.id;

  const user = await UserSchema.findById(userId);
  if (!user) {
    res.status(404).json({
      message: "no user found",
    });
  } else {
    res.status(201).json(user);
  }
};
//view product by category

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

//view user cart
const getcart = async (req, res) => {
  const userId = req.params.id;
  const cart = await cartSchema
    .findOne({ userId: userId })
    .populate("cart.productId");
  if (!cart || cart.cart.length === 0) {
    res.status(404).json({
      message: "cart is empty",
    });
  }
  {
    res.status(201).json(cart);
  }
};
// view order

const orders = async (req, res) => {
  
  const products = await orderSchema.find().populate("products.productId");
  if (products.length === 0) {
    res.status(404).json({
      message: "no orders found", 
    });
  }
  {
    res.status(201).json(products);
  }
};
//specifiic order

const order = async(req,res) => {
  const userId = req.params;
  console.log(userId)
const products=await orderSchema.find({userId:userId}).populate("products.productId")
console.log(products,"this product")
if(!products){
  res.status(404).json({
    message:'order not found'
  })
}else{
  res.status(201).json(products)
}
};
const totalRevenue=async(req,res)=>{
  const revenue=await orderSchema.aggregate([
    {$group:{_id:null,totalrevenue:{$sum:'$totalPrice'}}}
  ])
  if(revenue.length > 0){
    res.status(200).json(revenue[0])
  }else{
    res.status(404).json({message:'no revanue genarated'})
  }
}

module.exports = {
  adminLogin,
  adminRegistration,
  addproduct,
  updateProduct,
  deleteProduct,
  viewUsers,
  viewUser,
  viewProducts,
  viewProduct,
  productByCatagory,
  getcart,
  orders,
  order,
  totalRevenue,
};
