import { Schema } from "mongoose";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { required } from "zod/mini";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  fashnApiKey: {
    encryptedText: { type: String, required: false },
    iv: { type: String, required: false },
    authTag: { type: String, required: false },
  },
});

UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
