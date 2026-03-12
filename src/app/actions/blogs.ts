'use server';

import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/user';
import { revalidatePath } from 'next/cache';

export async function createBlog(formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role === UserRole.STUDENT)) {
    throw new Error('Not authorized to publish blogs');
  }

  await dbConnect();

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const coverImage = formData.get('coverImage') as string;
  const rawTags = formData.get('tags') as string;
  
  const tags = rawTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

  try {
    const newBlog = await Blog.create({
      title,
      content,
      coverImage,
      tags,
      author: session.user.id,
    });

    revalidatePath('/dashboard/blogs');
    revalidatePath('/blogs');
    return { success: true, data: JSON.parse(JSON.stringify(newBlog)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateBlog(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role === UserRole.STUDENT)) {
    throw new Error('Not authorized');
  }

  await dbConnect();

  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const coverImage = formData.get('coverImage') as string;
  const rawTags = formData.get('tags') as string;
  const tags = rawTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

  try {
    const blog = await Blog.findById(id);
    if (!blog) throw new Error('Blog not found');

    if (session.user.role === UserRole.MEMBER && blog.author.toString() !== session.user.id) {
      throw new Error('Not authorized to edit this blog');
    }

    await Blog.findByIdAndUpdate(id, {
      title,
      content,
      coverImage,
      tags
    });

    revalidatePath('/dashboard/blogs');
    revalidatePath('/blogs');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBlog(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role === UserRole.STUDENT)) {
    throw new Error('Not authorized');
  }

  await dbConnect();
  
  // Only Admins/Managers can delete any blog. Members can only delete their own.
  const blog = await Blog.findById(id);
  if (!blog) throw new Error('Blog not found');

  if (session.user.role === UserRole.MEMBER && blog.author.toString() !== session.user.id) {
    throw new Error('You can only delete your own blogs');
  }

  await Blog.findByIdAndDelete(id);
  revalidatePath('/dashboard/blogs');
  revalidatePath('/blogs');
  return { success: true };
}
