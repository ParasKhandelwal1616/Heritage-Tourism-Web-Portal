'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit, BookOpen, X, Send, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { createBlog, deleteBlog, updateBlog } from '@/app/actions/blogs';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function BlogsClient({ initialBlogs }: { initialBlogs: any[] }) {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  if (!session || session.user.role === 'STUDENT') {
    redirect('/');
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBlog(null);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-saffron font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">
            Content Management
          </span>
          <h2 className="font-serif text-5xl font-black text-charcoal leading-tight">
            Manage <span className="text-emerald italic">Blogs</span>
          </h2>
        </div>
        <button 
          onClick={() => showForm ? handleCancel() : setShowForm(true)}
          className="flex items-center space-x-3 bg-saffron text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald transition-all shadow-xl shadow-saffron/20 active:scale-95 group shrink-0"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          <span>{showForm ? 'Cancel' : 'New Post'}</span>
        </button>
      </div>

      {/* New/Edit Blog Form */}
      {showForm && (
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-charcoal/5 border-4 border-saffron/10 animate-in fade-in slide-in-from-top-4 duration-500">
          <form action={async (formData) => {
            if (editingBlog) {
               await updateBlog(editingBlog._id, formData);
            } else {
               await createBlog(formData);
            }
            handleCancel();
          }} className="grid grid-cols-1 gap-8">
            <div className="space-y-4">
              <label className="text-xs font-black text-charcoal/40 uppercase tracking-widest block">Post Title</label>
              <input 
                name="title" 
                defaultValue={editingBlog?.title}
                required 
                className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold" 
                placeholder="Discovering the secrets of Hampi" 
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-xs font-black text-charcoal/40 uppercase tracking-widest block">Cover Image URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" size={18} />
                <input 
                  name="coverImage" 
                  defaultValue={editingBlog?.coverImage}
                  required 
                  className="w-full bg-ash px-6 py-4 pl-12 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold" 
                  placeholder="https://unsplash.com/photos/..." 
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-charcoal/40 uppercase tracking-widest block">Content (Markdown Supported)</label>
              <textarea 
                name="content" 
                defaultValue={editingBlog?.content}
                required 
                className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold min-h-[200px]" 
                placeholder="Write your heritage story here..." 
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-charcoal/40 uppercase tracking-widest block">Tags (Comma Separated)</label>
              <input 
                name="tags" 
                defaultValue={editingBlog?.tags?.join(', ')}
                className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold" 
                placeholder="History, Architecture, India" 
              />
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-charcoal text-white py-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-emerald transition-all shadow-xl shadow-charcoal/20 group">
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span>{editingBlog ? 'Update Blog Post' : 'Publish Blog Post'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialBlogs.map((blog: any) => (
          <div key={blog._id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-charcoal/5 border border-black/5 group hover:-translate-y-2 transition-transform flex flex-col">
            <div className="h-48 relative overflow-hidden">
              <img src={blog.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                 <h3 className="font-serif text-xl font-black line-clamp-1">{blog.title}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-grow">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-charcoal/40">
                <span>{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</span>
                <span className="bg-ash px-2 py-1 rounded-md text-emerald">{blog.author?.name || 'Unknown'}</span>
              </div>
              
              <p className="text-sm text-charcoal/60 line-clamp-3 font-medium">{blog.content}</p>
              
              <div className="pt-4 border-t border-black/5 flex items-center justify-between mt-auto">
                <div className="flex gap-2">
                  {blog.tags?.slice(0,2).map((tag: string, idx: number) => (
                    <span key={idx} className="text-[9px] font-bold bg-saffron/10 text-saffron px-2 py-1 rounded-md">{tag}</span>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  {(userRole === 'ADMIN' || userRole === 'MANAGER' || (blog.author && blog.author._id === userId)) && (
                    <button 
                      onClick={() => handleEdit(blog)}
                      className="p-2 text-charcoal/30 hover:bg-ash rounded-xl transition-all"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                  {(userRole === 'ADMIN' || userRole === 'MANAGER' || (blog.author && blog.author._id === userId)) && (
                    <form action={async () => {
                      await deleteBlog(blog._id, new FormData());
                    }}>
                      <button className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {initialBlogs.length === 0 && (
          <div className="col-span-full text-center py-32 bg-white/40 border-4 border-dashed border-black/5 rounded-[3rem]">
            <BookOpen className="mx-auto h-16 w-16 text-charcoal/10 mb-6" />
            <p className="font-serif text-2xl font-black text-charcoal/40">No blogs found in the database</p>
            <p className="text-charcoal/30 text-sm font-bold mt-2">Start by writing your first heritage post!</p>
          </div>
        )}
      </div>
    </div>
  );
}
