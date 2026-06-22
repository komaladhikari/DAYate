import express from 'express';
import authUser from "../../shared/middleware/authUser.js";

import {
  loginUser,
  registerUser,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
} from "./auth.controller.js";

//creates one user router
const userRouter = express.Router();

userRouter.get("/profile", authUser, getUserProfile);
userRouter.put("/profile", authUser, updateUserProfile);
userRouter.put("/profile/password", authUser, updateUserPassword);

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

export default userRouter;
