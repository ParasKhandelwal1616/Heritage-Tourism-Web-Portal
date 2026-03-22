import React from 'react';
import ChatDashboard from '@/components/dashboard/ChatDashboard';

export default function DashboardChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-3xl md:text-4xl font-black text-charcoal">
          Student <span className="text-saffron">Chat Management</span>
        </h2>
        <p className="text-charcoal/40 text-xs font-bold uppercase tracking-widest mt-2">
          Moderate the student community and manage active polls
        </p>
      </div>
      
      <ChatDashboard room="student" title="Student Chat Hub" />
    </div>
  );
}
