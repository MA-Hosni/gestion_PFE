import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const SprintSchema = new Schema({
    title: { type: String, required: true },
    goal: { type: String, require: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    orderIndex: { type: Number, required: true },
    userStories: [{ type: Schema.Types.ObjectId, ref: 'UserStory' }],
}, { timestamps: true });

export default model('Sprint', SprintSchema);