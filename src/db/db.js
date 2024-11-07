const mongoose=require("mongoose")

const mongoConnect=()=>{
    return mongoose.connect(process.env.MONGO_URI);
}
module.exports=mongoConnect;