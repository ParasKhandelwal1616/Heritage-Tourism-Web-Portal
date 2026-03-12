import React from 'react';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { EventType } from '@/types/event';
import { Calendar, MapPin, ExternalLink, Globe, Clock } from 'lucide-react';
import { format } from 'date-fns';

async function getEvents() {
  await dbConnect();
  const events = await Event.find({}).sort({ date: -1 });
  return JSON.parse(JSON.stringify(events));
}

export default async function EventsPage() {
  const events = await getEvents();
  const upcomingEvents = events.filter((e: any) => e.type === EventType.UPCOMING);
  const pastEvents = events.filter((e: any) => e.type === EventType.PAST);

  return (
    <div className="bg-white min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-saffron font-black uppercase tracking-[0.4em] text-xs block">
            Heritage Calendar
          </span>
          <h1 className="font-serif text-6xl md:text-8xl font-black text-charcoal">
            Club <span className="text-emerald italic">Events</span>
          </h1>
          <p className="max-w-2xl mx-auto text-charcoal/60 text-lg font-medium">
            Join our upcoming expeditions or explore the memories of our past heritage events.
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="space-y-12">
          <div className="flex items-center space-x-4">
            <div className="h-px flex-grow bg-black/5" />
            <h2 className="font-serif text-3xl font-black text-charcoal flex items-center space-x-3">
              <Clock className="text-emerald" />
              <span>Upcoming <span className="text-emerald">Expeditions</span></span>
            </h2>
            <div className="h-px flex-grow bg-black/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event: any) => (
              <div key={event._id} className="group bg-ash/30 rounded-[2.5rem] overflow-hidden border border-black/5 hover:shadow-2xl hover:shadow-emerald/10 transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  <img src={event.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-black/5">
                    <span className="text-xs font-black text-emerald uppercase tracking-widest">Register Now</span>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-charcoal/40">
                    <Calendar size={12} className="text-saffron" />
                    <span>{format(new Date(event.date), 'MMMM dd, yyyy')}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-black text-charcoal">{event.title}</h3>
                  <p className="text-sm text-charcoal/60 font-medium line-clamp-2">{event.description}</p>
                  <div className="pt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-charcoal/60 text-xs font-bold">
                      <MapPin size={14} className="text-saffron" />
                      <span>{event.location}</span>
                    </div>
                    {event.registrationLink && (
                      <a href={event.registrationLink} target="_blank" className="bg-emerald text-white p-3 rounded-xl hover:bg-charcoal transition-all">
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <div className="col-span-full py-20 text-center bg-ash/20 rounded-[3rem] border-2 border-dashed border-black/5">
                <p className="font-serif text-xl font-black text-charcoal/30">No upcoming events scheduled yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Past Events Gallery */}
        <section className="space-y-12">
          <div className="flex items-center space-x-4">
            <div className="h-px flex-grow bg-black/5" />
            <h2 className="font-serif text-3xl font-black text-charcoal flex items-center space-x-3">
              <Globe className="text-saffron" />
              <span>Past <span className="text-saffron">Memories</span></span>
            </h2>
            <div className="h-px flex-grow bg-black/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastEvents.map((event: any) => (
              <div key={event._id} className="group relative aspect-square rounded-[2rem] overflow-hidden bg-charcoal">
                <img src={event.posterUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent p-6 flex flex-col justify-end">
                  <span className="text-[10px] font-black text-saffron uppercase tracking-widest mb-2">
                    {format(new Date(event.date), 'yyyy')}
                  </span>
                  <h3 className="text-white font-serif text-xl font-black mb-4">{event.title}</h3>
                  {event.driveFolderLink && (
                    <a 
                      href={event.driveFolderLink} 
                      target="_blank" 
                      className="flex items-center space-x-2 text-white/80 hover:text-saffron text-xs font-bold transition-colors"
                    >
                      <Globe size={14} />
                      <span>View Gallery</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
