import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProjectSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    team_members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comp_supervisor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    academic_supervisor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sprints: [{ type: Schema.Types.ObjectId, ref: 'Sprint' }],
    reports: [{ type: Schema.Types.ObjectId, ref: 'Report' }],
}, { timestamps: true });

export default model('Project', ProjectSchema);