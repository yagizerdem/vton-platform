import { Schema } from "mongoose";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
});

UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
