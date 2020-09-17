import { validationResult } from "express-validator";
import CustomError from "../utils/customError";

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return next(new CustomError(400, "Invalid Credentials", errors.array()));
  };
};

export default validate;
