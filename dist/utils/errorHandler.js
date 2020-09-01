"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const errorHandler = (err, req, res) => {
  if (err.statusCode) {
    res.status(err.statusCode).json({
      status: "error",
      error: err.message,
      errors: err.errors
    });
  } else if (err.status) {
    res.status(err.status).json({
      status: "error",
      error: err.message,
      errors: err.errors
    });
  } else {
    res.status(500).json({
      status: "error",
      error: "Internal server error"
    }); // console.log(err.message);
  }
};

var _default = errorHandler;
exports.default = _default;