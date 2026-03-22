'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, ArrowRight, ShieldCheck, Globe, Users, CheckCircle2, Mail, Lock, User as UserIcon, AlertCircle } from 'lucide-react';
import { registerUser } from '@/app/actions/auth';

export default function SignInPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email.endsWith('@mitsgwl.ac.in')) {
      setError('Only @mitsgwl.ac.in emails are allowed.');
      setIsLoading(false);
      return;
    }

    if (isRegistering) {
      const result = await registerUser(formData);
      if (!result.success) {
        setError(result.error || 'Registration failed');
        setIsLoading(false);
      } else {
        // Automatically login after registration
        const loginResult = await signIn('credentials', { 
          email, 
          password, 
          redirect: false 
        });

        if (loginResult?.error) {
          setError('Registration successful, but login failed. Please try logging in manually.');
          setIsLoading(false);
          setIsRegistering(false);
        } else {
          router.push('/');
          router.refresh();
        }
      }
    } else {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials or access denied.');
        setIsLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=2073" 
            className="w-full h-full object-cover opacity-40 grayscale sepia(20%)"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-charcoal via-charcoal/80 to-transparent" />
        </div>

        <div className="relative z-10 p-20 flex flex-col justify-between h-full">
          <div className="flex items-center space-x-3">
            <Landmark size={40} className="text-saffron" />
            <span className="font-serif text-3xl font-black text-white tracking-tight">Heritage <span className="text-saffron">& Tourism</span> Club</span>
          </div>

          <div className="space-y-12">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="font-serif text-7xl font-black text-white leading-tight">
                MITS <span className="text-emerald italic">Portal</span> <br />
                Login.
              </h1>
              <p className="text-white/60 text-xl font-medium max-w-md">
                Enter your official MITS collage email ID and password to access the heritage hub.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8">
              {[
                { icon: <ShieldCheck className="text-emerald" />, text: "MITS Only Access Control" },
                { icon: <Globe className="text-saffron" />, text: "360° Virtual Experiences" },
                { icon: <CheckCircle2 className="text-emerald" />, text: "Persistent Login" }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex items-center space-x-4 group"
                >
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-all">
                    {item.icon}
                  </div>
                  <span className="text-white/80 font-bold tracking-wide uppercase text-xs">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="pt-10 border-t border-white/10">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">Official Heritage & Tourism Club Portal v1.0</p>
          </div>
        </div>
      </div>

      {/* Auth Side */}
      <div className="flex-grow flex items-center justify-center p-8 bg-ash/30 lg:bg-white overflow-y-auto">
        <div className="w-full max-w-md space-y-8 py-10">
          <div className="lg:hidden flex justify-center mb-12">
            <div className="flex items-center space-x-3">
              <Landmark size={32} className="text-saffron" />
              <span className="font-serif text-2xl font-black text-charcoal tracking-tight">Heritage <span className="text-saffron">& Tourism</span> Club</span>
            </div>
          </div>

          <div className="text-center space-y-4">
            <span className="text-saffron font-black uppercase tracking-[0.4em] text-[10px] block">Portal Authentication</span>
            <h2 className="font-serif text-5xl font-black text-charcoal">
              {isRegistering ? 'Regi' : 'Log'}<span className="text-emerald italic">{isRegistering ? 'ster' : 'in'}</span>
            </h2>
            <p className="text-charcoal/40 text-sm font-bold">Exclusive for @mitsgwl.ac.in holders</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
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
            </AnimatePresence>

            {isRegistering && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-[0.2em] ml-4">Full Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-saffron transition-colors" size={18} />
                  <input name="name" required placeholder="Ex. Rahul Singh" className="w-full h-16 bg-ash group-hover:bg-white transition-all rounded-3xl border border-black/5 outline-none pl-16 pr-6 font-bold focus:border-saffron shadow-inner" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-[0.2em] ml-4">MITS Email ID</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-saffron transition-colors" size={18} />
                <input name="email" type="email" required placeholder="example@mitsgwl.ac.in" className="w-full h-16 bg-ash group-hover:bg-white transition-all rounded-3xl border border-black/5 outline-none pl-16 pr-6 font-bold focus:border-saffron shadow-inner" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-[0.2em] ml-4">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-saffron transition-colors" size={18} />
                <input name="password" type="password" required placeholder="••••••••" className="w-full h-16 bg-ash group-hover:bg-white transition-all rounded-3xl border border-black/5 outline-none pl-16 pr-6 font-bold focus:border-saffron shadow-inner" />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full group bg-charcoal text-white h-20 rounded-[2.5rem] flex items-center justify-between px-8 hover:bg-emerald transition-all shadow-2xl shadow-charcoal/20 active:scale-95 disabled:opacity-50"
            >
              <span className="font-black uppercase tracking-widest text-sm">
                {isLoading ? 'Verifying...' : isRegistering ? 'Create Account' : 'Authenticate'}
              </span>
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          <div className="flex flex-col items-center space-y-4 pt-4">
            <button 
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="text-[10px] font-black text-charcoal/30 uppercase tracking-[0.3em] hover:text-saffron transition-colors"
            >
              {isRegistering ? 'Already have an account? Log In' : 'No account? Register Now'}
            </button>
            <div className="h-px w-full bg-black/5" />
            <p className="text-[10px] font-bold text-charcoal/20 uppercase tracking-widest">Single Sign-On for MITS GWL</p>
          </div>
        </div>
      </div>
    </div>
  );
}
