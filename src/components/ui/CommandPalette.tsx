'use client';

import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Landmark, Calendar, BookOpen, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Handle keyboard shortcuts (CMD+K or CTRL+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center space-x-3 px-4 py-2 bg-charcoal/5 hover:bg-charcoal/10 rounded-full text-charcoal/40 transition-all group"
      >
        <Search size={16} />
        <span className="text-xs font-bold uppercase tracking-widest">Search Heritage</span>
        <kbd className="text-[10px] font-black bg-white/50 px-2 py-0.5 rounded-lg border border-black/5 flex items-center space-x-1">
          <span className="text-xs">⌘</span>
          <span>K</span>
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-charcoal/40 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-black/5 overflow-hidden"
            >
              <Command className="flex flex-col h-full">
                <div className="flex items-center px-8 border-b border-black/5 py-6">
                  <Search className="mr-4 text-saffron shrink-0" size={24} />
                  <Command.Input 
                    placeholder="Search monuments, blogs, or events..." 
                    className="flex-grow bg-transparent outline-none text-xl font-serif font-black text-charcoal placeholder-charcoal/20"
                  />
                  <button onClick={() => setOpen(false)} className="ml-4 p-2 bg-ash rounded-xl text-charcoal/40 hover:text-charcoal transition-all">
                    <X size={20} />
                  </button>
                </div>

                <Command.List className="p-4 max-h-[60vh] overflow-y-auto scroll-smooth">
                  <Command.Empty className="py-20 text-center flex flex-col items-center">
                    <Landmark size={48} className="text-charcoal/10 mb-4" />
                    <p className="text-charcoal/40 font-black uppercase tracking-widest text-sm italic">&quot;No heritage found with that name...&quot;</p>
                  </Command.Empty>

                  <Command.Group heading={<span className="px-4 text-[10px] font-black text-charcoal/20 uppercase tracking-[0.3em] mb-2 block">Quick Navigation</span>}>
                    {[
                      { icon: <Calendar />, label: 'All Events', route: '/events', color: 'text-emerald' },
                      { icon: <BookOpen />, label: 'Travel Blog', route: '/blogs', color: 'text-saffron' },
                      { icon: <User />, label: 'Member Portal', route: '/portal', color: 'text-emerald' },
                    ].map((nav) => (
                      <Command.Item 
                        key={nav.route}
                        onSelect={() => runCommand(() => router.push(nav.route))}
                        className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-ash cursor-pointer transition-all group"
                      >
                        <div className={`p-3 bg-white rounded-xl shadow-sm border border-black/5 group-hover:scale-110 transition-transform ${nav.color}`}>
                          {nav.icon}
                        </div>
                        <span className="font-bold text-charcoal tracking-wide">{nav.label}</span>
                        <div className="ml-auto flex items-center space-x-2 text-charcoal/20 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          <span>Navigate</span>
                          <span className="text-xs">↵</span>
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                </Command.List>

                <div className="p-6 bg-ash/30 border-t border-black/5 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-[10px] font-black text-charcoal/30 uppercase tracking-[0.2em]">
                    <div className="flex items-center space-x-1">
                      <kbd className="bg-white px-1.5 py-0.5 rounded border border-black/5">↑↓</kbd>
                      <span>to navigate</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <kbd className="bg-white px-1.5 py-0.5 rounded border border-black/5">esc</kbd>
                      <span>to close</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] font-black text-saffron uppercase tracking-[0.2em]">
                    <div className="w-1.5 h-1.5 bg-saffron rounded-full animate-pulse" />
                    <span>Gemini AI Connected</span>
                  </div>
                </div>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommandPalette;
