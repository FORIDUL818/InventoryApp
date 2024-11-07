const userModel = require("../Models/UserModel");
const bcrypt=require("bcrypt")
const jwt =require('jsonwebtoken');
const SendEmailUtility = require("../Utility/SendMailUtility");
const OtpModel = require("../Models/OtpModel");

// Ragistration start
const Registration=async(req,res)=>{
    try {
        let {firstName,lastName,email,password}=req.body;
        let userVarification=await userModel.findOne({email})
        if(userVarification){
            return res.status(401).json({status:"your email already in use"})
        }
      let userdata=await userModel.create({firstName,lastName,email,password});
        if(userdata){
          res.status(200).json({status:"succssess",data:userdata})
        }
      
    } catch (error) {
        res.status(401).json({status:"fail",data:error.message})
    }
}
// Ragistration end

// login start
   const login=async(req,res)=>{
    try {
        let {email,password}=req.body;
        let userData=await userModel.findOne({email})
        if(!userData){
           return res.status(401).json({status:"fail",data:"user not found"});
        }
        let isPassword=await bcrypt.compare(password,userData.password)
        if(!isPassword){
            return res.status({staus:"fail",data:"your password not corrected"})
        }
        else{
            let payload={exp:Math.floor(Date.now()/1000)+(60*60*24),data:userData.email};
              let token=jwt.sign(payload,process.env.SECRATE_PASS);
              res.status(200).json({status:"success",data:userData,token:token})
        }
    } catch (error) {
        res.status(500).json({status:"fail",data:error})
    }
   }
// login end

const emailRecovary=async(req,res)=>{
    try {
        const email = req.params.email;
        const otp = Math.floor(Math.random() * 1000000); // Generate a random OTP

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(200).json({ status: "fail", data:"User not found" });
        }

        // Create a new entry in the OtpModel to store the OTP
        const createdOtp = await OtpModel.create({email,otp});

        // Send the OTP via email
        const sendMailResult = await SendEmailUtility(email, `Your OTP for account recovery: ${otp}`, "Account Recovery OTP");

        return res.status(200).json({
            status: "success",
            data: "Email and OTP verification sent successfully",
             sendMailResult: sendMailResult,
             createdOtp:createdOtp
        });
    } catch (err) {
        res.status(200).json({ status: "failed", data: err.message });
    }
}

// module start 
 module.exports={
    Registration,
    login,
    emailRecovary

 }
// module end


