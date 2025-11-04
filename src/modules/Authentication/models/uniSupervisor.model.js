import mongoose from "mongoose";
const { Schema, model } = mongoose;

const uniSupervisorSchema = new Schema({
  badgeIMG: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  studentsId: [{ type: Schema.Types.ObjectId, ref: "Student" }]
}, { timestamps: true });

export default model("UniSupervisor", uniSupervisorSchema);