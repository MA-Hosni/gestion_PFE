import mongoose from "mongoose"

const taskHistorySchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  oldValue: { type: Object },
  newValue: { type: Object, required: true },
  modifiedAt: { type: Date, required: true, default: Date.now },
  fieldChanged: { type: String, required: true },
})

module.exports = mongoose.model("TaskHistory", taskHistorySchema)
