import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ValidationSchema = new Schema({
    task_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'Task', 
        required: true 
    },

    status: { 
        type: String, 
        enum: ['valid', 'invalid'], 
        required: true 
    },

    validator_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'Student', 
        required: true 
    },

    meeting_type: { 
        type: String, 
        enum: ['reunion', 'hors_reunion'], 
        required: true 
    },

    meeting_reference: { 
        type: Schema.Types.ObjectId, 
        ref: 'Meeting',
        default: null 
    },

    comment: { type: String, trim: true },

    deletedAt: { type: Date, default: null, index: true }
}, { timestamps: true });

ValidationSchema.index(
    { validator_id: 1, deletedAt: 1 },
    {
        partialFilterExpression: { deletedAt: { $eq: null } },
        background: true
    }
);

export default model('Validation', ValidationSchema);
