'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-ash flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 shadow-2xl shadow-charcoal/5 border-4 border-red-500/10 text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 animate-pulse">
            <ShieldAlert size={48} />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="font-serif text-4xl font-black text-charcoal">403: Forbidden</h1>
          <p className="text-charcoal/40 font-bold uppercase tracking-widest text-xs">Insufficient Privileges</p>
        </div>

        <p className="text-charcoal/60 font-medium italic">
          "Access to this sacred chamber is restricted to the guardians of our heritage. You do not possess the necessary artifacts (roles) to proceed."
        </p>

        <div className="pt-4 flex flex-col space-y-4">
          <Link 
            href="/dashboard"
            className="flex items-center justify-center space-x-3 bg-charcoal text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-charcoal/10"
          >
            <ArrowLeft size={18} />
            <span>Return to Sanctuary</span>
          </Link>
          <Link 
            href="/"
            className="flex items-center justify-center space-x-3 text-charcoal/40 font-bold text-sm hover:text-charcoal transition-colors"
          >
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
