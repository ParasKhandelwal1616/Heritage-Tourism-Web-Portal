'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import { UserRole } from '@/types/user';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

export async function createUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== UserRole.ADMIN) {
    throw new Error('Only Admins can create users');
  }

  await dbConnect();

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as UserRole;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, error: 'User with this email already exists' };
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || UserRole.STUDENT
    });

    revalidatePath('/dashboard/admin/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(userId: string, newRole: UserRole) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== UserRole.ADMIN) {
    throw new Error('Only Admins can change user roles');
  }

  await dbConnect();

  try {
    await User.findByIdAndUpdate(userId, { role: newRole });
    revalidatePath('/dashboard/admin/users');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllUsers() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== UserRole.ADMIN) {
    throw new Error('Not authorized');
  }

  await dbConnect();
  const users = await User.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(users));
}

export async function deleteUser(userId: string) {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== UserRole.ADMIN) {
      throw new Error('Only Admins can delete users');
    }
  
    await dbConnect();
  
    try {
      await User.findByIdAndDelete(userId);
      revalidatePath('/dashboard/admin/users');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
