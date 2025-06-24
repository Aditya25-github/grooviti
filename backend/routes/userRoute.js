import express from "express"
import { loginUser, registerUser, forgotPassword, resetPassword, googleLogin } from "../controllers/usercontroller.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.post("/google-login", googleLogin);


export default userRouter;