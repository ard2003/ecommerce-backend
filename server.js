// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const adminRoute = require('./routes/admin');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json()); // Built-in middleware to parse JSON bodies

app.use('/api', adminRoute);

connectDB();

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
