'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Landmark, ChevronDown, Map, Calendar, BookOpen, LogOut, LayoutDashboard } from 'lucide-react';
import CommandPalette from '@/components/ui/CommandPalette';

const Navbar = () => {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems: { name: string; href?: string; icon: React.ReactNode; items: string[] }[] = [
    { name: 'Heritage Map', href: '/heritage-map', icon: <Map className="w-5 h-5 text-saffron" />, items: ['Ancient Monuments', 'Historical Cities', 'UNESCO Sites', 'Art Museums'] },
    { name: 'Events', icon: <Calendar className="w-5 h-5 text-emerald" />, items: ['Cultural Galas', 'Site Tours', 'Workshops', 'Conferences'] },
    { name: 'Blogs', icon: <BookOpen className="w-5 h-5 text-saffron" />, items: ['Travel Stories', 'Photography', 'Preservation Tips', 'Food Culture'] },
  ];

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${
      isScrolled ? 'glass-nav h-20' : 'bg-transparent h-24'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2 group">
          <Landmark className={`h-8 w-8 transition-colors duration-300 ${
            isScrolled ? 'text-charcoal' : 'text-white'
          }`} />
          <span className={`font-serif text-2xl font-black tracking-tight transition-colors duration-300 ${
            isScrolled ? 'text-charcoal' : 'text-white'
          }`}>
            Heritage <span className="text-saffron">Club</span>
          </span>
        </Link>

        {/* Global Search CMD+K */}
        <div className="hidden lg:block">
          <CommandPalette />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-12">
          {menuItems.map((menu) => (
            <div 
              key={menu.name}
              onMouseEnter={() => setActiveMenu(menu.name)}
              onMouseLeave={() => setActiveMenu(null)}
              className="relative group h-full flex items-center cursor-pointer"
            >
              <Link 
                href={menu.href || '#'} 
                className={`flex items-center space-x-1 font-semibold text-sm uppercase tracking-widest transition-colors duration-300 ${
                  isScrolled ? 'text-charcoal/80 group-hover:text-saffron' : 'text-white/80 group-hover:text-white'
                }`}
              >
                <span>{menu.name}</span>
                <ChevronDown className="w-4 h-4" />
              </Link>

              {/* Mega Menu Overlay */}
              <AnimatePresence>
                {activeMenu === menu.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-[80px] -left-12 w-64 p-6 mega-menu-gradient rounded-2xl shadow-2xl border border-white/20 backdrop-blur-xl"
                  >
                    <div className="mb-4 flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm border border-black/5">
                        {menu.icon}
                      </div>
                      <span className="font-bold text-charcoal">{menu.name}</span>
                    </div>
                    <ul className="space-y-3">
                      {menu.items.map((subItem) => (
                        <li key={subItem}>
                          <Link href="#" className="text-charcoal/60 hover:text-emerald text-sm font-medium transition-colors block py-1">
                            {subItem}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {status === 'authenticated' ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <img 
                  src={session.user?.image || ''} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border-2 border-saffron shadow-lg"
                />
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-black/5 p-2 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-black/5">
                      <p className="text-sm font-bold text-charcoal truncate">{session.user?.name}</p>
                      <p className="text-[10px] font-black text-emerald uppercase tracking-widest">{session.user?.role}</p>
                    </div>
                    <div className="py-2">
                      <Link href={`/${session.user?.role.toLowerCase()}/dashboard`} className="flex items-center space-x-3 px-4 py-2 text-sm text-charcoal/70 hover:bg-ash rounded-xl transition-colors">
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                      </Link>
                      <button 
                        onClick={() => signOut()}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button 
              onClick={() => signIn('google')}
              className="bg-saffron text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-emerald transition-all shadow-lg hover:shadow-emerald/20 active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-white bg-charcoal/20 p-2 rounded-xl backdrop-blur-md">
          <Menu className={isScrolled ? 'text-charcoal' : 'text-white'} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
