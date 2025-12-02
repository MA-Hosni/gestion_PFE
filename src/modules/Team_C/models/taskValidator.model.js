import mongoose from "mongoose";

const taskValidatorSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  task_status: {
    type: String,
    enum: ["ToDo", "InProgress", "Standby", "Done"],
    required: true,
  },
  validator_status: {
    type: String,
    enum: ["valid", "invalid", "in progress"],
    default:"in progress",
    required: true,
  },
  validator_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  meeting_type: {
    type: String,
    enum: ["reunion", "hors reunion"],
    required: true,
  },
  meeting_reference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meeting",
  },
  comment: {
    type: String,
  },
}, { timestamps: true });

const TaskValidator = mongoose.model("TaskValidator", taskValidatorSchema);

export default TaskValidator;
