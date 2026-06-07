//create acc and login the website
//route for user login


import userModel from '../models/userModel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET || process.env.JWT_SECRET_KEY)
}

const loginUser = async(req,res)=>{
     try{
        //if user has an email id already
        const {email, password} = req.body;
        // if user doesnt have one then create response
        const user = await userModel.findOne({email});
        if (!user){
            return res.json({success: false, message: "user does not exist"})
        }
        const isMatch = await bcrypt.compare(password, user.password);//password saved in our database
        if (isMatch){
            const token = createToken(user._id); //take token from createToken function and pass user id to it
            res.json({success: true, token})
        }
        else {
            res.json({success: false, message: "Incorrect password"})
        }
     }
     catch(error){
         console.log(error);
         res.json({success: false, message: "An error occurred"})
     }

}

//route for user registration
const registerUser = async (req,res)=>{
        try{
            //if anyone will hit the api endpoint with name email and password then we will get those values in the req.body
            const {name,email,password} = req.body;
            //checking user already exists or not 
            const exits = await userModel.findOne({email});
            if (exits){
                return res.json ({success: false, message: "User already exists"})
            }
        
            //validating the password and email and name
            if (!validator.isEmail(email)) {
                return res.json ({success: false, message: "Please enter a valid email"})}
            if (password.length < 8) {
                return res.json ({success: false, message: "Please enter strong password"})}

            //hashing user password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new userModel ({
                name,
                email,
                password: hashedPassword
            })

            const user = await newUser.save();

            const token = createToken(user._id);

            res.json({success: true, token})
    }
        catch(error){
            console.log (error);
            res.json({sucess:false, message: error.message})
        }
}
const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const updatedUser = await userModel
      .findByIdAndUpdate(
        req.userId,
        { name, email, phone, address },
        { new: true }
      )
      .select("-password");

    res.json({
      success: true,
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//route for admin login
const adminLogin = async (req,res)=>{

}
export {
  loginUser,
  registerUser,
  adminLogin,
  getUserProfile,
  updateUserProfile,
};