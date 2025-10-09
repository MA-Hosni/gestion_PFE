import mongoose from "mongoose";

const { Schema, model } = mongoose;

const RoleEnum = ["Student", "Enc_Company", "Enc_University"];

const userSchema = new Schema({
  full_name: { type: String, required: true },
  phone_number: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: RoleEnum, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export default model("User", userSchema);