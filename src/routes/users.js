import express from "express";
import UserController from "../controllers/userController";
import validationRule from "../middleware/validationRule";
// import { check } from "express-validator";
import signupValidation from "../utils/validations/signupValidation";
import socialAuthRouter from "./socialAuth";
const userRouter = express.Router();

//user sign up
userRouter.post(
  "/signup",
  validationRule(signupValidation),
  UserController.signup
);

//user sign in
userRouter.post("/signin", UserController.signin);

//user sign out
userRouter.get("/signout", UserController.signout);

//social authentication routes
userRouter.use("/social", socialAuthRouter);

//export router
export default userRouter;
