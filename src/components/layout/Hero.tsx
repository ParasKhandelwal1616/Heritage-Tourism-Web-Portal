'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, PlayCircle } from 'lucide-react';

interface HeroProps {
  videoUrl?: string;
}

const Hero = ({ videoUrl = '/15161691_3840_2160_30fps.mp4' }: HeroProps) => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Immersive Video Placeholder */}
      <div className="absolute inset-0 z-0">
        <video
          key={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-50"
        >
          {/* Using your high-quality local video background */}
          <source src={videoUrl} type="video/mp4" />
        </video>
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/40 opacity-80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-block text-saffron uppercase tracking-[0.4em] text-sm font-bold bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20"
          >
            Journey through history
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="font-serif text-6xl md:text-8xl lg:text-9xl text-white font-black leading-[0.95] drop-shadow-2xl"
          >
            Discover Our <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron to-emerald italic">Heritage</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="max-w-2xl mx-auto text-lg md:text-2xl text-white/70 font-medium leading-relaxed font-sans"
          >
            Experience the timeless beauty and vibrant culture of our heritage 
            through our curated digital treasures and deep historical archives.
          </motion.p>
        </motion.div>
      </div>

      {/* Scroll Down Animation */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center space-y-2 cursor-pointer"
      >
        <span className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">Scroll Down</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        <ChevronDown className="text-saffron w-5 h-5" />
      </motion.div>
    </section>
  );
};

export default Hero;
