'use client';

import React, { useEffect, useState } from 'react';
import { PowerTable } from '@/components/ui/PowerTable';
import { ColumnDef } from '@tanstack/react-table';
import { UserRole } from '@/types/user';
import { updateUserRole, getAllUsers, deleteUser, createUser } from '@/app/actions/users';
import { MoreHorizontal, Trash2, ShieldCheck, User as UserIcon, Plus, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserDirectoryPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    try {
      await updateUserRole(userId, newRole);
      fetchUsers();
    } catch (error) {
      alert('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createUser(formData);
      if (result.success) {
        setShowAddModal(false);
        fetchUsers();
      } else {
        setError(result.error || 'Failed to create user');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700">
            {row.original.image ? (
              <img src={row.original.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <div>
            <div className="font-medium text-white">{row.original.name}</div>
            <div className="text-xs text-gray-500">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
          row.original.role === UserRole.ADMIN ? 'bg-red-500/10 text-red-500' :
          row.original.role === UserRole.MANAGER ? 'bg-emerald-500/10 text-emerald-500' :
          row.original.role === UserRole.MEMBER ? 'bg-blue-500/10 text-blue-500' :
          'bg-gray-500/10 text-gray-500'
        }`}>
          {row.original.role}
        </span>
      ),
    },
    {
        accessorKey: 'createdAt',
        header: 'Joined',
        cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <select 
            className="bg-gray-900 border border-gray-800 text-xs text-white rounded-md p-1 focus:ring-1 focus:ring-emerald outline-none"
            value={row.original.role}
            onChange={(e) => handleRoleChange(row.original._id, e.target.value as UserRole)}
          >
            {Object.values(UserRole).map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <button 
            onClick={() => handleDeleteUser(row.original._id)}
            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-black text-white tracking-tight flex items-center">
            <ShieldCheck className="mr-3 text-emerald" size={32} />
            User Management
          </h1>
          <p className="text-gray-500 mt-2">Promote, demote, or remove club members.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 bg-emerald text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald/90 transition-all shadow-lg shadow-emerald/10"
        >
          <Plus size={20} />
          <span>Add New User</span>
        </button>
      </div>

      <div className="bg-gray-950/50 border border-gray-800 p-6 rounded-2xl shadow-2xl backdrop-blur-xl">
        <PowerTable columns={columns} data={users} searchKey="name" />
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-gray-900 border border-gray-800 rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-serif font-black text-white">Add New <span className="text-emerald italic">User</span></h2>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-6">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Full Name</label>
                    <input 
                      name="name"
                      required
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-emerald outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Email Address</label>
                    <input 
                      name="email"
                      type="email"
                      required
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-emerald outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">Initial Password</label>
                    <input 
                      name="password"
                      type="password"
                      required
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-emerald outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">User Role</label>
                    <select 
                      name="role"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-emerald outline-none transition-all"
                    >
                      {Object.values(UserRole).map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald/90 transition-all shadow-xl shadow-emerald/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
