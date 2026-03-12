'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarLink = ({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) => (
  <Link 
    href={href} 
    className={`flex items-center space-x-3 px-6 py-4 transition-all group ${
      active 
        ? 'bg-saffron text-white font-bold' 
        : 'text-charcoal/60 hover:bg-ash hover:text-charcoal'
    }`}
  >
    <Icon size={20} className={active ? 'text-white' : 'text-saffron group-hover:scale-110 transition-transform'} />
    <span className="text-sm tracking-wide">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto" />}
  </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/manager/events', label: 'Manage Events', icon: Calendar },
    { href: '/dashboard/manager/blogs', label: 'Blog Posts', icon: BookOpen },
    { href: '/dashboard/admin/users', label: 'User Directory', icon: Users, role: 'ADMIN' },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  const filteredMenu = menuItems.filter(item => !item.role || session?.user.role === item.role);

  return (
    <div className="flex h-screen bg-ash overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-saffron text-white rounded-full shadow-2xl"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -320 }}
        className={`fixed lg:relative lg:translate-x-0 w-80 h-full bg-white z-50 shadow-2xl lg:shadow-none border-r border-black/5 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-8 border-b border-black/5 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-saffron rounded-lg" />
            <span className="font-serif font-black text-xl text-charcoal tracking-tight">Heritage<span className="text-saffron">CMS</span></span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-charcoal/40 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-grow pt-8">
          <p className="px-8 text-[10px] font-black text-charcoal/30 uppercase tracking-[0.3em] mb-4">Core Navigation</p>
          <div className="flex flex-col space-y-1">
            {filteredMenu.map((item) => (
              <SidebarLink 
                key={item.href} 
                {...item} 
                active={pathname === item.href} 
              />
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-8 border-t border-black/5 bg-ash/30">
          <div className="flex items-center space-x-3 mb-6">
            <img src={session?.user.image || ''} className="w-10 h-10 rounded-xl object-cover" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-charcoal truncate">{session?.user.name}</p>
              <p className="text-[10px] font-black text-emerald uppercase tracking-widest">{session?.user.role}</p>
            </div>
          </div>
          <button className="flex items-center space-x-3 text-red-500 hover:text-red-600 font-bold text-sm transition-colors">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-grow h-full overflow-y-auto scroll-smooth bg-ash/50 p-6 md:p-12 lg:p-16">
        {children}
      </main>
    </div>
  );
}
