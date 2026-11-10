//create acc and login the website
//route for user login

import validator from 'validator';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import sendEmail from "../../shared/utils/sendEmail.js";

import {
  findUserByEmail,
  findUserByEmailCaseInsensitive,
  findUserById,
  findUserWithPasswordById,
  createUser,
  updateUserById,
  createToken,
  replacePendingRegistration,
  findPendingRegistration,
  incrementPendingAttempts,
  consumePendingRegistration,
  deletePendingRegistration,
} from "./auth.service.js";

const VERIFICATION_CODE_LENGTH = 6;
const VERIFICATION_TTL_MS = 5 * 60 * 1000;
const MAX_VERIFICATION_ATTEMPTS = 5;
const VERIFICATION_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

const generateVerificationCode = () => {
  let code;

  do {
    code = Array.from(
      { length: VERIFICATION_CODE_LENGTH },
      () => VERIFICATION_ALPHABET[crypto.randomInt(VERIFICATION_ALPHABET.length)]
    ).join("");
  } while (!/[a-z]/.test(code) || !/[0-9]/.test(code));

  return code;
};

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
            const normalizedEmail = email?.trim().toLowerCase();

            if (!name?.trim() || !normalizedEmail || !password) {
                return res.json({success: false, message: "Name, email, and password are required"});
            }
            //checking user already exists or not 
            const exits = await findUserByEmailCaseInsensitive(normalizedEmail);
            if (exits){
                return res.json ({success: false, message: "User already exists"})
            }
        
            //validating the password and email and name
            if (!validator.isEmail(normalizedEmail)) {
                return res.json ({success: false, message: "Please enter a valid email"})}
            if (password.length < 8) {
                return res.json ({success: false, message: "Please enter strong password"})}

            // Store registration details temporarily until the email is verified.
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const verificationCode = generateVerificationCode();
            const codeHash = await bcrypt.hash(verificationCode, salt);
            const expiresAt = new Date(Date.now() + VERIFICATION_TTL_MS);

            const pendingRegistration = await replacePendingRegistration(normalizedEmail, {
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                codeHash,
                attempts: 0,
                expiresAt,
            });

            try {
                await sendEmail({
                    to: normalizedEmail,
                    subject: "Verify your DAYate email",
                    html: `
                      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
                        <h2 style="color: #f97316;">Verify your DAYate account</h2>
                        <p>Your verification code is:</p>
                        <p style="font-size: 30px; font-weight: 800; letter-spacing: 8px; color: #ea580c;">${verificationCode}</p>
                        <p>This code expires in 5 minutes. If you request another code, this one will stop working.</p>
                      </div>
                    `,
                });
            } catch (emailError) {
                await deletePendingRegistration(pendingRegistration._id, codeHash);
                console.error("Could not send registration verification email:", emailError.message);
                return res.json({success: false, message: "Could not send verification email. Please try again."});
            }

            res.json({
                success: true,
                requiresVerification: true,
                email: normalizedEmail,
                expiresInSeconds: VERIFICATION_TTL_MS / 1000,
                message: "Verification code sent",
            })
    }
        catch(error){
            console.log (error);
            res.json({success:false, message: error.message})
        }
}

const verifyRegistration = async (req, res) => {
    try {
        const normalizedEmail = req.body.email?.trim().toLowerCase();
        const code = req.body.code?.trim().toLowerCase();

        if (!normalizedEmail || !code) {
            return res.json({success: false, message: "Email and verification code are required"});
        }

        if (!/^[a-z0-9]{6}$/.test(code)) {
            return res.json({success: false, message: "Enter the 6-character verification code"});
        }

        const pending = await findPendingRegistration(normalizedEmail);

        if (!pending) {
            return res.json({success: false, code: "CODE_INVALID", message: "This code is invalid or expired. Request a new code."});
        }

        if (pending.expiresAt <= new Date()) {
            await deletePendingRegistration(pending._id);
            return res.json({success: false, code: "CODE_EXPIRED", message: "This code has expired. Request a new code."});
        }

        if (pending.attempts >= MAX_VERIFICATION_ATTEMPTS) {
            await deletePendingRegistration(pending._id);
            return res.json({success: false, code: "TOO_MANY_ATTEMPTS", message: "Too many incorrect attempts. Request a new code."});
        }

        // Reserve an attempt atomically before checking the code. This prevents
        // parallel requests from getting more than five guesses for one code.
        const attemptedPending = await incrementPendingAttempts(pending._id);
        if (!attemptedPending) {
            await deletePendingRegistration(pending._id);
            return res.json({success: false, code: "TOO_MANY_ATTEMPTS", attemptsRemaining: 0, message: "Too many incorrect attempts. Request a new code."});
        }

        const isMatch = await bcrypt.compare(code, attemptedPending.codeHash);

        if (!isMatch) {
            const attempts = attemptedPending.attempts;
            const attemptsRemaining = Math.max(0, MAX_VERIFICATION_ATTEMPTS - attempts);

            if (attemptsRemaining === 0) {
                await deletePendingRegistration(pending._id);
                return res.json({success: false, code: "TOO_MANY_ATTEMPTS", attemptsRemaining: 0, message: "Too many incorrect attempts. Request a new code."});
            }

            return res.json({success: false, code: "CODE_INCORRECT", attemptsRemaining, message: `Incorrect code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? "" : "s"} remaining.`});
        }

        const consumed = await consumePendingRegistration(attemptedPending._id, attemptedPending.codeHash);
        if (!consumed) {
            return res.json({success: false, code: "CODE_INVALID", message: "This code is no longer valid. Request a new code."});
        }

        const existingUser = await findUserByEmailCaseInsensitive(normalizedEmail);
        if (existingUser) {
            return res.json({success: false, message: "User already exists"});
        }

        const user = await createUser({
            name: consumed.name,
            email: consumed.email,
            password: consumed.password,
            role: "user",
        });
        const token = createToken(user._id, user.role);

        return res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.json({success: false, message: "User already exists"});
        }
        console.log(error);
        return res.json({success: false, message: "An error occurred"});
    }
};
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
  verifyRegistration,
  registerBusiness,
  businessLogin,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
};
