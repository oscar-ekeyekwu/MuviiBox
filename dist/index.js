"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _customError = _interopRequireDefault(require("./utils/customError"));

var _errorHandler = _interopRequireDefault(require("./utils/errorHandler"));

var _routes = require("./routes");

var _database = require("./db/database");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// create express app
const app = (0, _express.default)(); //connect to DB

(0, _database.connectDB)(); // set up CORS

app.use((0, _cors.default)()); // include middleware to enable json body parsing and nested objects

app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
})); //base route

app.get("/", (req, res) => {
  res.send("Hello");
}); // docuementation routes
// app.use("/api/docs", docRouter);
//user routes

app.use("/api/users", _routes.userRouter); // routes not found goes here

app.all("*", (req, res, next) => {
  const error = new _customError.default(404, "Oops! Resource not found");
  next(error);
}); // default error handler

app.use((err, req, res, next) => {
  (0, _errorHandler.default)(err, req, res, next);
});
var _default = app;
exports.default = _default;