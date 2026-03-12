'use client';

import React, { useState } from 'react';
import { updateHeroVideo } from '@/app/actions/site';
import { Upload, Video, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SiteSettingsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        setMessage('File size must be less than 50MB');
        setStatus('error');
        return;
      }
      if (!selectedFile.type.startsWith('video/')) {
        setMessage('Please select a valid video file');
        setStatus('error');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setStatus('idle');
      setMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus('uploading');
    const formData = new FormData();
    formData.append('video', file);

    try {
      const result = await updateHeroVideo(formData);
      if (result.success) {
        setStatus('success');
        setMessage('Background video updated successfully!');
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to update video');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="space-y-4">
        <h1 className="font-serif text-5xl font-black text-charcoal">Site <span className="text-saffron italic">Settings</span></h1>
        <p className="text-charcoal/60 text-lg max-w-2xl font-medium leading-relaxed">
          Manage your club's landing page appearance. Upload high-quality videos 
          to keep the background fresh and engaging for your visitors.
        </p>
      </header>

      <section className="bg-white rounded-[3rem] shadow-2xl shadow-charcoal/5 border border-black/5 p-12 overflow-hidden">
        <h2 className="text-2xl font-bold text-charcoal mb-8 flex items-center space-x-3">
          <Video className="text-saffron" />
          <span>Hero Background Video</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="relative group">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="video-upload"
            />
            <div className={`
              border-4 border-dashed rounded-[2rem] p-16 text-center transition-all duration-500
              ${file ? 'border-emerald/40 bg-emerald/5' : 'border-black/5 bg-ash group-hover:border-saffron/40 group-hover:bg-saffron/5'}
            `}>
              <div className="space-y-6">
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-colors ${file ? 'bg-emerald text-white' : 'bg-white text-charcoal/40 shadow-sm'}`}>
                  {status === 'uploading' ? <Loader2 className="animate-spin" size={32} /> : <Upload size={32} />}
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-charcoal">
                    {file ? file.name : 'Click to upload or drag & drop'}
                  </p>
                  <p className="text-sm text-charcoal/40 font-medium">MP4, WebM or Ogg (Max 50MB)</p>
                </div>
              </div>
            </div>
          </div>

          {preview && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white"
            >
              <video src={preview} controls className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 px-4 py-2 bg-black/50 backdrop-blur-md text-white text-xs font-bold rounded-full uppercase tracking-widest">
                Preview
              </div>
            </motion.div>
          )}

          {status === 'success' && (
            <div className="p-4 bg-emerald/10 border border-emerald/20 text-emerald rounded-2xl flex items-center space-x-3">
              <CheckCircle2 size={20} />
              <span className="font-bold">{message}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-500 rounded-2xl flex items-center space-x-3">
              <AlertCircle size={20} />
              <span className="font-bold">{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!file || status === 'uploading'}
            className={`
              w-full py-6 rounded-2xl font-black text-lg uppercase tracking-[0.2em] transition-all
              ${!file || status === 'uploading' 
                ? 'bg-ash text-charcoal/20 cursor-not-allowed' 
                : 'bg-saffron text-white shadow-xl shadow-saffron/20 hover:scale-[1.02] active:scale-95'}
            `}
          >
            {status === 'uploading' ? 'Updating Site...' : 'Update Background Video'}
          </button>
        </form>
      </section>
    </div>
  );
}
