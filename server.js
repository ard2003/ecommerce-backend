// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const adminRoute = require('./routes/admin');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/api', adminRoute);

connectDB();

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
