'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Calendar as CalendarIcon, MapPin, Globe, X, Send, Edit, ExternalLink, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { createEvent, deleteEvent, updateEvent } from '@/app/actions/events';
import { EventType } from '@/types/event';
import { PowerTable } from '@/components/ui/PowerTable';
import { ColumnDef } from '@tanstack/react-table';

export default function EventsClient({ initialEvents }: { initialEvents: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [eventType, setEventType] = useState<EventType>(EventType.UPCOMING);

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

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Event',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden border border-gray-800 shrink-0">
            <img src={row.original.posterUrl} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <div className="font-bold text-white truncate max-w-[120px] md:max-w-xs text-xs md:text-sm">{row.original.title}</div>
            <div className="text-[10px] text-gray-500 flex items-center truncate">
                <MapPin size={10} className="mr-1 shrink-0" /> {row.original.location}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => (
        <div className="text-[10px] md:text-xs text-gray-400 font-bold whitespace-nowrap">
          {format(new Date(row.original.date), 'MMM dd, yyyy')}
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Status',
      cell: ({ row }) => (
        <span className={`px-2 py-1 text-[8px] md:text-[10px] font-black rounded-full uppercase tracking-widest ${
          row.original.type === EventType.UPCOMING ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
        }`}>
          {row.original.type}
        </span>
      ),
    },
    {
      id: 'links',
      header: 'Links',
      cell: ({ row }) => (
        <div className="flex items-center space-x-1 md:space-x-2">
            {row.original.registrationLink && (
                <a href={row.original.registrationLink} target="_blank" className="p-1 md:p-1.5 bg-gray-900 border border-gray-800 rounded-md hover:text-emerald transition-colors">
                    <Globe className="w-3.5 h-3.5" />
                </a>
            )}
            {row.original.driveFolderLink && (
                <a href={row.original.driveFolderLink} target="_blank" className="p-1 md:p-1.5 bg-gray-900 border border-gray-800 rounded-md hover:text-saffron transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            )}
        </div>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-1 md:space-x-2">
          <button 
            onClick={() => handleEdit(row.original)}
            className="p-1 md:p-1.5 bg-gray-900 border border-gray-800 rounded-md text-gray-400 hover:text-emerald transition-colors"
          >
            <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          <button 
            onClick={async () => {
                if(confirm('Are you sure?')) {
                    await deleteEvent(row.original._id, new FormData());
                    window.location.reload();
                }
            }}
            className="p-1 md:p-1.5 bg-gray-900 border border-gray-800 rounded-md text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-white tracking-tight flex items-center">
            <CalendarIcon className="mr-3 md:mr-4 text-emerald w-8 h-8 md:w-10 md:h-10" />
            Event <span className="text-emerald italic ml-2">Control</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium text-sm md:text-base text-balance">Manage registrations, posters, and historical event archives.</p>
        </div>
        <button 
          onClick={() => showForm ? handleCancel() : setShowForm(true)}
          className="flex items-center justify-center space-x-3 bg-emerald text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-emerald/80 transition-all shadow-2xl active:scale-95 group w-full sm:w-auto"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          <span>{showForm ? 'Cancel' : 'Register New Event'}</span>
        </button>
      </div>

      {/* New/Edit Event Form */}
      {showForm && (
        <div className="bg-gray-950/80 backdrop-blur-3xl rounded-[2rem] md:rounded-3xl p-6 md:p-8 border border-emerald/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <form action={async (formData) => {
            if (editingEvent) {
              await updateEvent(editingEvent._id, formData);
            } else {
              await createEvent(formData);
            }
            window.location.reload();
          }} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">Event Title</label>
              <input 
                name="title" 
                defaultValue={editingEvent?.title}
                required 
                className="w-full bg-gray-900 border border-gray-800 px-4 md:px-6 py-3 md:py-4 rounded-xl text-white font-bold focus:border-emerald outline-none transition-all text-sm md:text-base" 
                placeholder="Heritage Summit 2026" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">Event Date</label>
              <input 
                name="date" 
                type="date" 
                defaultValue={editingEvent ? format(new Date(editingEvent.date), 'yyyy-MM-dd') : ''}
                required 
                className="w-full bg-gray-900 border border-gray-800 px-4 md:px-6 py-3 md:py-4 rounded-xl text-white font-bold focus:border-emerald outline-none transition-all text-sm md:text-base" 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">Description</label>
              <textarea 
                name="description" 
                defaultValue={editingEvent?.description}
                required 
                className="w-full bg-gray-900 border border-gray-800 px-4 md:px-6 py-3 md:py-4 rounded-xl text-white font-bold h-32 focus:border-emerald outline-none transition-all text-sm md:text-base" 
                placeholder="Detailed event agenda..." 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">Location</label>
              <input 
                name="location" 
                defaultValue={editingEvent?.location}
                required 
                className="w-full bg-gray-900 border border-gray-800 px-4 md:px-6 py-3 md:py-4 rounded-xl text-white font-bold focus:border-emerald outline-none transition-all text-sm md:text-base" 
                placeholder="Auditorium Hall A" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">Event Type</label>
              <select 
                name="type" 
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full bg-gray-900 border border-gray-800 px-4 md:px-6 py-3 md:py-4 rounded-xl text-white font-bold focus:border-emerald outline-none transition-all text-sm md:text-base"
              >
                <option value={EventType.UPCOMING}>Upcoming</option>
                <option value={EventType.PAST}>Past</option>
              </select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">Poster Image</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                    name="posterFile" 
                    type="file" 
                    accept="image/*"
                    className="bg-gray-900 border border-gray-800 px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-white font-bold text-xs" 
                />
                <input 
                    name="posterUrl" 
                    defaultValue={editingEvent?.posterUrl}
                    className="bg-gray-900 border border-gray-800 px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-white font-bold text-xs focus:border-emerald outline-none" 
                    placeholder="Or paste image URL" 
                />
              </div>
            </div>

            {eventType === EventType.UPCOMING ? (
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-emerald uppercase tracking-widest block ml-1">Registration URL</label>
                <input 
                  name="registrationLink" 
                  defaultValue={editingEvent?.registrationLink}
                  className="w-full bg-gray-900 border border-emerald/20 px-4 md:px-6 py-3 md:py-4 rounded-xl text-white font-bold focus:border-emerald outline-none text-sm md:text-base" 
                  placeholder="https://forms.gle/..." 
                />
              </div>
            ) : (
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-saffron uppercase tracking-widest block ml-1">Google Drive Gallery Link</label>
                <input 
                  name="driveFolderLink" 
                  defaultValue={editingEvent?.driveFolderLink}
                  className="w-full bg-gray-900 border border-saffron/20 px-4 md:px-6 py-3 md:py-4 rounded-xl text-white font-bold focus:border-saffron outline-none text-sm md:text-base" 
                  placeholder="https://drive.google.com/..." 
                />
              </div>
            )}

            <div className="md:col-span-2 pt-4">
              <button type="submit" className="w-full bg-emerald text-white py-4 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-emerald/80 transition-all shadow-xl shadow-emerald/20 group text-xs md:text-sm">
                <Send className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span>{editingEvent ? 'Synchronize Event' : 'Commit Event to Database'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-950/50 border border-gray-800 p-4 md:p-8 rounded-[2rem] md:rounded-3xl shadow-2xl backdrop-blur-xl">
        <PowerTable columns={columns} data={initialEvents} searchKey="title" />
      </div>
    </div>
  );
}
