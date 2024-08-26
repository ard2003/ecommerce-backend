const dotenv = require("dotenv");
const { UserSchema, validateUser } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const productSchema = require("../models/product");
const cartSchema = require("../models/cart");
const orderSchema = require("../models/order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//userregistration
const userRegistration = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message, "error from joi");
  }
  const findUser = await UserSchema.findOne({ email: req.body.email });
  if (findUser) {
    return res.status(400).json({ message: "user allready exited" });
  } //password hashing
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
};
//userlogin
const userLogin = async (req, res) => {
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
  const token = jwt.sign(
    { _id: admin._id, email: admin.email, username: admin.username },
    process.env.SECRET_KEY
  );
  res.cookie("token", token);
  return res.status(201).json({ user, token });
};
//product section

//all productd
const viewProducts = async (req, res) => {
  const token = req.cookies;
  console.log(token);
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
    res.status(404).json({ message: "product not found" });
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
const addToCart = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { productId } = req.body;
    //tokenvalidation
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "token not provided" });
    }
    const valid = await jwt.verify(token, process.env.SECRET_KEY);
    const userId = valid._id;
    let cart = await cartSchema.findOne({ userId });
    //add to exiting cart
    if (cart) {
      const productIndex = cart.cart.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (productIndex > -1) {
        cart.cart[productIndex].quantity += 1;
      } else {
        cart.cart.push({ productId, quantity: 1 });
      }
      //create new cart
    } else {
      cart = new cartSchema({
        userId,
        cart: [{ productId, quantity: 1 }],
      });
    }
    await cart.save();
    res.status(201).json({ message: "product added successfully" });
    console.log("product added successfully");
  } catch (error) {
    console.error("error :", error);
  }
};
//view Cart
const getCart = async (req, res) => {
  const { token } = req.cookies;

  const valid = await jwt.verify(token, process.env.SECRET_KEY);

  const userId = valid._id;
  console.log(userId);
  const user = await cartSchema
    .findOne({ userId: userId })
    .populate("cart.productId");
  console.log(user, "this is user ");
  if (!user || user.cart.length === 0) {
    res.status(404).json({ message: "cart is empty" });
  }
  res.status(200).json(user);
};
//increment cart items
const incrementQuantity = async (req, res) => {
  const { token } = req.cookies;
  const { productId } = req.params;
  const valid = await jwt.verify(token, process.env.SECRET_KEY);
  const userId = valid._id;

  const cart = await cartSchema.findOne({ userId: userId });
  const itemIndex = cart.cart.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    cart.cart[itemIndex].quantity += 1;
  }
  await cart.save();
  res.status(200).send("Product quantity increased");
};
//cart items dcriment
const dcrimentQuantity = async (req, res) => {
  const { token } = req.cookies;
  const { productId } = req.params;
  const valid = await jwt.verify(token, process.env.SECRET_KEY);
  const userId = valid._id;

  const cart = await cartSchema.findOne({ userId: userId });
  const itemIndex = cart.cart.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    cart.cart[itemIndex].quantity -= 1;
  }
  await cart.save();
  res.status(201).send("Product quantity decreased");
};
//remove cart items

const deleteItems = async (req, res) => {
  const { token } = req.cookies;
  const { productId } = req.params;
  const valid = await jwt.verify(token, process.env.SECRET_KEY);
  const userId = valid._id;
  const cart = await cartSchema.findOne({ userId: userId });
  const itemIndex = cart.cart.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (itemIndex > -1) {
    cart.cart.splice(itemIndex, 1);
  }
  await cart.save();
  res.status(201).json({ message: "item deleted" });
};
//buy items

const order = async (req, res) => {
  try {
    const { token } = req.cookies;
    const valid = jwt.verify(token, process.env.SECRET_KEY);
    const userId = valid._id;
    const cartData = await cartSchema.findOne({ userId: userId });
    if (!cartData || cartData.cart.length == 0) {
      return res.status(404).json({ message: "cart is empty" });
    }
    const line_items = [];
    for (const cartItem of cartData.cart) {
      const product = await productSchema.findById(cartItem.productId);
      if (!product) {
        res.status(404).send(`Product with ID ${cartItem.productId} not found`);
      }
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: {
            name: product.name,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: cartItem.quantity,
      });
    }
    //stripe section
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: line_items,
      success_url: "https://react-e-commerce-project-eight.vercel.app/success",
      cancel_url: "https://react-e-commerce-project-eight.vercel.app",
    });
    const sessionId = session.id;
    const sessionUrl = session.url;
    res.cookie("session", sessionId);
    res.send(sessionUrl);
    res.status(200).json({ message: "succes" });
  } catch (error) {
    console.error(error, "form trycatch");
    // Handle specific JWT errors
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token signature");
    }

    // General error handling
    res.status(500).send("An error occurred while processing your order");
  }
};
//by cart items
const orderSucces = async (req, res) => {
  const { session, token } = req.cookies;
  const valid = jwt.verify(token, process.env.SECRET_KEY);
  const userId = valid._id;

  const Cart = await cartSchema.findOne({ userId }).populate({
    path: "cart.productId",
    model: "products",
  });
  if (!Cart || Cart.cart.length === 0) {
    return res.status(200).send("No products found in your cart");
  }
  let totalItems = 0;
  let totalPrice = 0;

  Cart.cart.forEach((item) => {
    const quantity = item.quantity || 0;
    const price = item.productId.price || 0;

    totalItems += quantity;
    totalPrice += quantity * price;
  });

  const order = new orderSchema({
    userId: Cart.userId,
    totalItems,
    totalPrice,
    orderId: `ORD${session}`,
  });
  Cart.cart.forEach((item) => {
    order.products.push({
      productId: item.productId._id,
      quantity: item.quantity,
    });
  });
  await order.save();

  Cart.cart = [];
  await Cart.save();

  res.status(200).send("Order placed successfully");
};
//view orders

const orders = async (req, res) => {
  const { token } = req.cookies;
  const valid = jwt.verify(token, process.env.SECRET_KEY);
  const userId = valid._id;

  const order = await orderSchema.findOne({ userId });

  if (!order) {
    res.status(404).send("No order records");
  }

  res.status(200).json(order);
};

module.exports = {
  userRegistration,
  userLogin,
  viewProducts,
  viewProduct,
  productByCatagory,
  addToCart,
  getCart,
  incrementQuantity,
  dcrimentQuantity,
  deleteItems,
  order,
  orderSucces,
  orders,
};
