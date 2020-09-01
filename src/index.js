import express from "express";
import cors from "cors";
import CustomError from "./utils/customError";
import errorHandler from "./utils/errorHandler";
import { userRouter } from "./routes";
import { connectDB } from "./db/database";

// create express app
const app = express();

//connect to DB
connectDB();

// set up CORS
app.use(cors());

// include middleware to enable json body parsing and nested objects
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//base route
app.get("/", (req, res) => {
  res.send("Hello");
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
