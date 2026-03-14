'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Map, Calendar, BookOpen, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import CommandPalette from '@/components/ui/CommandPalette';

const Navbar = ({ settings }: { settings: any }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === '/';
  const shouldShowSolid = isScrolled || !isHome;

  const clubName = settings?.clubName || 'Heritage & Tourism Club';
  const logoUrl = settings?.logoUrl || '/logo.jpeg';

  // Scroll Lock for Mobile Menu
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const menuItems: { name: string; href: string; icon: React.ReactNode }[] = [
    { name: 'Events', href: '/events', icon: <Calendar className="w-5 h-5 text-emerald" /> },
    { name: 'Blogs', href: '/blogs', icon: <BookOpen className="w-5 h-5 text-saffron" /> },
  ];

  // Add Dashboard link to main menu if authenticated
  if (status === 'authenticated' && session?.user) {
    const role = session.user.role?.toUpperCase();
    let dashboardLabel = 'Dashboard';
    if (role === 'ADMIN') dashboardLabel = 'Admin Panel';
    else if (role === 'MANAGER') dashboardLabel = 'Manager Portal';

    menuItems.push({ 
      name: dashboardLabel, 
      href: '/dashboard', 
      icon: <LayoutDashboard className="w-5 h-5 text-emerald" /> 
    });
  }

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-500 ${
      shouldShowSolid ? 'glass-nav h-20 shadow-sm' : 'bg-transparent h-24'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl border-2 border-saffron shadow-lg group-hover:scale-110 transition-transform">
            <img 
              src={logoUrl} 
              alt={`${clubName} Logo`} 
              className="w-full h-full object-cover"
            />
          </div>
          <span className={`font-serif text-2xl font-black tracking-tight transition-colors duration-300 ${
            shouldShowSolid ? 'text-charcoal' : 'text-charcoal md:text-white'
          }`}>
            {clubName.split(' ').slice(0, -1).join(' ')} <span className="text-saffron">{clubName.split(' ').slice(-1)}</span>
          </span>
        </Link>

        {/* Global Search CMD+K */}
        <div className="hidden lg:block">
          <CommandPalette />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-12">
          {menuItems.map((menu) => (
            <Link 
              key={menu.name}
              href={menu.href} 
              className={`flex items-center space-x-2 font-semibold text-sm uppercase tracking-widest transition-colors duration-300 group ${
                shouldShowSolid ? 'text-charcoal/80 hover:text-saffron' : 'text-charcoal/80 md:text-white/80 md:hover:text-white'
              }`}
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                {menu.icon}
              </span>
              <span>{menu.name}</span>
            </Link>
          ))}

          {status === 'authenticated' ? (
            <div className="relative" ref={profileRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <img 
                  src={session.user?.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(session.user?.name || 'User') + '&background=random'} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border-2 border-saffron shadow-lg hover:scale-105 transition-transform"
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
            <Link 
              href="/auth/signin"
              className="bg-saffron text-white px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-emerald transition-all shadow-lg hover:shadow-emerald/20 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-3 rounded-2xl transition-all duration-300 z-[110] ${
            isMobileMenuOpen 
              ? 'bg-charcoal text-white shadow-xl rotate-90' 
              : shouldShowSolid 
                ? 'bg-charcoal/5 text-charcoal' 
                : 'bg-white/20 text-white backdrop-blur-md'
          }`}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-charcoal/20 backdrop-blur-sm z-[80] lg:hidden"
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm z-[90] bg-white shadow-2xl lg:hidden pt-24 px-8 border-l border-black/5"
            >
              <div className="flex flex-col space-y-8">
                <div className="pb-4 border-b border-black/5">
                  <span className="text-[10px] font-black text-charcoal/20 uppercase tracking-[0.3em]">Main Menu</span>
                </div>
                {menuItems.map((menu) => (
                  <Link 
                    key={menu.name}
                    href={menu.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-ash rounded-2xl group-hover:bg-saffron/10 group-hover:text-saffron transition-all">
                        {menu.icon}
                      </div>
                      <span className="text-2xl font-serif font-black text-charcoal">{menu.name}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
                      <ChevronDown className="w-4 h-4 text-saffron -rotate-90" />
                    </div>
                  </Link>
                ))}
                
                <div className="pt-8 border-t border-black/5 space-y-4">
                  <span className="text-[10px] font-black text-charcoal/20 uppercase tracking-[0.3em] block mb-4">Account</span>
                  {status === 'authenticated' ? (
                    <>
                      <div className="flex items-center space-x-4 p-4 bg-ash rounded-2xl mb-4">
                        <img 
                          src={session.user?.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(session.user?.name || 'User')} 
                          className="w-12 h-12 rounded-full border-2 border-saffron"
                          alt="Profile"
                        />
                        <div>
                          <p className="font-bold text-charcoal">{session.user?.name}</p>
                          <p className="text-[10px] font-black text-emerald uppercase">{session.user?.role}</p>
                        </div>
                      </div>
                      <Link 
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full flex items-center justify-center space-x-3 bg-charcoal text-white py-5 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-charcoal/20 active:scale-95 transition-transform"
                      >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                      </Link>
                      <button 
                        onClick={() => signOut()}
                        className="w-full flex items-center justify-center space-x-3 bg-red-50 text-red-500 py-5 rounded-2xl font-bold uppercase tracking-widest active:scale-95 transition-transform"
                      >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <Link 
                      href="/auth/signin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center bg-saffron text-white py-5 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-saffron/20 active:scale-95 transition-transform"
                    >
                      Sign In to Club
                    </Link>
                  )}
                </div>
              </div>

              {/* Decorative background element */}
              <div className="absolute bottom-10 left-8 right-8 text-center opacity-10 pointer-events-none">
                <p className="font-serif italic text-4xl">Heritage</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
