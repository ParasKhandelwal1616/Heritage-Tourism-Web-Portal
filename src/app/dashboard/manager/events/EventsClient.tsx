'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ExternalLink, Calendar as CalendarIcon, MapPin, Globe, X, Send, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { createEvent, deleteEvent, updateEvent } from '@/app/actions/events';
import { EventType } from '@/types/event';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function EventsClient({ initialEvents }: { initialEvents: any[] }) {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [eventType, setEventType] = useState<EventType>(EventType.UPCOMING);

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    redirect('/');
  }

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setEventType(event.type as EventType);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEvent(null);
    setEventType(EventType.UPCOMING);
  };

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
        <button 
          onClick={() => showForm ? handleCancel() : setShowForm(true)}
          className="flex items-center space-x-3 bg-saffron text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald transition-all shadow-xl shadow-saffron/20 active:scale-95 group"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          <span>{showForm ? 'Cancel' : 'New Event'}</span>
        </button>
      </div>

      {/* New/Edit Event Form */}
      {showForm && (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-charcoal/5 border-4 border-saffron/10 animate-in fade-in slide-in-from-top-4 duration-500">
          <form action={async (formData) => {
            if (editingEvent) {
              await updateEvent(editingEvent._id, formData);
            } else {
              await createEvent(formData);
            }
            handleCancel();
          }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-black text-charcoal/40 uppercase tracking-widest block">Event Title</label>
              <input 
                name="title" 
                defaultValue={editingEvent?.title}
                required 
                className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold" 
                placeholder="Cultural Heritage Summit 2026" 
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-charcoal/40 uppercase tracking-widest block">Event Date</label>
              <input 
                name="date" 
                type="date" 
                defaultValue={editingEvent ? format(new Date(editingEvent.date), 'yyyy-MM-dd') : ''}
                required 
                className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold" 
              />
            </div>
            <div className="space-y-4 md:col-span-2">
              <label className="text-xs font-black text-charcoal/40 uppercase tracking-widest block">Description</label>
              <textarea 
                name="description" 
                defaultValue={editingEvent?.description}
                required 
                className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold h-32" 
                placeholder="Describe the significance and agenda..." 
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-charcoal/40 uppercase tracking-widest block">Location</label>
              <input 
                name="location" 
                defaultValue={editingEvent?.location}
                required 
                className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold" 
                placeholder="National Museum, New Delhi" 
              />
            </div>
            <div className="space-y-4">
              <label className="text-xs font-black text-charcoal/40 uppercase tracking-widest block">Event Type</label>
              <select 
                name="type" 
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold"
              >
                <option value={EventType.UPCOMING}>Upcoming</option>
                <option value={EventType.PAST}>Past</option>
              </select>
            </div>
            <div className="space-y-4 md:col-span-2">
              <label className="text-xs font-black text-charcoal/40 uppercase tracking-widest block">Event Poster</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-charcoal/30 block ml-2">Option A: Upload Image File</span>
                  <input 
                    name="posterFile" 
                    type="file" 
                    accept="image/*"
                    className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold text-xs" 
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-charcoal/30 block ml-2">Option B: Use External Image URL</span>
                  <input 
                    name="posterUrl" 
                    defaultValue={editingEvent?.posterUrl}
                    className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold text-xs" 
                    placeholder="https://images.unsplash.com/..." 
                  />
                </div>
              </div>
            </div>
            
            {eventType === EventType.UPCOMING ? (
              <div className="space-y-4 md:col-span-2">
                <label className="text-xs font-black text-charcoal/40 uppercase tracking-widest block">Registration Link (Google Forms / Custom)</label>
                <input 
                  name="registrationLink" 
                  defaultValue={editingEvent?.registrationLink}
                  className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-emerald outline-none font-bold border-emerald/20" 
                  placeholder="https://forms.gle/..." 
                />
              </div>
            ) : (
              <div className="space-y-4 md:col-span-2">
                <label className="text-xs font-black text-charcoal/40 uppercase tracking-widest block">Google Drive Folder Link (Media Gallery)</label>
                <input 
                  name="driveFolderLink" 
                  defaultValue={editingEvent?.driveFolderLink}
                  className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold border-saffron/20" 
                  placeholder="https://drive.google.com/..." 
                />
              </div>
            )}

            <div className="md:col-span-2 pt-4">
              <button type="submit" className="w-full bg-charcoal text-white py-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-emerald transition-all shadow-xl shadow-charcoal/20 group">
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span>{editingEvent ? 'Update Heritage Event' : 'Publish Heritage Event'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {initialEvents.map((event: any) => (
          <div key={event._id} className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-charcoal/5 border border-black/5 flex flex-col lg:flex-row lg:items-center gap-10 group hover:shadow-saffron/5 transition-all relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -translate-y-1/2 translate-x-1/2 transition-all duration-700 opacity-20 ${
              event.type === 'UPCOMING' ? 'bg-emerald' : 'bg-saffron'
            }`} />

            <div className="w-full lg:w-48 aspect-video lg:aspect-square rounded-[2rem] overflow-hidden shadow-2xl shadow-charcoal/20 shrink-0">
              <img src={event.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>

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

            <div className="flex items-center space-x-3 shrink-0">
              <button 
                onClick={() => handleEdit(event)}
                className="p-4 bg-ash hover:bg-saffron hover:text-white rounded-2xl text-charcoal/40 transition-all shadow-sm"
              >
                <Edit size={20} />
              </button>
              <form action={async () => {
                await deleteEvent(event._id, new FormData());
              }}>
                <button className="p-4 bg-red-50 hover:bg-red-500 hover:text-white rounded-2xl text-red-500 transition-all shadow-sm">
                  <Trash2 size={20} />
                </button>
              </form>
            </div>
          </div>
        ))}

        {initialEvents.length === 0 && (
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
