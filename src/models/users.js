import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
    },
    auth: {
      provider: String,
      profileImageUrl: String,
    },
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", UserSchema);
export default Users;
