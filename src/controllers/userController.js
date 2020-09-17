import User from "../models/users";
import CustomError from "../utils/customError";
// import errorHandler from "../utils/errorHandler";
import responseHandler from "../utils/responseHandler";
import { hashPassword, comparePassword } from "../utils/passwordUtils";
import sessionManagement from "../services/sessionManagement";

class UserController {
  /**
   * Sign Up
   */
  async signup(req, res, next) {
    const { firstName, lastName, password, email } = req.body;

    //hash password
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
    } catch (error) {
      next(new CustomError(400, "A password processing error occured"));
    }

    //save new user
    let newUser;
    try {
      newUser = new User({
        firstName: firstName,
        lastName: lastName,
        password: hashedPassword,
        emailAddress: email,
      });

      await newUser.save();
    } catch (error) {
      console.log(error.message);
      const errorType =
        error.code === 11000
          ? ": User account already exists"
          : `\n Error: ${error.message}`;

      next(
        new CustomError(
          400,
          `An error occured creating user account.  ${errorType}`
        )
      );
      return;
    }

    //return response on success
    responseHandler(
      res,
      201,
      {
        userId: newUser._id,
        fullname: `${newUser.firstName} ${newUser.lastName}`,
      },
      "New User account created successfully"
    );
  }

  /**
   * Sign In
   */
  async signin(req, res, next) {
    const { email, password } = req.body;

    //get user details
    const user = await User.findOne({ emailAddress: email });
    let isPasswordCorrect = await comparePassword(password, user.password);

    if (!user) {
      next(new CustomError(401, "User not found"));
      return;
    }

    if (!isPasswordCorrect) {
      next(new CustomError(400, "Incorrect Password"));
      return;
    }
    await sessionManagement.signin(req, res, user, next);
    await responseHandler(res, 200, { userId: user._id }, "Sign in Successful");
  }

  /**
   * Sign out
   */

  async signout(req, res) {
    await sessionManagement.signout(req);
    responseHandler(res, 200, {}, "Sign out successful");
  }
  /**
   * change Password
   */
  async changePassword(req, res, next) {
    const { userId, oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      next(new CustomError(404, "User not found"));
      return;
    }

    let isPasswordCorrect = await comparePassword(oldPassword, user.password);

    if (!isPasswordCorrect) {
      next(new CustomError(400, "Incorrect Old Password"));
      return;
    }

    let hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    await user.save();

    responseHandler(res, 200, {}, "Password changed successfully");
  }
}

export default new UserController();
