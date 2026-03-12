'use server';

import dbConnect from '@/lib/db';
import Event, { EventType } from '@/models/Event';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/models/User';
import { revalidatePath } from 'next/cache';

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
  const posterUrl = formData.get('posterUrl') as string;
  const location = formData.get('location') as string;
  const driveFolderLink = formData.get('driveFolderLink') as string;
  const registrationLink = formData.get('registrationLink') as string;

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
    return { success: true, data: JSON.parse(JSON.stringify(newEvent)) };
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
