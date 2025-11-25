import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const UserStorySchema = new Schema({
    storyName: { type: String, required: true, trim: true },

    description: { type: String, trim: true },

    priority: {
        type: String,
        required: true,
        enum: ['highest', 'high', 'medium', 'low', 'lowest'],
        default: 'medium'
    },

    storyPointEstimate: {
        type: Number,
        required: true,
        min: 0
    },

    startDate: { type: Date, required: true },

    dueDate: { type: Date, required: true },

    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],

    sprintId: { type: Schema.Types.ObjectId, ref: 'Sprint', required: true },

    deletedAt: { type: Date, default: null, index: true }
}, { timestamps: true });


// Index pour améliorer les recherches
UserStorySchema.index(
    { priority: 1, deletedAt: 1 },
    {
        partialFilterExpression: { deletedAt: { $eq: null } },
        background: true
    }
);


const UserStory = mongoose.models.UserStory || mongoose.model('UserStory', UserStorySchema);

export default UserStory;