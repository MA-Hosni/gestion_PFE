import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProjectSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    contributors: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    sprints: [{ type: Schema.Types.ObjectId, ref: 'Sprint' }],
    reports: [{ type: Schema.Types.ObjectId, ref: 'Report' }],
    deletedAt: { type: Date, default: null, index: true },
}, { timestamps: true });

ProjectSchema.index({
    contributors: 1,
    deletedAt: 1
  }, {
    partialFilterExpression: { deletedAt: { $eq: null } },
    background: true
  });

export default model('Project', ProjectSchema);