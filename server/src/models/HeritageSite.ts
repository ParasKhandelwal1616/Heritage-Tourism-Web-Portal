import mongoose, { Schema, Document } from 'mongoose';
import { SiteType, SiteScale, SiteStatus, IHeritageSite as IHeritageSiteBase } from '../types/heritage';

export interface IHeritageSite extends Document, Omit<IHeritageSiteBase, '_id'> {}

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
    type: { 
      type: String, 
      enum: Object.values(SiteType), 
      default: 'OTHER' 
    },
    scale: { 
      type: String, 
      enum: Object.values(SiteScale), 
      default: 'MINOR' 
    },
    status: { 
      type: String, 
      enum: Object.values(SiteStatus), 
      default: 'APPROVED' 
    },
    suggestedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IHeritageSite>('HeritageSite', HeritageSiteSchema);
export { SiteType, SiteScale, SiteStatus };
