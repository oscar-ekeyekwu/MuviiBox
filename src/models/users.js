import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
  },
});

const Users = mongoose.model("Users", UserSchema);
export default Users;
