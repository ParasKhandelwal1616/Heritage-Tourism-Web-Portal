import mongoose, { Schema, Document } from 'mongoose';

export interface IGlobalSettings extends Document {
  clubName: string;
  logoUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  clubDescription: string;
  githubUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  heroVideoUrl?: string;
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const GlobalSettingsSchema: Schema = new Schema(
  {
    clubName: { type: String, default: 'Heritage & Tourism Club' },
    logoUrl: { type: String, default: '/logo.jpeg' },
    contactEmail: { type: String, default: 'hello@heritagetours.club' },
    contactPhone: { type: String, default: '+1 (555) 000-HERITAGE' },
    contactAddress: { type: String, default: '123 History Lane, Cultural Hub, NY 10001' },
    clubDescription: { type: String, default: 'Preserving history, exploring culture, and connecting travelers with the stories that shaped our world. Join us in our mission.' },
    githubUrl: { type: String },
    linkedinUrl: { type: String },
    instagramUrl: { type: String },
    twitterUrl: { type: String },
    facebookUrl: { type: String },
    heroVideoUrl: { type: String, default: '/15161691_3840_2160_30fps.mp4' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.GlobalSettings || mongoose.model<IGlobalSettings>('GlobalSettings', GlobalSettingsSchema);
