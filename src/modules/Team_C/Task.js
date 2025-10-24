const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true, enum: ["ToDo", "InProgress", "Standby", "Done"] },
  priority: { type: String, enum: ["Low", "Medium", "High"] },
  user_story_id: { type: mongoose.Schema.Types.ObjectId, ref: "UserStory", required: true },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
