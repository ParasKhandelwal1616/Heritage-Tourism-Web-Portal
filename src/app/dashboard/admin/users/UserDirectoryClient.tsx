'use client';

import React, { useState } from 'react';
import { Plus, Trash2, UserPlus, ShieldCheck, Mail, Shield, User, X, Send, Search } from 'lucide-react';
import { UserRole } from '@/types/user';
import { manageUserRole, createManagedUser } from '@/app/actions/auth';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserDirectoryClient({ initialUsers, currentUserRole }: { initialUsers: any[], currentUserRole: UserRole }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = async (email: string, newRole: UserRole) => {
    setIsLoading(true);
    const result = await manageUserRole(email, newRole);
    if (result.success) {
      setUsers(prev => prev.map(u => u.email === email ? { ...u, role: newRole } : u));
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-saffron transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 bg-white rounded-3xl border border-black/5 outline-none pl-16 pr-6 font-bold focus:border-saffron shadow-xl shadow-charcoal/5"
          />
        </div>
        
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-3 bg-charcoal text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald transition-all shadow-xl shadow-charcoal/20 active:scale-95 group shrink-0"
        >
          {showAddForm ? <X size={20} /> : <UserPlus size={20} />}
          <span>{showAddForm ? 'Cancel' : 'Add Official'}</span>
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-4 border-emerald/10 mb-8">
              <form action={async (formData) => {
                const res = await createManagedUser(formData);
                if (res.success) {
                  setUsers([res.user, ...users]);
                  setShowAddForm(false);
                } else {
                  alert(res.error);
                }
              }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest block ml-4">Full Name</label>
                  <input name="name" required className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold" placeholder="Rahul Sharma" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest block ml-4">MITS Email</label>
                  <input name="email" type="email" required className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold" placeholder="example@mitsgwl.ac.in" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest block ml-4">Initial Password</label>
                  <input name="password" type="password" required className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold" placeholder="••••••••" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest block ml-4">Role Designation</label>
                  <select name="role" className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-emerald outline-none font-bold">
                    {currentUserRole === UserRole.ADMIN && <option value={UserRole.MANAGER}>Manager (Admin Privileges)</option>}
                    <option value={UserRole.MEMBER}>Club Member</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="w-full bg-emerald text-white py-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-charcoal transition-all shadow-xl shadow-emerald/20">
                    <Send size={18} />
                    <span>Authorize & Create Account</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 bg-ash/30">
                <th className="px-12 py-8 text-[10px] font-black text-charcoal/30 uppercase tracking-[0.3em]">Official User</th>
                <th className="px-12 py-8 text-[10px] font-black text-charcoal/30 uppercase tracking-[0.3em]">Role Access</th>
                <th className="px-12 py-8 text-[10px] font-black text-charcoal/30 uppercase tracking-[0.3em]">Action Control</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-black/5 hover:bg-ash/10 transition-colors group">
                  <td className="px-12 py-10">
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 rounded-2xl bg-ash flex items-center justify-center text-charcoal/30 group-hover:bg-saffron group-hover:text-white transition-all shadow-inner">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="font-serif text-xl font-black text-charcoal">{user.name}</p>
                        <div className="flex items-center space-x-2 text-xs font-bold text-charcoal/40">
                          <Mail size={12} className="text-saffron" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        user.role === UserRole.ADMIN ? 'bg-red-50 text-red-500' :
                        user.role === UserRole.MANAGER ? 'bg-blue-50 text-blue-500' :
                        user.role === UserRole.MEMBER ? 'bg-emerald-50 text-emerald-500' :
                        'bg-ash text-charcoal/40'
                      }`}>
                        <Shield size={18} />
                      </div>
                      <select 
                        value={user.role}
                        disabled={isLoading || (currentUserRole === UserRole.MANAGER && user.role === UserRole.ADMIN)}
                        onChange={(e) => handleRoleChange(user.email, e.target.value as UserRole)}
                        className="bg-transparent font-black uppercase tracking-widest text-[10px] outline-none cursor-pointer hover:text-saffron transition-colors"
                      >
                        {currentUserRole === UserRole.ADMIN && <option value={UserRole.ADMIN}>ADMIN</option>}
                        {currentUserRole === UserRole.ADMIN && <option value={UserRole.MANAGER}>MANAGER</option>}
                        <option value={UserRole.MEMBER}>MEMBER</option>
                        <option value={UserRole.STUDENT}>STUDENT</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <button className="p-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all opacity-0 group-hover:opacity-100 shadow-sm">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
