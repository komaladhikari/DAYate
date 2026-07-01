//create acc and login the website
//route for user login

import validator from 'validator';
import bcrypt from 'bcrypt';

import {
  findUserByEmail,
  findUserById,
  findUserWithPasswordById,
  createUser,
  updateUserById,
  createToken,
} from "./auth.service.js";

const loginUser = async(req,res)=>{
     try{
        //if user has an email id already
        const {email, password} = req.body;
        // if user doesnt have one then create response
        const user = await findUserByEmail(email);
        if (!user){
            return res.json({success: false, message: "user does not exist"})
        }
        if (user.role === "business") {
            return res.json({
                success: false,
                message: "Please use the business login",
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);//password saved in our database
        if (isMatch){
            const token = createToken(user._id, user.role || "user"); //take token from createToken function and pass user id to it
            res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role || "user",
                },
            })
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
            const exits = await findUserByEmail(email);
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

            const user = await createUser({
                name,
                email,
                password: hashedPassword,
                role: "user",
            });

            const token = createToken(user._id, user.role);

            res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            })
    }
        catch(error){
            console.log (error);
            res.json({sucess:false, message: error.message})
        }
}
const getUserProfile = async (req, res) => {
  try {
    const user = await findUserById(req.userId);

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
    const { name, email, phone, address, bio, timezone, profilePicture } = req.body;

    const updateData = {
      name,
      email,
      phone,
      address,
      bio,
      timezone,
      profilePicture,
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const updatedUser = await updateUserById(req.userId, updateData);

    res.json({
      success: true,
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a stronger password",
      });
    }

    const user = await findUserWithPasswordById(req.userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: "Password updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const registerBusiness = async (req, res) => {
  try {
    const {
      ownerName,
      businessName,
      businessType,
      email,
      password,
      phone,
      address,
    } = req.body;

    if (!ownerName || !businessName || !businessType || !email || !password) {
      return res.json({
        success: false,
        message: "Owner name, business name, type, email, and password are required",
      });
    }

    if (!["restaurant", "cafe"].includes(businessType)) {
      return res.json({
        success: false,
        message: "Business type must be restaurant or cafe",
      });
    }

    const exists = await findUserByEmail(email);
    if (exists) {
      return res.json({ success: false, message: "Business already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter strong password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await createUser({
      name: ownerName,
      email,
      password: hashedPassword,
      role: "business",
      businessName,
      businessType,
      phone,
      address,
    });

    const token = createToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        businessType: user.businessType,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const businessLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user || user.role !== "business") {
      return res.json({ success: false, message: "Business account not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const token = createToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        businessName: user.businessName,
        businessType: user.businessType,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "An error occurred" });
  }
};

//route for admin login
const adminLogin = async (req,res)=>{
    try {
        const { email, password } = req.body;
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            return res.json({
                success: false,
                message: "Admin login is not configured",
            });
        }

        if (email !== adminEmail || password !== adminPassword) {
            return res.json({
                success: false,
                message: "Invalid admin credentials",
            });
        }

        const token = createToken("admin", "admin");

        res.json({
            success: true,
            token,
            user: {
                id: "admin",
                name: "DAYate Admin",
                email: adminEmail,
                role: "admin",
            },
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "An error occurred" });
    }

}
export {
  loginUser,
  registerUser,
  registerBusiness,
  businessLogin,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
};
