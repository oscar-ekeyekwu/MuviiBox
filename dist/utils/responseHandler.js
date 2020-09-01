"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = (res, status, data) => {
  res.status(status).json({
    data,
    status: "success"
  });
};

exports.default = _default;