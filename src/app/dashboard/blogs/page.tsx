import React from 'react';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/user';
import { redirect } from 'next/navigation';
import BlogsClient from './BlogsClient';

async function getBlogs() {
  await dbConnect();
  const blogs = await Blog.find({}).populate('author', 'name _id').sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(blogs));
}

export default async function ManagerBlogsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role === UserRole.STUDENT) {
    redirect('/');
  }

  const blogs = await getBlogs();

  return <BlogsClient initialBlogs={blogs} />;
}
