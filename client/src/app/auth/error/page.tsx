'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Landmark, ArrowLeft, ShieldAlert, Loader2 } from 'lucide-react';
import Link from 'next/link';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const router = useRouter();

  const errorMessages: Record<string, string> = {
    'Configuration': 'There is a problem with the server configuration. Please check your environment variables.',
    'AccessDenied': 'You do not have permission to access this portal with these credentials.',
    'Verification': 'The verification link has expired or has already been used.',
    'Default': 'An unexpected authentication error occurred. Please try again later.',
    'CredentialsSignin': 'Invalid credentials. Only @mitsgwl.ac.in emails are allowed.',
  };

  const message = errorMessages[error as string] || errorMessages.Default;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full bg-white rounded-[3rem] p-12 shadow-2xl border border-black/5 text-center space-y-8"
    >
      <div className="flex justify-center">
        <div className="p-6 bg-red-50 rounded-full relative">
          <ShieldAlert size={48} className="text-red-500" />
          <motion.div 
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-red-500/10 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Landmark size={20} className="text-saffron" />
          <span className="font-serif text-lg font-black text-charcoal tracking-tight">Heritage <span className="text-saffron">& Tourism</span> Club</span>
        </div>
        <h1 className="font-serif text-3xl font-black text-charcoal">Auth <span className="text-red-500 italic">Error</span></h1>
        <p className="text-charcoal/40 text-sm font-bold leading-relaxed px-4">
          {message}
        </p>
        {error && (
           <div className="mt-4 p-3 bg-ash/50 rounded-xl text-[10px] font-black text-charcoal/30 uppercase tracking-widest border border-black/5">
              CODE: {error}
           </div>
        )}
      </div>

      <div className="pt-8 flex flex-col space-y-4">
        <button 
          onClick={() => router.push('/auth/signin')}
          className="w-full bg-charcoal text-white h-16 rounded-2xl flex items-center justify-center space-x-3 hover:bg-emerald transition-all shadow-xl shadow-charcoal/10 font-black uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={16} />
          <span>Try Again</span>
        </button>
        
        <Link 
          href="/" 
          className="text-[10px] font-black text-charcoal/30 uppercase tracking-[0.3em] hover:text-saffron transition-colors"
        >
          Return to Home
        </Link>
      </div>
    </motion.div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-ash/30 flex items-center justify-center p-6">
      <Suspense fallback={
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-black/5 flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-saffron" size={48} />
          <p className="font-serif text-xl font-black text-charcoal">Loading...</p>
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
