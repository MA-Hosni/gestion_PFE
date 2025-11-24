import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const MeetingSchema = new Schema({
    scheduledDate: { type: Date, required: true },
    agenda: { type: String, trim: true },
    actualMinutes: { type: String, trim: true },

    referenceType: { 
        type: String, 
        enum: ['user_story', 'task', 'report'], 
        required: true 
    },

    referenceId: { 
        type: Schema.Types.ObjectId, 
        required: true 
    },

    createdBy: { 
        type: Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    },

    validationStatus: { 
        type: String, 
        enum: ['pending', 'valid', 'invalid'], 
        default: 'pending' 
    },

    deletedAt: {
        type: Date, 
        default: null, 
        index: true }
    }, { timestamps: true });

MeetingSchema.index(
    { createdBy: 1, deletedAt: 1 },
    {
        partialFilterExpression: { deletedAt: { $eq: null } },
        background: true
    }
);

export default model('Meeting', MeetingSchema);