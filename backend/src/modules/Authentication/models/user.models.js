import mongoose from "mongoose";

const { Schema, model } = mongoose;

const RoleEnum = ["Student", "CompSupervisor", "UniSupervisor"];

const userSchema = new Schema({
  fullName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: RoleEnum, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  passwordResetToken: { type: String, default: null },
  passwordResetExpires: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null, index: true },
}, { timestamps: true });

userSchema.index({ role: 1, isActive: 1 });
userSchema.index({
  isActive: 1,
  deletedAt: 1
}, {
  partialFilterExpression: { 
    isActive: true,
    deletedAt: { $eq: null } 
  },
  background: true
});

export default model("User", userSchema);