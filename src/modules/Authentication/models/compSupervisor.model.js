import mongoose from "mongoose";
const { Schema, model } = mongoose;

const compSupervisorSchema = new Schema({
  companyName: { type: String, required: true, trim: true },
  badgeIMG: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  studentsId: [{ type: Schema.Types.ObjectId, ref: "Student" }]
}, { timestamps: true });

compSupervisorSchema.index({ userId: 1 });
compSupervisorSchema.index({ companyName: 1 });
export default model("CompSupervisor", compSupervisorSchema);