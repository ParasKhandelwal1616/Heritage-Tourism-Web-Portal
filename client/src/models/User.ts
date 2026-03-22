import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '@/types/user';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STUDENT,
    },
  },
  {
    timestamps: true,
  }
);

// Check if model already exists to avoid recompilation in development
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
