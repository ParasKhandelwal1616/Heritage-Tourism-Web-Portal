import React from 'react';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import { EventType } from '@/types/event';
import { Calendar, MapPin, ExternalLink, Globe, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

async function getEvents() {
  const conn = await dbConnect();
  if (!conn) return [];
  
  const events = await Event.find({}).sort({ date: -1 });
  return JSON.parse(JSON.stringify(events));
}

export default async function EventsPage() {
  const events = await getEvents();
  const upcomingEvents = events.filter((e: any) => e.type === EventType.UPCOMING);
  const pastEvents = events.filter((e: any) => e.type === EventType.PAST);

  return (
    <div className="bg-white min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-20">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-saffron font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs block">
            Heritage Calendar
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl font-black text-charcoal">
            Club <span className="text-emerald italic">Events</span>
          </h1>
          <p className="max-w-2xl mx-auto text-charcoal/60 text-base md:text-lg font-medium">
            Join our upcoming expeditions or explore the memories of our past heritage events.
          </p>
        </div>

        {/* Upcoming Events */}
        <section className="space-y-8 md:space-y-12">
          <div className="flex items-center space-x-4">
            <div className="h-px flex-grow bg-black/5" />
            <h2 className="font-serif text-2xl md:text-3xl font-black text-charcoal flex items-center space-x-3 shrink-0">
              <Clock className="text-emerald w-5 h-5 md:w-6 md:h-6" />
              <span>Upcoming <span className="text-emerald hidden sm:inline">Expeditions</span></span>
            </h2>
            <div className="h-px flex-grow bg-black/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {upcomingEvents.map((event: any) => (
              <div key={event._id} className="group bg-ash/30 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-black/5 hover:shadow-2xl hover:shadow-emerald/10 transition-all duration-500">
                <div className="relative h-48 md:h-64 overflow-hidden">
                  <img src={event.posterUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 md:top-6 right-4 md:right-6 bg-white/90 backdrop-blur-md px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl shadow-xl border border-black/5">
                    <span className="text-[10px] md:text-xs font-black text-emerald uppercase tracking-widest">Register Now</span>
                  </div>
                </div>
                <div className="p-6 md:p-8 space-y-4">
                  <div className="flex items-center space-x-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-charcoal/40">
                    <Calendar size={12} className="text-saffron" />
                    <span>{format(new Date(event.date), 'MMMM dd, yyyy')}</span>
                  </div>
                  <h3 className="font-serif text-xl md:text-2xl font-black text-charcoal">{event.title}</h3>
                  <p className="text-xs md:text-sm text-charcoal/60 font-medium line-clamp-2">{event.description}</p>
                  <div className="pt-2 md:pt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-charcoal/60 text-[10px] md:text-xs font-bold">
                      <MapPin size={14} className="text-saffron" />
                      <span className="truncate max-w-[150px]">{event.location}</span>
                    </div>
                    {event.registrationLink && (
                      <a href={event.registrationLink} target="_blank" className="bg-emerald text-white p-2.5 md:p-3 rounded-lg md:rounded-xl hover:bg-charcoal transition-all">
                        <ExternalLink className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {upcomingEvents.length === 0 && (
              <div className="col-span-full py-16 md:py-20 text-center bg-ash/20 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-black/5">
                <p className="font-serif text-lg md:text-xl font-black text-charcoal/30">No upcoming events scheduled yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Past Events Gallery */}
        <section className="space-y-8 md:space-y-12">
          <div className="flex items-center space-x-4">
            <div className="h-px flex-grow bg-black/5" />
            <h2 className="font-serif text-2xl md:text-3xl font-black text-charcoal flex items-center space-x-3 shrink-0">
              <Globe className="text-saffron w-5 h-5 md:w-6 md:h-6" />
              <span>Past <span className="text-saffron hidden sm:inline">Memories</span></span>
            </h2>
            <div className="h-px flex-grow bg-black/5" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {pastEvents.map((event: any) => (
              <div key={event._id} className="group relative aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden bg-charcoal">
                <img src={event.posterUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent p-4 md:p-6 flex flex-col justify-end">
                  <span className="text-[8px] md:text-[10px] font-black text-saffron uppercase tracking-widest mb-1 md:mb-2">
                    {format(new Date(event.date), 'yyyy')}
                  </span>
                  <h3 className="text-white font-serif text-base md:text-xl font-black mb-2 md:mb-4 line-clamp-2">{event.title}</h3>
                  {event.driveFolderLink && (
                    <a 
                      href={event.driveFolderLink} 
                      target="_blank" 
                      className="flex items-center space-x-2 text-white/80 hover:text-saffron text-[10px] md:text-xs font-bold transition-colors"
                    >
                      <Globe className="w-3 h-3 md:w-3.5 md:h-3.5" />
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
