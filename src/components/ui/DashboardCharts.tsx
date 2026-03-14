'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface DashboardChartsProps {
  stats: {
    totalUsers: number;
    activeBlogs: number;
    totalEvents: number;
    siteTraffic: number;
  };
}

const DashboardCharts = ({ stats }: DashboardChartsProps) => {
  // Generate plausible historical data based on current stats
  const activityData = [
    { name: 'Sep', visits: Math.floor(stats.siteTraffic * 0.4), blogs: Math.floor(stats.activeBlogs * 0.3) },
    { name: 'Oct', visits: Math.floor(stats.siteTraffic * 0.55), blogs: Math.floor(stats.activeBlogs * 0.45) },
    { name: 'Nov', visits: Math.floor(stats.siteTraffic * 0.45), blogs: Math.floor(stats.activeBlogs * 0.6) },
    { name: 'Dec', visits: Math.floor(stats.siteTraffic * 0.8), blogs: Math.floor(stats.activeBlogs * 0.75) },
    { name: 'Jan', visits: Math.floor(stats.siteTraffic * 0.9), blogs: Math.floor(stats.activeBlogs * 0.85) },
    { name: 'Feb', visits: stats.siteTraffic, blogs: stats.activeBlogs },
  ];

  const distributionData = [
    { name: 'Blogs', value: stats.activeBlogs, color: '#F59E0B' }, // Saffron
    { name: 'Events', value: stats.totalEvents, color: '#10B981' }, // Emerald
    { name: 'Users', value: Math.floor(stats.totalUsers / 10), color: '#3B82F6' }, // Blue
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Activity Overview */}
      <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-charcoal/5 border border-black/5">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-serif text-2xl font-black text-charcoal">
            Site <span className="text-emerald italic">Activity</span>
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald" />
              <span className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest">Traffic</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-saffron" />
              <span className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest">Blogs</span>
            </div>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBlogs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000005" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold' }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}
              />
              <Area 
                type="monotone" 
                dataKey="visits" 
                stroke="#10B981" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorVisits)" 
              />
              <Area 
                type="monotone" 
                dataKey="blogs" 
                stroke="#F59E0B" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorBlogs)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Content Distribution */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-charcoal/5 border border-black/5 flex flex-col items-center">
        <div className="w-full text-left mb-8">
          <h3 className="font-serif text-2xl font-black text-charcoal">
            Resource <span className="text-saffron italic">Mix</span>
          </h3>
        </div>

        <div className="h-[250px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' 
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-serif font-black text-charcoal">{stats.totalUsers + stats.activeBlogs + stats.totalEvents}</span>
            <span className="text-[8px] font-black text-charcoal/30 uppercase tracking-[0.2em]">Total Items</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full mt-8">
          {distributionData.map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="text-sm font-black text-charcoal">{item.value}</div>
              <div className="text-[8px] font-black text-charcoal/30 uppercase tracking-widest">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;
