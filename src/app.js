import express from "express";
import layout from "express-layout";
import path from "path";
import cors from "cors";
import CustomError from "./utils/customError";
import errorHandler from "./utils/errorHandler";
import { userRouter } from "./routes";
import { connectDB } from "./db/database";
import sessionManagement from "./services/sessionManagement";

// create express app
const app = express();

//connect to DB
connectDB();

//middlewares
const middleware = [
  cors(),
  layout(),
  express.static(path.join(__dirname, "public")),
  express.json(),
  express.urlencoded({ extended: true }),
];

// set up include middleware
app.use(middleware);

// configure user session
sessionManagement.config(app);

//set views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//base route
app.get("/", (req, res) => {
  res.send(req.originalUrl);
});

//welcome callback route
app.get("/welcome", (req, res) => {
  res.send({ message: "Authenticated" });
});
// docuementation routes
// app.use("/api/docs", docRouter);

//user routes
app.use("/api/users", userRouter);

// routes not found goes here
app.all("*", (req, res, next) => {
  const error = new CustomError(404, "Oops! Resource not found");
  next(error);
});

// default error handler
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

export default app;
