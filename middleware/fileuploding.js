// middleware/upload.js
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const path=require('path')
const fs= require('fs')

const storage=multer.diskStorage({})

const upload = multer({ storage: storage });

const uploadFile=(req,res,next)=>{
  upload.single('image')(req,res,async(error)=>{
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.cloudinaryImageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Delete the local file after uploading
    } else if (req.body.imageURL) {
      req.cloudinaryImageUrl = req.body.imageURL;
    }
    next();
  } catch (error) {
    console.error(error);
      next(error);
  }
 })
}


module.exports ={ uploadFile};
