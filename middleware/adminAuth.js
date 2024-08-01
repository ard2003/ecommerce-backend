const jwt=require('jsonwebtoken')

module.exports = function veryfyToken(req,res,next){
    const {token,refreshToken}=req.cookies

    if(!token){
        if(!refreshToken){
            return res.status(404).json({message :'pls login'})
        }
        return res.status(404).json({message: 'Unauthorized'})
    }
    jwt.verify(token,process.env.ACCES_TOKEN_SECRET,(err,decoded)=>{
        if(err){
            console.log(err)
            return res.status(404).json({
                message:"Unauthorized"
            })
        }
            req.email=decoded.email
        next()
    })
}
 