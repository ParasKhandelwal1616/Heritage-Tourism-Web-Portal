'use server';

import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { EventType } from '@/types/event';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/user';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

async function uploadPoster(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-poster-${file.name.replace(/\s+/g, '-')}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads/posters');
  
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (err) {}

  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);
  return `/uploads/posters/${filename}`;
}

export async function createEvent(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  // Auth Check
  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.MANAGER)) {
    throw new Error('Not authorized');
  }

  await dbConnect();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const date = new Date(formData.get('date') as string);
  const type = formData.get('type') as EventType;
  const location = formData.get('location') as string;
  const driveFolderLink = formData.get('driveFolderLink') as string;
  const registrationLink = formData.get('registrationLink') as string;
  
  let posterUrl = formData.get('posterUrl') as string;
  const posterFile = formData.get('posterFile') as File;

  if (posterFile && posterFile.size > 0) {
    posterUrl = await uploadPoster(posterFile);
  }

  try {
    const newEvent = await Event.create({
      title,
      description,
      date,
      type,
      posterUrl,
      location,
      driveFolderLink: type === EventType.PAST ? driveFolderLink : undefined,
      registrationLink: type === EventType.UPCOMING ? registrationLink : undefined,
    });

    revalidatePath('/dashboard/manager/events');
    revalidatePath('/events');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateEvent(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.MANAGER)) {
    throw new Error('Not authorized');
  }

  await dbConnect();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const date = new Date(formData.get('date') as string);
  const type = formData.get('type') as EventType;
  const location = formData.get('location') as string;
  const driveFolderLink = formData.get('driveFolderLink') as string;
  const registrationLink = formData.get('registrationLink') as string;
  
  let posterUrl = formData.get('posterUrl') as string;
  const posterFile = formData.get('posterFile') as File;

  if (posterFile && posterFile.size > 0) {
    posterUrl = await uploadPoster(posterFile);
  }

  try {
    await Event.findByIdAndUpdate(id, {
      title,
      description,
      date,
      type,
      posterUrl,
      location,
      driveFolderLink: type === EventType.PAST ? driveFolderLink : undefined,
      registrationLink: type === EventType.UPCOMING ? registrationLink : undefined,
    });

    revalidatePath('/dashboard/manager/events');
    revalidatePath('/events');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteEvent(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.MANAGER)) {
    throw new Error('Not authorized');
  }

  await dbConnect();
  await Event.findByIdAndDelete(id);
  revalidatePath('/dashboard/manager/events');
  return { success: true };
}
