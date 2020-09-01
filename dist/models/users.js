"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose.default.Schema;
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true
  }
});

const Users = _mongoose.default.model("Users", UserSchema);

var _default = Users;
exports.default = _default;