const jwt = require('jsonwebtoken')
const trycatch = require('../utils/tryCatchHandler')
const {UserSchema} = require('../models/user')

const userAuth= trycatch(async(req,res,next)=>{

    const {token}=req.cookies
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Unauthorized: token is missing"})
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    const user = await UserSchema.findById(decode.id)
    if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }
      req.user = user;
      next();
})
module.exports = userAuth