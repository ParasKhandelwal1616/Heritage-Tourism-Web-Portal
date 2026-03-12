'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface TimeTravelScrollProps {
  oldImage: string;
  modernImage: string;
  siteName: string;
}

const TimeTravelScroll: React.FC<TimeTravelScrollProps> = ({ oldImage, modernImage, siteName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Cross-fade opacity based on scroll progress
  const modernOpacity = useScroll({
    target: containerRef,
    offset: ["center center", "end start"]
  }).scrollYProgress;

  // Scale and Y movements for more depth
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1.05]);
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section ref={containerRef} className="relative h-[150vh] flex flex-col items-center justify-start py-32 bg-ash/30">
      <div className="sticky top-[20vh] w-full max-w-6xl px-6">
        <div className="text-center mb-12">
          <span className="text-saffron font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">
            Time-Travel Window
          </span>
          <h2 className="font-serif text-5xl md:text-7xl font-black text-charcoal leading-tight">
            Then & <span className="text-emerald italic">Now</span>
          </h2>
          <p className="max-w-xl mx-auto text-charcoal/40 text-sm font-bold uppercase tracking-widest mt-4">
            Scroll to witness the transformation of {siteName}
          </p>
        </div>

        <motion.div 
          style={{ scale }}
          className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl shadow-charcoal/20 border-8 border-white"
        >
          {/* Historical (Old) Image - Always underlying */}
          <img 
            src={oldImage} 
            alt="Historical" 
            className="absolute inset-0 w-full h-full object-cover grayscale sepia(20%)"
          />
          
          {/* Modern Image - Fades in based on scroll */}
          <motion.img 
            src={modernImage} 
            alt="Modern" 
            style={{ opacity: scrollYProgress }}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Time indicator overlay */}
          <div className="absolute bottom-8 left-8 flex items-center space-x-4 z-10">
            <div className="bg-white/80 backdrop-blur-md px-6 py-2 rounded-full border border-black/5 shadow-xl">
              <span className="text-xs font-black text-charcoal/60 uppercase tracking-widest">
                {scrollYProgress.get() < 0.5 ? 'Circa 1900' : 'Present Day'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TimeTravelScroll;
