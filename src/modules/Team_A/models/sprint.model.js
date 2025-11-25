import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const SprintSchema = new Schema({
    title: { type: String, required: true, trim: true },
    goal: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    orderIndex: { type: Number, required: true, min: 1 },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    userStories: [{ type: Schema.Types.ObjectId, ref: 'UserStory' }],
    deletedAt: { type: Date, default: null, index: true },
}, { timestamps: true });

SprintSchema.index({
    projectId: 1,
    orderIndex: 1,
    deletedAt: 1
  }, {
    partialFilterExpression: { deletedAt: { $eq: null } },
    background: true
  });

const Sprint = mongoose.models.Sprint || mongoose.model('Sprint', SprintSchema);
export default Sprint;