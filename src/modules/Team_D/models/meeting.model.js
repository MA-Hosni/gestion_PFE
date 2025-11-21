import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const MeetingSchema = new Schema({
    scheduled_date: { type: Date, required: true },
    agenda: { type: String, trim: true },
    actual_minutes: { type: String, trim: true },

    reference_type: { 
        type: String, 
        enum: ['user_story', 'task', 'report'], 
        required: true 
    },

    reference_id: { 
        type: Schema.Types.ObjectId, 
        required: true 
    },

    created_by: { 
        type: Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    },

    validation_status: { 
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
    { created_by: 1, deletedAt: 1 },
    {
        partialFilterExpression: { deletedAt: { $eq: null } },
        background: true
    }
);

export default model('Meeting', MeetingSchema);
