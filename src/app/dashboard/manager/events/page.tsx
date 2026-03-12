import React from 'react';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/types/user';
import { redirect } from 'next/navigation';
import EventsClient from './EventsClient';

async function getEvents() {
  await dbConnect();
  const events = await Event.find({}).sort({ date: -1 });
  return JSON.parse(JSON.stringify(events));
}

export default async function ManagerEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.MANAGER)) {
    redirect('/');
  }

  const events = await getEvents();

  return <EventsClient initialEvents={events} />;
}
