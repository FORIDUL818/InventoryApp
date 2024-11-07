const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const bodyParser=require("body-parser")
const mongoConnect = require("./src/db/db")
const dotenv=require("dotenv")
const router = require("./src/Routes/UserRouter")
dotenv.config()
const app=express()

//middleware start
app.use(cors())
app.use(bodyParser.json())
//middleware end

// root point start
  app.use("/api/v1",router)
// root point end

// error handle Start
 app.use((req,res)=>{
    res.status(404).json({status:"not found"}) 
 })
// error handle end

// mongo Connect start
  mongoConnect()
  .then(()=>console.log(`database connected`))
  .catch((err)=>console.log(err))
// mongo Connect end

module.exports=app;

