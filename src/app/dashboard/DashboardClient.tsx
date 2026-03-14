'use client';

import React, { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  BookOpen, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldCheck, 
  Map, 
  Globe,
  Star,
  Zap,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { updateHeroVideo } from '@/app/actions/site';

const OverviewCard = ({ title, value, icon: Icon, change, color }: { title: string; value: string | number; icon: any; change: string, color: string }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-charcoal/5 border border-black/5 flex flex-col justify-between"
  >
    <div className="flex items-center justify-between mb-8">
      <div className={`p-4 rounded-2xl ${color}`}>
        <Icon size={24} />
      </div>
      <div className="flex items-center space-x-1 text-emerald font-bold text-xs uppercase tracking-widest bg-emerald/5 px-3 py-1 rounded-full">
        <TrendingUp size={12} />
        <span>{change}</span>
      </div>
    </div>
    <div>
      <h3 className="text-4xl font-serif font-black text-charcoal mb-1">{value}</h3>
      <p className="text-xs font-black text-charcoal/40 uppercase tracking-[0.2em]">{title}</p>
    </div>
  </motion.div>
);

export default function DashboardClient({ stats }: { stats: any }) {
  const { data: session } = useSession();
  const role = (session?.user?.role || 'STUDENT').toUpperCase();
  const [isUpdatingVideo, setIsUpdatingVideo] = useState(false);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!confirm('This will update the main hero video on the home screen. Continue?')) return;

    setIsUpdatingVideo(true);
    const formData = new FormData();
    formData.append('video', file);

    try {
      const res = await updateHeroVideo(formData);
      if (res.success) {
        alert('Hero video updated successfully!');
      } else {
        alert('Failed to update video: ' + res.error);
      }
    } catch (err) {
      alert('An error occurred while uploading the video.');
    } finally {
      setIsUpdatingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const renderAdminStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <OverviewCard title="Total Users" value={stats.totalUsers} icon={Users} change="+18%" color="bg-blue-50 text-blue-600" />
      <OverviewCard title="Site Traffic" value={`${(stats.siteTraffic / 1000).toFixed(1)}K`} icon={Zap} change="+12%" color="bg-yellow-50 text-yellow-600" />
      <OverviewCard title="Active Blogs" value={stats.activeBlogs} icon={BookOpen} change="+5%" color="bg-emerald-50 text-emerald-600" />
      <OverviewCard title="System Health" value={`${stats.systemHealth}%`} icon={ShieldCheck} change="Stable" color="bg-purple-50 text-purple-600" />
    </div>
  );

  const renderManagerStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <OverviewCard title="Total Events" value={stats.totalEvents} icon={Calendar} change="+2" color="bg-emerald-50 text-emerald-600" />
      <OverviewCard title="Active Blogs" value={stats.activeBlogs} icon={BookOpen} change="+4" color="bg-saffron/10 text-saffron" />
    </div>
  );

  const renderStudentStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <OverviewCard title="Points Earned" value="1,250" icon={Star} change="+150" color="bg-yellow-50 text-yellow-600" />
      <OverviewCard title="Quizzes Taken" value="24" icon={Globe} change="+3" color="bg-emerald-50 text-emerald-600" />
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-saffron font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">
            {role} Control Panel
          </span>
          <h2 className="font-serif text-5xl font-black text-charcoal leading-tight">
            Welcome, <span className="text-emerald italic">{session?.user?.name?.split(' ')[0]}</span>
          </h2>
        </div>
        <div className="flex flex-wrap gap-4">
          {role === 'ADMIN' && (
            <Link href="/dashboard/admin/users" className="flex items-center space-x-3 bg-charcoal text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-emerald transition-all shadow-xl shadow-charcoal/20 active:scale-95 group">
              <span>User Directory</span>
              <ShieldCheck size={18} />
            </Link>
          )}
          {(role === 'MANAGER' || role === 'ADMIN') && (
            <>
              <Link href="/dashboard/manager/events" className="flex items-center space-x-3 bg-emerald text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-charcoal transition-all shadow-xl shadow-emerald/20 active:scale-95 group">
                <span>Manage Events</span>
                <Calendar size={18} />
              </Link>
              <Link href="/dashboard/manager/blogs" className="flex items-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-charcoal transition-all shadow-xl shadow-blue-600/20 active:scale-95 group">
                <span>Manage Blogs</span>
                <BookOpen size={18} />
              </Link>
              <input 
                type="file" 
                ref={videoInputRef} 
                onChange={handleVideoChange} 
                className="hidden" 
                accept="video/*"
              />
              <button 
                onClick={() => videoInputRef.current?.click()}
                disabled={isUpdatingVideo}
                className="flex items-center space-x-3 bg-saffron text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-charcoal transition-all shadow-xl shadow-saffron/20 active:scale-95 group disabled:opacity-50"
              >
                {isUpdatingVideo ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Zap size={18} />
                )}
                <span>{isUpdatingVideo ? 'Uploading...' : 'Hero Video'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {role === 'ADMIN' && renderAdminStats()}
      {role === 'MANAGER' && renderManagerStats()}
      {(role === 'MEMBER' || role === 'STUDENT') && renderStudentStats()}

      {/* Role-Specific Actions Section */}
      <section className="bg-white rounded-[3rem] p-12 border border-black/5 shadow-2xl shadow-charcoal/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center justify-between mb-12 relative z-10">
          <h3 className="font-serif text-3xl font-black text-charcoal">Quick <span className="text-saffron">Actions</span></h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
           <Link href="/events" className="p-6 bg-ash/30 rounded-2xl border border-black/5 group hover:bg-white hover:shadow-xl hover:shadow-charcoal/5 transition-all">
              <Calendar className="text-emerald mb-4" size={24} />
              <p className="font-bold text-charcoal">View Upcoming Events</p>
              <p className="text-xs text-charcoal/40 font-medium">Join club expeditions</p>
           </Link>
           <Link href="/blogs" className="p-6 bg-ash/30 rounded-2xl border border-black/5 group hover:bg-white hover:shadow-xl hover:shadow-charcoal/5 transition-all">
              <BookOpen className="text-blue-500 mb-4" size={24} />
              <p className="font-bold text-charcoal">Read Member Blogs</p>
              <p className="text-xs text-charcoal/40 font-medium">Learn from the community</p>
           </Link>
        </div>
      </section>
    </div>
  );
}
