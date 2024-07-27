const multer = require("multer");
const path = require("path");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");
//set storage engine
const storage = multer.diskStorage({});
const upload = multer({ storage: storage });

const uploadPoductImage = async (req, res, next) => {
  upload.single("productImg")(req, res, async);
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.cloudinaryImage = result.secure_url;
      fs.unlinkSync(req.file.path);
    } else if (req.body.imageURL) {
      req.cloudinaryImage = req.body.imageURL;
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};
module.exports = uploadPoductImage;
