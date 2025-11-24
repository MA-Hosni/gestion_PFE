import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UserStorySchema = new Schema({
    story_name: { type: String, required: true, trim: true },

    description: { type: String, trim: true },

    priority: {
        type: String,
        required: true,
        enum: ['highest', 'high', 'medium', 'low', 'lowest'], // enum
        default: 'medium'
    },

    story_point_estimate: {
        type: Number,
        required: true,
        min: 0
    },

    start_date: { type: Date, required: true },

    due_date: { type: Date, required: true },

    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],

    deletedAt: { type: Date, default: null, index: true }
}, { timestamps: true });


// Index pour améliorer les recherches par priorité et status (soft delete)
UserStorySchema.index(
    { priority: 1, deletedAt: 1 },
    {
        partialFilterExpression: { deletedAt: { $eq: null } },
        background: true
    }
);

export default model('UserStory', UserStorySchema);
