import express from 'express';
import authUser from "../shared/middleware/authUser.js";

import {
  loginUser,
  registerUser,
  adminLogin,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

//creates one user router
const userRouter = express.Router();

userRouter.get("/profile", authUser, getUserProfile);
userRouter.put("/profile", authUser, updateUserProfile);

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

export default userRouter;
