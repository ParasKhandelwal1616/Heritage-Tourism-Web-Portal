import mongoose, { Schema, Document } from 'mongoose';
import { EventType } from '../types/event';

export interface IEventModel extends Document {
  title: string;
  description: string;
  date: Date;
  type: EventType;
  posterUrl: string;
  driveFolderLink?: string;
  registrationLink?: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    type: {
      type: String,
      enum: Object.values(EventType),
      default: 'UPCOMING',
    },
    posterUrl: { type: String, required: true },
    driveFolderLink: { type: String },
    registrationLink: { type: String },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IEventModel>('Event', EventSchema);
