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

// INDEX UNIQUE : Garantit qu'un versionLabel est unique par projet (seulement pour les rapports non supprimés)
ReportSchema.index(
  {
    projectId: 1,
    versionLabel: 1,
  },
  {
    unique: true,
    partialFilterExpression: { deletedAt: { $eq: null } },
    background: true,
    name: 'unique_version_per_project'
  }
);

export default model('Report', ReportSchema);
