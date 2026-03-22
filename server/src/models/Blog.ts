import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string; // Supports Markdown
  author: mongoose.Types.ObjectId;
  coverImage: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coverImage: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>('Blog', BlogSchema);
