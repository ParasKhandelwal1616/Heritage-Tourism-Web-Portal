import React from 'react';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { UserRole } from '@/types/user';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UserDirectoryClient from './UserDirectoryClient';

async function getUsers() {
  await dbConnect();
  const users = await User.find({}).sort({ role: 1, name: 1 });
  return JSON.parse(JSON.stringify(users));
}

export default async function AdminUserPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.MANAGER)) {
    redirect('/');
  }

  const users = await getUsers();

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-saffron font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">
            Organization Control
          </span>
          <h2 className="font-serif text-5xl font-black text-charcoal leading-tight">
            User <span className="text-emerald italic">Directory</span>
          </h2>
        </div>
      </div>

      <UserDirectoryClient initialUsers={users} currentUserRole={session.user.role as any} />
    </div>
  );
}
