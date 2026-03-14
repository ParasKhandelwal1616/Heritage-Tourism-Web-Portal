import React from 'react';
import dbConnect from '@/lib/db';
import Blog from '@/models/Blog';
import { BookOpen, User, Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

async function getBlogs() {
  await dbConnect();
  const blogs = await Blog.find({}).populate('author', 'name image').sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(blogs));
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="bg-ash/30 min-h-screen pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-12 md:space-y-20">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-emerald font-black uppercase tracking-[0.2em] md:tracking-[0.4em] text-[10px] md:text-xs block">
            Heritage Journal
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-8xl font-black text-charcoal">
            Stories & <span className="text-saffron italic">Insights</span>
          </h1>
          <p className="max-w-2xl mx-auto text-charcoal/60 text-base md:text-lg font-medium">
            Read the latest research, travel stories, and preservation tips from our club members.
          </p>
        </div>

        {/* Featured Post (Placeholder if no blogs) */}
        {blogs.length > 0 ? (
          <div className="relative h-[400px] md:h-[600px] rounded-[2rem] md:rounded-[3.5rem] overflow-hidden group shadow-2xl">
            <img src={blogs[0].coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent p-6 md:p-12 flex flex-col justify-end">
              <div className="max-w-3xl space-y-4 md:space-y-6">
                <div className="flex items-center space-x-4">
                  <span className="bg-saffron text-white px-4 md:px-6 py-1 md:py-2 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest text-center">Featured Story</span>
                  <span className="text-white/60 text-[10px] md:text-xs font-bold">{format(new Date(blogs[0].createdAt), 'MMMM dd, yyyy')}</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl font-black text-white leading-tight">{blogs[0].title}</h2>
                <div className="flex items-center space-x-4">
                  <img src={blogs[0].author?.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/20" />
                  <span className="text-white text-sm md:text-base font-bold">{blogs[0].author?.name || 'Heritage Explorer'}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 md:py-24 text-center bg-white rounded-[2rem] md:rounded-[3rem] border border-black/5 shadow-xl">
             <BookOpen className="mx-auto h-16 w-16 md:h-20 md:w-20 text-charcoal/10 mb-6 md:mb-8" />
             <p className="font-serif text-2xl md:text-3xl font-black text-charcoal/40 italic">The journal is currently empty.</p>
             <p className="text-charcoal/30 text-[10px] md:text-sm font-bold mt-4 tracking-widest uppercase">Check back soon for inspiring heritage stories</p>
          </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {blogs.slice(1).map((blog: any) => (
            <div key={blog._id} className="group bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-charcoal/5 border border-black/5 hover:-translate-y-2 md:hover:-translate-y-4 transition-all duration-500">
              <div className="relative h-48 md:h-64 overflow-hidden">
                <img src={blog.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6">
                  <span className="bg-white/90 backdrop-blur-md text-charcoal px-3 md:px-4 py-1 md:py-2 rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {blog.tags[0] || 'Heritage'}
                  </span>
                </div>
              </div>
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center space-x-3 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-charcoal/40">
                  <Calendar size={12} />
                  <span>{format(new Date(blog.createdAt), 'MMMM dd, yyyy')}</span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-black text-charcoal group-hover:text-emerald transition-colors line-clamp-2">{blog.title}</h3>
                <div className="pt-4 md:pt-6 border-t border-black/5 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User size={14} className="text-saffron" />
                    <span className="text-[10px] md:text-xs font-bold text-charcoal/60">{blog.author?.name || 'Explorer'}</span>
                  </div>
                  <button className="text-emerald font-black uppercase tracking-widest text-[8px] md:text-[10px] flex items-center space-x-2 group/btn">
                    <span>Read More</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
