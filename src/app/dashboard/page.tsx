'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, BookOpen, Users, TrendingUp, ArrowUpRight } from 'lucide-react';

const OverviewCard = ({ title, value, icon: Icon, change }: { title: string; value: string; icon: any; change: string }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-charcoal/5 border border-black/5 flex flex-col justify-between"
  >
    <div className="flex items-center justify-between mb-8">
      <div className="p-4 bg-ash rounded-2xl text-saffron">
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

export default function ManagerDashboard() {
  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-saffron font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">
            System Overview
          </span>
          <h2 className="font-serif text-5xl font-black text-charcoal leading-tight">
            Dashboard <span className="text-emerald italic">Control</span>
          </h2>
        </div>
        <button className="flex items-center space-x-3 bg-charcoal text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald transition-all shadow-xl shadow-charcoal/20 active:scale-95 group">
          <span>Create Report</span>
          <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <OverviewCard title="Total Events" value="14" icon={Calendar} change="+12%" />
        <OverviewCard title="Blog Posts" value="38" icon={BookOpen} change="+5%" />
        <OverviewCard title="Club Members" value="1.2K" icon={Users} change="+24%" />
      </div>

      {/* Recent Activity Section (Placeholder) */}
      <section className="bg-white rounded-[3rem] p-12 border border-black/5 shadow-2xl shadow-charcoal/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="flex items-center justify-between mb-12 relative z-10">
          <h3 className="font-serif text-3xl font-black text-charcoal">Recent Activities</h3>
          <button className="text-saffron font-black uppercase tracking-widest text-xs hover:underline transition-all">View All Activity</button>
        </div>
        
        <div className="space-y-6 relative z-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-ash/30 rounded-2xl border border-black/5 group hover:bg-white hover:shadow-xl hover:shadow-charcoal/5 transition-all">
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-saffron shadow-sm">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="font-bold text-charcoal">Heritage Photography Workshop</p>
                  <p className="text-xs text-charcoal/40 font-medium">New event created by Manager Rahul</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-charcoal/30 uppercase tracking-widest">2 Hours Ago</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
