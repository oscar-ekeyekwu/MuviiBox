import express from "express";
import socialAuthController from "../controllers/socialAuthController";

const socailAuthRouter = express.Router();

/**
 * Authenticate with Google
 */
socailAuthRouter.get("/google");

export default socailAuthRouter;
