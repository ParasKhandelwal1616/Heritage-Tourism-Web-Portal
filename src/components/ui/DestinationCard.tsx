'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight } from 'lucide-react';

interface DestinationCardProps {
  image: string;
  title: string;
  location: string;
  category: string;
  description: string;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ 
  image, 
  title, 
  location, 
  category, 
  description 
}) => {
  return (
    <motion.div
      whileHover={{ y: -12 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative aspect-[4/5] group overflow-hidden rounded-[2.5rem] bg-charcoal shadow-2xl shadow-charcoal/20"
    >
      {/* Background Image with Zoom Effect */}
      <motion.div
        className="absolute inset-0 z-0"
        whileHover={{ scale: 1.15 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
      </motion.div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end text-white">
        <div className="flex items-center space-x-3 mb-4">
          <span className="px-3 py-1 bg-saffron text-white text-[10px] font-black uppercase tracking-widest rounded-full">
            {category}
          </span>
          <div className="flex items-center space-x-1 text-white/60 text-xs font-bold uppercase tracking-widest">
            <MapPin size={12} className="text-emerald" />
            <span>{location}</span>
          </div>
        </div>

        <h3 className="font-serif text-3xl md:text-4xl font-bold leading-tight mb-4 drop-shadow-md">
          {title}
        </h3>
        
        <p className="text-white/70 text-sm leading-relaxed mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <button className="flex items-center space-x-2 text-white font-black uppercase tracking-widest text-xs group/btn">
            <span>Explore Site</span>
            <div className="p-2 bg-white/20 rounded-full group-hover/btn:bg-saffron transition-all duration-300">
              <ArrowUpRight size={14} />
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;
