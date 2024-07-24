const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(express.json());

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

