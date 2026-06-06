import { Schema } from "mongoose";
import mongoose from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
