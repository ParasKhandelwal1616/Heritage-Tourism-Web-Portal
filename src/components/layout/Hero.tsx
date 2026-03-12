'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, PlayCircle } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-charcoal">
      {/* Immersive Video Placeholder */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-50"
        >
          {/* Replace with your high-quality video URL */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-beautiful-landscape-of-the-mountains-and-the-lake-22442-large.mp4" type="video/mp4" />
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
            Experience the timeless beauty and vibrant culture of global heritage 
            through our curated digital treasures and immersive world tours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="pt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8"
          >
            <button className="w-full sm:w-auto px-12 py-5 bg-white text-charcoal rounded-full font-bold text-lg hover:bg-saffron hover:text-white transition-all shadow-2xl active:scale-95 uppercase tracking-widest flex items-center justify-center">
              Explore Now
            </button>
            <button className="flex items-center space-x-3 text-white group hover:text-emerald transition-colors font-bold uppercase tracking-widest">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-md border border-white/20 group-hover:bg-emerald/20 transition-all">
                <PlayCircle size={28} />
              </div>
              <span>Watch Story</span>
            </button>
          </motion.div>
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
