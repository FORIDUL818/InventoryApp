const express=require("express")
const { Registration, login, emailRecovary } = require("../Controller/UserController")

const router=express.Router()

router.post("/ragistration",Registration);
router.post("/login",login);
router.get("/emailRecovary/:email",emailRecovary);
module.exports=router;