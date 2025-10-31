import mongoose from "mongoose"

const { Schema, model } = mongoose

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["ToDo", "InProgress", "Standby", "Done"],
    required: true
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  user_story_id: { type: Schema.Types.ObjectId, ref: "UserStory", required: true },
  assigned_to: { type: Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true })

taskSchema.index({ title: 1, user_story_id: 1 }, { unique: true })

export default model("Task", taskSchema)
