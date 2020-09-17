import { check } from "express-validator";

const signupValidation = [
  check("firstName").not().isEmpty().withMessage("First name is required"),
  check("lastName").not().isEmpty().withMessage("Last name is required"),
  check("email", "Email is required").isEmail().normalizeEmail(),
  check("password", "Password is requried")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/\d/)
    .withMessage("must contain a number")
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error("Passwords don't match");
      } else {
        return val;
      }
    }),
];

export default signupValidation;
