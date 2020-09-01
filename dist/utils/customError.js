"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InternalServerError = exports.default = void 0;

class CustomError extends Error {
  constructor(statusCode, message, errors) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
  }

}

exports.default = CustomError;

class InternalServerError extends CustomError {
  constructor(error) {
    console.log(error);
    super(500, "Something went wrong, please try again later.");
  }

}

exports.InternalServerError = InternalServerError;