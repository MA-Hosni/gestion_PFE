import mongoose from "mongoose";
const { Schema, model } = mongoose;

const encCompanySchema = new Schema({
  company_name: { type: String, required: true },
  badge_img: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }]
}, { timestamps: true });

export default model("EncCompany", encCompanySchema);