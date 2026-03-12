import React from 'react';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@/models/User';
import { redirect } from 'next/navigation';
import { Plus, Trash2, ExternalLink, Calendar as CalendarIcon, MapPin, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { deleteEvent } from '@/app/actions/events';

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

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-saffron font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">
            Content Management
          </span>
          <h2 className="font-serif text-5xl font-black text-charcoal leading-tight">
            Manage <span className="text-emerald italic">Events</span>
          </h2>
        </div>
        <button className="flex items-center space-x-3 bg-saffron text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald transition-all shadow-xl shadow-saffron/20 active:scale-95 group">
          <Plus size={20} />
          <span>New Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {events.map((event: any) => (
          <div key={event._id} className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-charcoal/5 border border-black/5 flex flex-col lg:flex-row lg:items-center gap-10 group hover:shadow-saffron/5 transition-all relative overflow-hidden">
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -translate-y-1/2 translate-x-1/2 transition-all duration-700 opacity-20 ${
              event.type === 'UPCOMING' ? 'bg-emerald' : 'bg-saffron'
            }`} />

            {/* Poster Thumbnail */}
            <div className="w-full lg:w-48 aspect-video lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-charcoal/20 shrink-0">
              <img src={event.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Content Details */}
            <div className="flex-grow space-y-4">
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  event.type === 'UPCOMING' 
                    ? 'bg-emerald/5 border-emerald/20 text-emerald' 
                    : 'bg-ash border-black/10 text-charcoal/40'
                }`}>
                  {event.type}
                </span>
                <div className="flex items-center space-x-2 text-charcoal/30 text-[10px] font-black uppercase tracking-widest">
                  <CalendarIcon size={12} />
                  <span>{format(new Date(event.date), 'MMMM dd, yyyy')}</span>
                </div>
              </div>

              <h3 className="font-serif text-3xl font-black text-charcoal">{event.title}</h3>
              
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2 text-charcoal/60 text-sm font-bold">
                  <MapPin size={16} className="text-saffron" />
                  <span>{event.location}</span>
                </div>
                {event.registrationLink && (
                  <a href={event.registrationLink} target="_blank" className="flex items-center space-x-2 text-emerald hover:underline text-sm font-bold">
                    <ExternalLink size={16} />
                    <span>Registration Link</span>
                  </a>
                )}
                {event.driveFolderLink && (
                  <a href={event.driveFolderLink} target="_blank" className="flex items-center space-x-2 text-saffron hover:underline text-sm font-bold">
                    <Globe size={16} />
                    <span>Drive Folder</span>
                  </a>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 shrink-0">
              <button className="p-4 bg-ash hover:bg-white hover:shadow-xl hover:shadow-charcoal/5 rounded-2xl text-charcoal/40 hover:text-charcoal transition-all">
                <Plus size={20} />
              </button>
              <form action={async () => {
                'use server';
                await deleteEvent(event._id, new FormData());
              }}>
                <button className="p-4 bg-red-50 hover:bg-red-500 hover:text-white rounded-2xl text-red-500 transition-all shadow-sm">
                  <Trash2 size={20} />
                </button>
              </form>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-32 bg-white/40 border-4 border-dashed border-black/5 rounded-[3rem]">
            <CalendarIcon className="mx-auto h-16 w-16 text-charcoal/10 mb-6" />
            <p className="font-serif text-2xl font-black text-charcoal/40">No events found in the database</p>
            <p className="text-charcoal/30 text-sm font-bold mt-2">Start by creating your first heritage event!</p>
          </div>
        )}
      </div>
    </div>
  );
}
