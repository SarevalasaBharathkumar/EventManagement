const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const jwtSecret = "IamaProjessionalwebdevloper"
const bcrpt=require('bcryptjs');

router.post("/loginUser",async(req,res)=>{
    let email=req.body.email;
    try{
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User dosen't exists" });
        }
        const pwd = await bcrpt.compare(req.body.password,user.password)
        if(!pwd){
            return res.status(400).json({ success: false, message: "login with correct credentials" });
        }
        const data = {
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data,jwtSecret)
        const userData = {
            email: user.email,
            name: user.name,
            userType: user.userType,
            mobileNumber: user.mobileNumber
          };

        return res.json({success:true,authToken:authToken,userData: userData})
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
})
module.exports=router;