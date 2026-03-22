import React from 'react';
import ChatDashboard from '@/components/dashboard/ChatDashboard';

export default function StaffChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl md:text-4xl font-black text-charcoal">
          Staff <span className="text-emerald">Discussion</span>
        </h2>
        <p className="text-charcoal/40 text-xs font-bold uppercase tracking-widest mt-2">
          Private communication channel for Admins, Managers, and Members
        </p>
      </div>
      
      <ChatDashboard room="staff" title="Internal Staff Discussion" />
    </div>
  );
}
