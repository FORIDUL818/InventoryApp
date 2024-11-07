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
// emilRecovary start
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
// emilRecovary end

// otp Varification start
const OtpVarification = async (req, res) => {
    try {
       const email=req.params.email;
       const otp=req.params.otp;
        const status = 0; // Assuming default status
        const statusUpdate = 1; // Assuming status update value

        const otpCheck = await OtpModel.aggregate([
            {
                $match: {
                    email: email,
                    otp: otp,
                    status: status
                }
            },
            {
                $count: "total"
            }
        ]);

        // If OTP record found, update its status and send success response
        if (otpCheck.length>0) {
            const otpUpdate = await OtpModel.updateOne(
                { email: email, otp: otp },
                { status: statusUpdate }
            );
            return res.status(200).json({ status: "success", data: otpUpdate });
        } else {
            // If OTP record not found, send failure response
            return res.status(200).json({ status: "failed", data: "Invalid OTP" });
        }
    } catch (err) {
        // Handle any unexpected errors
        return res.status(200).json({ status: "failed", data: err.message });
    }
};
// otp Varification end

// reset password start
 const passwordReset=async(req,res)=>{
    let email=req.body.email;
    let otp=req.body.otp;
    let statusUpdate=1
    let newPassword=req.body.password
  try{
let otpchack=await OtpModel.aggregate(
    [
        {$match:{email:email,otp:otp,status:statusUpdate}},
        {$count:"total"}
      ]
     )
     if(otpchack.length>0){
     let updatePassword=await userModel.updateOne({email:email},{password:newPassword})
     res.status(200).json({status:"success",data:updatePassword})
    }
}
catch(err){
res.status(200).status({status:"faild",data:err})
}
}
// reset password end

// module start 
 module.exports={
    Registration,
    login,
    emailRecovary,
    OtpVarification,
    passwordReset
    

 }
// module end


