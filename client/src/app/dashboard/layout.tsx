'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { UserRole } from '@/types/user';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  ChevronRight,
  Map,
  ShieldAlert,
  HardDrive,
  MessageSquare
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

  const userRole = (session?.user?.role as string | undefined)?.toUpperCase();
  const isAdmin = userRole === 'ADMIN';
  const isManager = userRole === 'MANAGER';
  const isMember = userRole === 'MEMBER';
  const isPrivileged = isAdmin || isManager || isMember;

  // Regular user links
  const coreMenu = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/chat', label: 'Student Chat', icon: MessageSquare },
    { href: '/dashboard/blogs', label: 'Blog Posts', icon: BookOpen, visible: isMember },
  ].filter(item => item.visible !== false);

  // Privileged links grouped under Portal
  const managerMenu = [
    { href: '/dashboard', label: 'System Overview', icon: LayoutDashboard },
    { href: '/dashboard/staff-chat', label: 'Club Chat', icon: MessageSquare }, // Staff Internal
    { href: '/dashboard/chat', label: 'Student Chat', icon: ShieldAlert }, // Staff Moderation
    { href: '/dashboard/manager/events', label: 'Manage Events', icon: Calendar },
    { href: '/dashboard/manager/media', label: 'Media Library', icon: HardDrive },
    { href: '/dashboard/manager/site', label: 'Global Settings', icon: Settings },
    { href: '/dashboard/manager/blogs', label: 'Manage Blogs', icon: BookOpen },
    { href: '/dashboard/admin/users', label: 'User Directory', icon: Users, adminOnly: true },
  ];

  const settingsMenu = [
    { href: '/dashboard/settings', label: 'Profile Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-ash overflow-hidden pt-20">
      {/* Sidebar Container - Desktop Only */}
      <aside
        className={`hidden lg:flex lg:relative w-80 h-full bg-white z-50 border-r border-black/5 flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-8 border-b border-black/5 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 overflow-hidden rounded-lg shadow-sm border border-black/5">
              <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-serif font-black text-xl text-charcoal tracking-tight">Heritage<span className="text-saffron">CMS</span></span>
          </Link>
        </div>

        {/* Navigation Section */}
        <div className="flex-grow overflow-y-auto pt-8 pb-4">
          <div className="space-y-8">
            {/* Core Navigation (Student/Member) */}
            {!isPrivileged && (
              <div>
                <p className="px-8 text-[10px] font-black text-charcoal/30 uppercase tracking-[0.3em] mb-4">Portal</p>
                <div className="flex flex-col space-y-1">
                  {coreMenu.map((item) => (
                    <SidebarLink key={item.href} {...item} active={pathname === item.href} />
                  ))}
                </div>
              </div>
            )}

            {/* Manager Portal Section */}
            {isPrivileged && (
              <div>
                <div className="px-8 text-[10px] font-black text-emerald uppercase tracking-[0.3em] mb-4 flex items-center">
                  <span>Manager Portal</span>
                  <div className="ml-2 h-1 flex-grow bg-emerald/10 rounded-full" />
                </div>
                <div className="flex flex-col space-y-1">
                  {managerMenu.map((item) => {
                    if (item.adminOnly && !isAdmin) return null;
                    return <SidebarLink key={item.href} {...item} active={pathname === item.href} />;
                  })}
                </div>
              </div>
            )}

            {/* Settings */}
            <div>
              <p className="px-8 text-[10px] font-black text-charcoal/30 uppercase tracking-[0.3em] mb-4">Account</p>
              <div className="flex flex-col space-y-1">
                {settingsMenu.map((item) => (
                  <SidebarLink key={item.href} {...item} active={pathname === item.href} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-8 border-t border-black/5 bg-ash/30">
          <div className="flex items-center space-x-3 mb-6">
            <img 
              src={session?.user.image || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(session?.user.name || 'User') + '&background=random'} 
              className="w-10 h-10 rounded-xl object-cover" 
            />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-charcoal truncate">{session?.user.name}</p>
              <p className="text-[10px] font-black text-emerald uppercase tracking-widest">{session?.user.role}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="flex items-center space-x-3 text-red-500 hover:text-red-600 font-bold text-sm transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow h-full overflow-y-auto scroll-smooth bg-ash/50 p-4 md:p-8 lg:p-12 xl:p-16">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
