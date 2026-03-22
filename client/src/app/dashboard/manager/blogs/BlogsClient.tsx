'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit, BookOpen, X, Send, Image as ImageIcon, ShieldCheck, User } from 'lucide-react';
import { format } from 'date-fns';
import { createBlog, deleteBlog, updateBlog } from '@/app/actions/blogs';
import { useSession } from 'next-auth/react';
import { PowerTable } from '@/components/ui/PowerTable';
import { ColumnDef } from '@tanstack/react-table';

export default function BlogsClient({ initialBlogs }: { initialBlogs: any[] }) {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  const userId = session?.user?.id;
  const userRole = session?.user?.role;

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'title',
      header: 'Blog Post',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden border border-gray-800 shrink-0">
            <img src={row.original.coverImage} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <div className="font-bold text-white truncate max-w-[120px] md:max-w-xs text-xs md:text-sm">{row.original.title}</div>
            <div className="text-[10px] text-gray-500 flex items-center">
                <User size={10} className="mr-1" /> {row.original.author?.name || 'Anonymous'}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Published',
      cell: ({ row }) => (
        <div className="text-[10px] md:text-xs text-gray-400 whitespace-nowrap">
          {format(new Date(row.original.createdAt), 'MMM dd, yyyy')}
        </div>
      ),
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tags?.slice(0, 1).map((tag: string, idx: number) => (
            <span key={idx} className="px-1.5 py-0.5 bg-gray-900 border border-gray-800 rounded text-[8px] md:text-[9px] text-emerald font-bold uppercase tracking-widest">
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const canManage = userRole === 'ADMIN' || userRole === 'MANAGER' || (row.original.author && row.original.author._id === userId);
        if (!canManage) return <div className="text-gray-600 text-[8px] md:text-[10px] italic">No access</div>;

        return (
          <div className="flex items-center space-x-1 md:space-x-2">
            <button 
              onClick={() => handleEdit(row.original)}
              className="p-1 md:p-1.5 bg-gray-900 border border-gray-800 rounded-md text-gray-400 hover:text-emerald transition-colors"
            >
              <Edit className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
            <button 
              onClick={async () => {
                if(confirm('Permanently delete this blog post?')) {
                    await deleteBlog(row.original._id, new FormData());
                    window.location.reload();
                }
              }}
              className="p-1 md:p-1.5 bg-gray-900 border border-gray-800 rounded-md text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-8 md:space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-white tracking-tight flex items-center text-balance">
            <BookOpen className="mr-3 md:mr-4 text-emerald w-8 h-8 md:w-10 md:h-10" />
            Blog <span className="text-emerald italic ml-2">Moderation</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium text-sm md:text-base">Review, edit, or remove club articles and heritage stories.</p>
        </div>
        <button 
          onClick={() => showForm ? handleCancel() : setShowForm(true)}
          className="flex items-center justify-center space-x-3 bg-emerald text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-emerald/80 transition-all shadow-2xl active:scale-95 group shrink-0 w-full sm:w-auto"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          <span>{showForm ? 'Cancel' : 'Write New Article'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-950/80 backdrop-blur-3xl rounded-[2rem] md:rounded-3xl p-6 md:p-8 border border-emerald/20 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
          <form action={async (formData) => {
            if (editingBlog) {
               await updateBlog(editingBlog._id, formData);
            } else {
               await createBlog(formData);
            }
            window.location.reload();
          }} className="grid grid-cols-1 gap-6 md:gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">Article Title</label>
              <input 
                name="title" 
                defaultValue={editingBlog?.title}
                required 
                className="w-full bg-gray-900 border border-gray-800 px-4 md:px-6 py-3 md:py-4 rounded-xl text-white font-bold focus:border-emerald outline-none transition-all text-sm md:text-base" 
                placeholder="The Architecture of Ancient Hampi" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">Cover Image URL</label>
              <input 
                name="coverImage" 
                defaultValue={editingBlog?.coverImage}
                required 
                className="w-full bg-gray-900 border border-gray-800 px-4 md:px-6 py-3 md:py-4 rounded-xl text-white font-bold focus:border-emerald outline-none transition-all text-sm md:text-base" 
                placeholder="https://..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">Content (Markdown)</label>
              <textarea 
                name="content" 
                defaultValue={editingBlog?.content}
                required 
                className="w-full bg-gray-900 border border-gray-800 px-4 md:px-6 py-3 md:py-4 rounded-xl text-white font-bold h-64 focus:border-emerald outline-none transition-all text-sm md:text-base" 
                placeholder="Share your research or travel story..." 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block ml-1">Tags (Comma Separated)</label>
              <input 
                name="tags" 
                defaultValue={editingBlog?.tags?.join(', ')}
                className="w-full bg-gray-900 border border-gray-800 px-4 md:px-6 py-3 md:py-4 rounded-xl text-white font-bold focus:border-emerald outline-none transition-all text-sm md:text-base" 
                placeholder="History, Architecture, Travel" 
              />
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-emerald text-white py-4 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-emerald/80 transition-all shadow-xl shadow-emerald/20 group text-xs md:text-sm">
                <Send className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span>{editingBlog ? 'Push Updates' : 'Publish Article'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-gray-950/50 border border-gray-800 p-4 md:p-8 rounded-[2rem] md:rounded-3xl shadow-2xl backdrop-blur-xl">
        <PowerTable columns={columns} data={initialBlogs} searchKey="title" />
      </div>
    </div>
  );
}
