import mongoose from "mongoose";
const { Schema, model } = mongoose;

const encUniversitySchema = new Schema({
  badge_img: { type: String, required: true },
  admin: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  projects: [{ type: Schema.Types.ObjectId, ref: "Project" }]
}, { timestamps: true });

export default model("EncUniversity", encUniversitySchema);