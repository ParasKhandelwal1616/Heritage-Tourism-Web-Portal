'use server';

import dbConnect from '@/lib/db';
import User from '@/models/User';
import { UserRole } from '@/types/user';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email.endsWith('@mitsgwl.ac.in')) {
    return { success: false, error: 'Only MITS Collage email IDs (@mitsgwl.ac.in) are allowed.' };
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long.' };
  }

  try {
    await dbConnect();
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { success: false, error: 'User already exists with this email.' };
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Assign ADMIN role if it's the specified admin email, otherwise STUDENT
    const assignedRole = email === '23cd10pa41@mitsgwl.ac.in' ? UserRole.ADMIN : UserRole.STUDENT;

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function manageUserRole(targetEmail: string, newRole: UserRole) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authorized');

  const actorRole = session.user.role;

  // RBAC Validation: 
  // Admin can assign any role. 
  // Manager can only assign MEMBER or STUDENT.
  if (actorRole === UserRole.MANAGER && (newRole === UserRole.ADMIN || newRole === UserRole.MANAGER)) {
    throw new Error('Managers can only assign Member or Student roles.');
  }
  
  if (actorRole !== UserRole.ADMIN && actorRole !== UserRole.MANAGER) {
    throw new Error('Unauthorized role management.');
  }

  await dbConnect();
  const user = await User.findOneAndUpdate({ email: targetEmail }, { role: newRole }, { new: true });
  
  if (!user) return { success: false, error: 'User not found.' };
  
  revalidatePath('/dashboard/admin/users');
  return { success: true, user: JSON.parse(JSON.stringify(user)) };
}

export async function createManagedUser(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.MANAGER)) {
    throw new Error('Unauthorized');
  }

  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as UserRole;

  if (!email.endsWith('@mitsgwl.ac.in')) {
    return { success: false, error: 'Only MITS emails allowed.' };
  }

  // Manager cannot create Admins or Managers
  if (session.user.role === UserRole.MANAGER && role !== UserRole.MEMBER) {
     return { success: false, error: 'Managers can only create Members.' };
  }

  try {
    await dbConnect();
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role,
    });

    revalidatePath('/dashboard/admin/users');
    return { success: true, user: JSON.parse(JSON.stringify(newUser)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error('Not authenticated');

  const newPassword = formData.get('newPassword') as string;
  if (newPassword.length < 6) return { success: false, error: 'Password too short.' };

  await dbConnect();
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await User.findByIdAndUpdate(session.user.id, { password: hashedPassword });

  return { success: true };
}
