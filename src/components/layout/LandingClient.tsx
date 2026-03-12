'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Hero from '@/components/layout/Hero';
import DestinationCard from '@/components/ui/DestinationCard';
import TimeTravelScroll from '@/components/ui/TimeTravelScroll';
import { Compass, Landmark, Users, Heart } from 'lucide-react';

interface LandingClientProps {
  destinations: any[];
  videoUrl: string;
}

const LandingClient = ({ destinations, videoUrl }: LandingClientProps) => {
  return (
    <div className="bg-white min-h-screen">
      <Hero videoUrl={videoUrl} />

      {/* Featured Destinations Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-saffron font-black uppercase tracking-[0.4em] text-xs mb-4 block">
            Curated Experiences
          </span>
          <h2 className="font-serif text-5xl md:text-7xl font-black text-charcoal mb-6">
            Featured <span className="text-emerald italic">Destinations</span>
          </h2>
          <p className="max-w-2xl mx-auto text-charcoal/60 text-lg md:text-xl font-medium">
            Explore our handpicked collection of India's most breathtaking 
            historical landmarks and cultural sanctuaries.
          </p>
        </motion.div>

        {/* Grid Discovery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((dest, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
            >
              <DestinationCard {...dest} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Time-Travel Experience */}
      <TimeTravelScroll 
        siteName="The Taj Mahal"
        oldImage="https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=2073&sepia=100" 
        modernImage="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=2073"
      />

      {/* Stats / Why Join Section */}
      <section className="py-24 bg-ash border-y border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {[
              { icon: <Compass className="text-saffron" />, value: '25+', label: 'Cultural Events' },
              { icon: <Landmark className="text-emerald" />, value: '45+', label: 'Heritage Sites' },
              { icon: <Users className="text-saffron" />, value: '12K', label: 'Active Members' },
              { icon: <Heart className="text-emerald" />, value: '98%', label: 'Joy Rate' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-black/5 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <h4 className="text-4xl font-serif font-black text-charcoal mb-2">{stat.value}</h4>
                <p className="text-charcoal/40 text-xs font-black uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingClient;
