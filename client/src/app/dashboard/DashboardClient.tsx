'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  BookOpen, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  Settings,
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { updateHeroVideo } from '@/app/actions/site';
import { CldUploadWidget } from 'next-cloudinary';

const OverviewCard = ({ title, value, icon: Icon, change, color }: { title: string; value: string | number; icon: any; change: string, color: string }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-charcoal/5 border border-black/5 flex flex-col justify-between h-full"
  >
    <div className="flex items-center justify-between mb-6 md:mb-8">
      <div className={`p-3 md:p-4 rounded-2xl ${color}`}>
        <Icon size={24} />
      </div>
      <div className="flex items-center space-x-1 text-emerald font-bold text-[10px] md:text-xs uppercase tracking-widest bg-emerald/5 px-2 md:px-3 py-1 rounded-full">
        <TrendingUp size={12} />
        <span>{change}</span>
      </div>
    </div>
    <div>
      <h3 className="text-3xl md:text-4xl font-serif font-black text-charcoal mb-1">{value}</h3>
      <p className="text-[10px] md:text-xs font-black text-charcoal/40 uppercase tracking-[0.2em]">{title}</p>
    </div>
  </motion.div>
);

export default function DashboardClient({ stats }: { stats: any }) {
  const { data: session } = useSession();
  const role = (session?.user?.role || 'STUDENT').toUpperCase();

  const handleVideoUploadSuccess = async (result: any) => {
    if (result.event === 'success') {
      try {
        const res = await updateHeroVideo(result.info.secure_url);
        if (res.success) {
          alert('Hero video updated successfully!');
        } else {
          alert('Failed to save video URL: ' + res.error);
        }
      } catch (err) {
        alert('An error occurred while saving the video URL.');
      }
    }
  };

  if (role === 'STUDENT') {
    return (
      <div className="space-y-10 md:space-y-16">
        <div>
          <span className="text-saffron font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">
            Student Portal
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-black text-charcoal leading-tight">
            Welcome, <span className="text-emerald italic">{session?.user?.name?.split(' ')[0]}</span>
          </h2>
        </div>

        <section className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 border border-black/5 shadow-2xl shadow-charcoal/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h3 className="font-serif text-2xl md:text-3xl font-black text-charcoal mb-8 relative z-10">Quick <span className="text-saffron">Access</span></h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
            <Link href="/dashboard/chat" className="p-8 bg-charcoal text-white rounded-2xl group hover:bg-emerald transition-all shadow-xl shadow-charcoal/10">
              <MessageSquare className="text-saffron mb-4" size={32} />
              <p className="text-xl font-bold">Student Chat</p>
              <p className="text-sm text-white/60 font-medium">Join the club discussion and polls</p>
            </Link>
            <Link href="/dashboard/settings" className="p-8 bg-ash/30 rounded-2xl border border-black/5 group hover:bg-white hover:shadow-xl transition-all">
              <Settings className="text-charcoal mb-4" size={32} />
              <p className="text-xl font-bold text-charcoal">Profile Settings</p>
              <p className="text-sm text-charcoal/40 font-medium">Manage your personal information</p>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const renderAdminStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      <OverviewCard title="Total Users" value={stats.totalUsers} icon={Users} change="+18%" color="bg-blue-50 text-blue-600" />
      <OverviewCard title="Site Traffic" value={`${(stats.siteTraffic / 1000).toFixed(1)}K`} icon={Zap} change="+12%" color="bg-yellow-50 text-yellow-600" />
      <OverviewCard title="Active Blogs" value={stats.activeBlogs} icon={BookOpen} change="+5%" color="bg-emerald-50 text-emerald-600" />
      <OverviewCard title="System Health" value={`${stats.systemHealth}%`} icon={ShieldCheck} change="Stable" color="bg-purple-50 text-purple-600" />
    </div>
  );

  const renderManagerStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      <OverviewCard title="Total Events" value={stats.totalEvents} icon={Calendar} change="+2" color="bg-emerald-50 text-emerald-600" />
      <OverviewCard title="Active Blogs" value={stats.activeBlogs} icon={BookOpen} change="+4" color="bg-saffron/10 text-saffron" />
    </div>
  );

  return (
    <div className="space-y-10 md:space-y-16">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div>
          <span className="text-saffron font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] mb-2 block">
            {role} Control Panel
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-black text-charcoal leading-tight">
            Welcome, <span className="text-emerald italic">{session?.user?.name?.split(' ')[0]}</span>
          </h2>
        </div>
        <div className="flex flex-wrap gap-3 md:gap-4">
          {role === 'ADMIN' && (
            <Link href="/dashboard/admin/users" className="flex items-center space-x-3 bg-charcoal text-white px-6 md:px-10 py-3 md:py-5 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg hover:bg-emerald transition-all shadow-xl shadow-charcoal/20 active:scale-95 group">
              <span>User Directory</span>
              <ShieldCheck size={20} />
            </Link>
          )}
          {(role === 'MANAGER' || role === 'ADMIN') && (
            <>
              <Link href="/dashboard/manager/events" className="flex items-center space-x-2 md:space-x-3 bg-emerald text-white px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-base hover:bg-charcoal transition-all shadow-xl shadow-emerald/20 active:scale-95 group">
                <span>Manage Events</span>
                <Calendar size={18} />
              </Link>
              <Link href="/dashboard/manager/blogs" className="flex items-center space-x-2 md:space-x-3 bg-blue-600 text-white px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-base hover:bg-charcoal transition-all shadow-xl shadow-blue-600/20 active:scale-95 group">
                <span>Manage Blogs</span>
                <BookOpen size={18} />
              </Link>
              
              <CldUploadWidget 
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
                onSuccess={handleVideoUploadSuccess}
                options={{
                  maxFileSize: 100000000, // 100MB
                  resourceType: 'video',
                  clientAllowedFormats: ['mp4', 'webm', 'ogg'],
                }}
              >
                {({ open }) => (
                  <button 
                    onClick={() => {
                      if (confirm('This will update the main hero video on the home screen. Continue?')) {
                        open();
                      }
                    }}
                    className="flex items-center space-x-2 md:space-x-3 bg-saffron text-white px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-xs md:text-base hover:bg-charcoal transition-all shadow-xl shadow-saffron/20 active:scale-95 group"
                  >
                    <Zap size={18} />
                    <span>Update Hero Video</span>
                  </button>
                )}
              </CldUploadWidget>
            </>
          )}
        </div>
      </div>

      <section>
        {role === 'ADMIN' && renderAdminStats()}
        {role === 'MANAGER' && renderManagerStats()}
      </section>

      {/* Management Hub */}
      <section className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-12 border border-black/5 shadow-2xl shadow-charcoal/5 overflow-hidden relative">
        <h3 className="font-serif text-2xl md:text-3xl font-black text-charcoal mb-8">Management <span className="text-saffron">Hub</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
           <Link href="/dashboard/chat" className="p-6 bg-charcoal text-white rounded-2xl group hover:bg-emerald transition-all shadow-xl shadow-charcoal/10">
              <ShieldAlert className="text-saffron mb-4" size={24} />
              <p className="font-bold">Student Chat</p>
              <p className="text-[10px] text-white/60 font-medium">Moderate community chat</p>
           </Link>
           <Link href="/dashboard/staff-chat" className="p-6 bg-emerald text-white rounded-2xl group hover:bg-charcoal transition-all shadow-xl shadow-emerald/10">
              <MessageSquare className="text-white mb-4" size={24} />
              <p className="font-bold">Club Chat</p>
              <p className="text-[10px] text-white/60 font-medium">Internal staff discussion</p>
           </Link>
           <Link href="/events" className="p-6 bg-ash/30 rounded-2xl border border-black/5 group hover:bg-white hover:shadow-xl transition-all">
              <Calendar className="text-blue-500 mb-4" size={24} />
              <p className="font-bold text-charcoal">View Events</p>
              <p className="text-[10px] text-charcoal/40 font-medium">Join club expeditions</p>
           </Link>
           <Link href="/blogs" className="p-6 bg-ash/30 rounded-2xl border border-black/5 group hover:bg-white hover:shadow-xl transition-all">
              <BookOpen className="text-emerald mb-4" size={24} />
              <p className="font-bold text-charcoal">Read Blogs</p>
              <p className="text-[10px] text-charcoal/40 font-medium">Member community</p>
           </Link>
        </div>
      </section>
    </div>
  );
}
