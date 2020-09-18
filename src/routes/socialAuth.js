import express from "express";
import socialAuthController from "../controllers/socialAuthController";

const socialAuthRouter = express.Router();

/**
 * Authenticate with Google
 */
socialAuthRouter.get("/google", socialAuthController.googleAuthController);
socialAuthRouter.get(
  "/google/callback",
  socialAuthController.googleAuthCallbackController
);

export default socialAuthRouter;
