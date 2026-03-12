'use server';

import dbConnect from '@/lib/db';
import SiteConfig from '@/models/SiteConfig';
import HeritageSite from '@/models/HeritageSite';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/user';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function updateHeroVideo(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.MANAGER)) {
    throw new Error('Not authorized to update site settings');
  }

  const file = formData.get('video') as File;
  if (!file) {
    throw new Error('No video file provided');
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate a safe filename
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  
  // Ensure the directory exists
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (err) {}

  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  const videoUrl = `/uploads/${filename}`;

  await dbConnect();

  try {
    const config = await SiteConfig.findOneAndUpdate(
      { key: 'heroVideo' },
      { 
        value: videoUrl,
        updatedBy: session.user.id
      },
      { upsert: true, new: true }
    );

    revalidatePath('/');
    return { success: true, data: JSON.parse(JSON.stringify(config)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getHeroVideo() {
  await dbConnect();
  try {
    const config = await SiteConfig.findOne({ key: 'heroVideo' });
    return config ? config.value : '/15161691_3840_2160_30fps.mp4';
  } catch (error) {
    return '/15161691_3840_2160_30fps.min.mp4'; // Fallback to a placeholder
  }
}

// Heritage Site Actions
export async function createHeritageSite(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.MANAGER)) {
    throw new Error('Not authorized');
  }

  await dbConnect();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const lat = parseFloat(formData.get('lat') as string);
  const lng = parseFloat(formData.get('lng') as string);
  const image = formData.get('image') as string;
  const category = formData.get('category') as string;

  try {
    const site = await HeritageSite.create({
      name,
      description,
      position: [lat, lng],
      image,
      category
    });

    revalidatePath('/heritage-map');
    revalidatePath('/dashboard/manager/heritage');
    return { success: true, data: JSON.parse(JSON.stringify(site)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateHeritageSite(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.MANAGER)) {
    throw new Error('Not authorized');
  }

  await dbConnect();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const lat = parseFloat(formData.get('lat') as string);
  const lng = parseFloat(formData.get('lng') as string);
  const image = formData.get('image') as string;
  const category = formData.get('category') as string;

  try {
    await HeritageSite.findByIdAndUpdate(id, {
      name,
      description,
      position: [lat, lng],
      image,
      category
    });

    revalidatePath('/heritage-map');
    revalidatePath('/dashboard/manager/heritage');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteHeritageSite(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.MANAGER)) {
    throw new Error('Not authorized');
  }

  await dbConnect();
  await HeritageSite.findByIdAndDelete(id);
  revalidatePath('/heritage-map');
  revalidatePath('/dashboard/manager/heritage');
  return { success: true };
}

export async function getAllHeritageSites() {
  await dbConnect();
  const sites = await HeritageSite.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(sites));
}
