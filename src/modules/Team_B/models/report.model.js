import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ReportSchema = new Schema(
  {
    versionLabel: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
      required: true,
      trim: true,
    },
    filePath: {
      type: String,
      required: true,
      trim: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    deletedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

ReportSchema.index(
  {
    versionLabel: 1,
    deletedAt: 1,
  },
  {
    partialFilterExpression: { deletedAt: { $eq: null } },
    background: true,
  }
);

export default model('Report', ReportSchema);
