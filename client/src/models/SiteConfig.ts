import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteConfig extends Document {
  key: string;
  value: string;
  updatedBy: mongoose.Types.ObjectId;
}

const SiteConfigSchema: Schema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SiteConfig || mongoose.model<ISiteConfig>('SiteConfig', SiteConfigSchema);
