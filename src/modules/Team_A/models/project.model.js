import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    teamMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    sprints: [{ type: Schema.Types.ObjectId, ref: 'Sprint' }],
    reports: [{ type: Schema.Types.ObjectId, ref: 'Report' }],
}, { timestamps: true });

export default model('Project', ProjectSchema);