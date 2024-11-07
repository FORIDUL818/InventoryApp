const express=require("express")
const { Registration, login, emailRecovary, OtpVarification, passwordReset  } = require("../Controller/UserController")

const router=express.Router()

router.post("/ragistration",Registration);
router.post("/login",login);
router.get("/emailRecovary/:email",emailRecovary);
router.get("/otpVarification/:email/:otp",OtpVarification);
router.get("/resetPassword",passwordReset);
module.exports=router;