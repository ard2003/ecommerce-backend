// controllers/adminform.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { adminschema, validateAdmin } = require('../models/admin');
const { validateProductDtl, productSchema } = require('../models/product');
const dotenv = require('dotenv');
dotenv.config();

const adminRegistration = async (req, res) => {
  const { error } = validateAdmin(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let admin = await adminschema.findOne({ email: req.body.email });
  if (admin) {
    return res.status(400).send('User already exists, please sign in');
  }

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

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  let admin = await adminschema.findOne({ email });
  if (!admin) {
    return res.status(400).send('Invalid email or password');
  }
  const validPassword = await bcrypt.compare(password, admin.password);
  if (!validPassword) {
    return res.status(400).send('Invalid email or password');
  }
  const token = jwt.sign({ _id: admin._id }, process.env.SECRET_KEY);
  return res.status(200).json({ admin, token });
};

const addproduct = async (req, res) => {
  const { error } = validateProductDtl(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const { name, category, description, price } = req.body;
    const product = new productSchema({
      name,
      description,
      price,
      category,
      image: req.file.path
    });
    await product.save();
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { adminLogin, adminRegistration, addproduct };
