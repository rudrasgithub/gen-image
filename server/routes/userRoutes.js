import { Router } from "express";
import { loginUser, paymentRazorpay, registerUser, userCredits, verifyRazorpay } from "../controllers/userController.js";
import userAuth from '../middlewares/auth.js';

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser)
userRouter.get('/credit', userAuth, userCredits)
userRouter.post('/pay-razor', userAuth, paymentRazorpay)
userRouter.post('/verify-razor', userAuth, verifyRazorpay)

export default userRouter;