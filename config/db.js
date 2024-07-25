const mongoose=require('mongoose')

const connectDB = async()=>{
          try{
            const conn=await mongoose.connect(process.env.DB_URL)
            console.log(`mongoconnected : ${conn.connection.name}`)
          }catch(err){
            console.error(`error: ${err}`)
            process.exit()
          }

}
module.exports = connectDB