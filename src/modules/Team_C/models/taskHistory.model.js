const mongoose = require("mongoose")

const taskHistorySchema = new mongoose.Schema({
  task_id: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  modified_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  old_value: { type: Object },
  new_value: { type: Object, required: true },
  modified_at: { type: Date, required: true, default: Date.now },
  field_changed: { type: String, required: true },
})

module.exports = mongoose.model("TaskHistory", taskHistorySchema)
