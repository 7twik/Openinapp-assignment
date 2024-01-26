const User=require("../model/userSchema.js");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const register=async(req,res)=>{

    // 1)check if user already exist
    // 2) hash the password
    // 3) create a new user
    // 4) generate token
    // 5) send response

    try{
        const {user,pass,number}=req.body;
        
        console.log(req.body,user,pass);
        const finduser=await User.findOne({user:user});
        if(finduser)
        {
            return res.status(400).json({message:"user already exist"});
        }
        else{
            const hash=await bcrypt.hash(pass,7);
            const newuser=await User.create({user:user,pass:hash,number:number,priority:-1});

            const token=jwt.sign({id:newuser._id,user:newuser.user},process.env.JWT_SECRET);
            res.status(200).json({message:"user created",token:token});
        }
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({message:"internal server error"});
    }
}

const login=async(req,res)=>{

    // 1)check if user already exist
    // 2) compare the password
    // 3) generate token
    // 4) send response

    try{
        const {user,pass}=req.body;
        console.log(req.body);
        const finduser=await User.findOne({user:user});
        if(finduser)
        {
            const match=await bcrypt.compare(pass,finduser.pass);
            if(match){
                const token=jwt.sign({id:finduser._id,user:finduser.user},process.env.JWT_SECRET);
                res.status(200).json({message:"user logged in",token:token});
            }
            else{
                return res.status(401).json({message:"invalid credentials"});
            }
        }
        else{
            
            return res.status(404).json({message:"no such user exist"});
        }
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({message:"internal server error"});
    }
}

module.exports={register,login};