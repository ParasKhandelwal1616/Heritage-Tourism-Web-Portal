'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { updatePassword } from '@/app/actions/auth';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const newPass = formData.get('newPassword') as string;
    const confirmPass = formData.get('confirmPassword') as string;

    if (newPass !== confirmPass) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const result = await updatePassword(formData);
    if (result.success) {
      setSuccess(true);
      e.currentTarget.reset();
    } else {
      setError(result.error || 'Failed to update password');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <span className="text-saffron font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">
          Profile Management
        </span>
        <h2 className="font-serif text-5xl font-black text-charcoal leading-tight">
          System <span className="text-emerald italic">Settings</span>
        </h2>
      </div>

      <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-black/5 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-xl space-y-10 relative z-10">
          <div>
            <h3 className="font-serif text-2xl font-black text-charcoal mb-4">Security Credentials</h3>
            <p className="text-charcoal/40 text-sm font-bold uppercase tracking-widest">Update your official portal access password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-50 border border-red-500/20 p-4 rounded-2xl flex items-center space-x-3 text-red-500 text-xs font-bold"
                >
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-emerald-50 border border-emerald-500/20 p-4 rounded-2xl flex items-center space-x-3 text-emerald-500 text-xs font-bold"
                >
                  <CheckCircle2 size={16} />
                  <span>Password updated successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-[0.2em] ml-4">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-saffron transition-colors" size={18} />
                  <input name="newPassword" type="password" required className="w-full h-16 bg-ash group-hover:bg-white transition-all rounded-3xl border border-black/5 outline-none pl-16 pr-6 font-bold focus:border-saffron shadow-inner" placeholder="••••••••" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-[0.2em] ml-4">Confirm Password</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-saffron transition-colors" size={18} />
                  <input name="confirmPassword" type="password" required className="w-full h-16 bg-ash group-hover:bg-white transition-all rounded-3xl border border-black/5 outline-none pl-16 pr-6 font-bold focus:border-saffron shadow-inner" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-20 bg-charcoal text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center space-x-4 hover:bg-emerald transition-all shadow-xl shadow-charcoal/20 group"
            >
              {isLoading ? (
                <span>Syncing...</span>
              ) : (
                <>
                  <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span>Save New Credentials</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
