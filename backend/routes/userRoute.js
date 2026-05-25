import express from 'express';

import {loginUser, registerUser, adminLogin} from '../controllers/userController.js';

//creates one user router
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

export default userRouter;
