const jwt=require('jsonwebtoken')

module.exports = function veryfyToken(req,res,next){
    const {token} = req.cookies
    console.log('THIS FROM MIDDLEWEAR',token)

    if(!token){
        return res.status(404).json({message: 'Unauthorized'})
    }jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
        if(err){
            console.log(err)
            return res.status(401).json({message:"anuthorized"})
        }
        req.email=decoded.email;
        next
    })
}
 