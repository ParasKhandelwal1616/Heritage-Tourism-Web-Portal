import mongoose, { Schema, Document } from 'mongoose';

export interface IHeritageSite extends Document {
  name: string;
  description: string;
  position: [number, number]; // [lat, lng]
  image: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const HeritageSiteSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    position: { 
      type: [Number], 
      required: true,
      validate: {
        validator: function(v: number[]) {
          return v.length === 2;
        },
        message: 'Position must have exactly 2 numbers [lat, lng]'
      }
    },
    image: { type: String, required: true },
    category: { type: String, default: 'Cultural' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.HeritageSite || mongoose.model<IHeritageSite>('HeritageSite', HeritageSiteSchema);
