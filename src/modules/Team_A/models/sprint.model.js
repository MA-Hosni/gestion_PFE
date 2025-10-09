import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const SprintSchema = new Schema({
    title: { type: String, required: true },
    goal: { type: String, require: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    order_index: { type: Number, required: true },
    user_stories: [{ type: Schema.Types.ObjectId, ref: 'UserStory' }],
}, { timestamps: true });

export default model('Sprint', SprintSchema);