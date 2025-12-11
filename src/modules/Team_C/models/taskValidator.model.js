import mongoose from "mongoose";

const taskValidatorSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  taskStatus: {
    type: String,
    enum: ["ToDo", "InProgress", "Standby", "Done"],
    required: true,
  },
  validatorStatus: {
    type: String,
    enum: ["valid", "invalid", "in progress"],
    default: "in progress",
    required: true,
  },
  validatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  meetingType: {
    type: String,
    enum: ["reunion", "hors reunion"],
    required: true,
  },
  meetingReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Meeting",
  },
  comment: {
    type: String,
  },
}, { timestamps: true });

const TaskValidator = mongoose.model("TaskValidator", taskValidatorSchema);

export default TaskValidator;
