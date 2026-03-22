import mongoose, { Schema, Document } from 'mongoose';

export interface IPoll extends Document {
  question: string;
  options: {
    text: string;
    votes: mongoose.Types.ObjectId[];
  }[];
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  room: string;
}

const PollSchema: Schema = new Schema(
  {
    question: { type: String, required: true },
    options: [
      {
        text: { type: String, required: true },
        votes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      },
    ],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    room: { type: String, default: 'staff' }, // 'staff' or 'student'
  },
  { timestamps: true }
);

export default mongoose.model<IPoll>('Poll', PollSchema);
