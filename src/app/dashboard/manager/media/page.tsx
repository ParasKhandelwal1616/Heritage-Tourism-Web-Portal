'use client';

import React, { useEffect, useState, useRef } from 'react';
import { getMediaFiles, deleteMediaFile, uploadMediaFile } from '@/app/actions/site';
import { PowerTable } from '@/components/ui/PowerTable';
import { ColumnDef } from '@tanstack/react-table';
import { ImageIcon, FileIcon, VideoIcon, ExternalLink, HardDrive, Clock, Trash2, Upload, Loader2 } from 'lucide-react';

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    try {
      const data = await getMediaFiles();
      setFiles(data);
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadMediaFile(formData);
      if (res.success) {
        fetchFiles();
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        alert('Upload failed: ' + (res.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Permanently destroy ${filename} from the filesystem?`)) return;
    try {
      const res = await deleteMediaFile(filename);
      if (res.success) fetchFiles();
      else alert('Deletion failed: ' + (res.error || 'Unknown error'));
    } catch (error) {
      alert('Error during filesystem operation');
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'File Name',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center shrink-0">
            {row.original.name.match(/\.(mp4|webm|ogg)$/i) ? (
              <VideoIcon className="w-5 h-5 text-emerald" />
            ) : row.original.name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) ? (
              <ImageIcon className="w-5 h-5 text-blue-500" />
            ) : (
              <FileIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="overflow-hidden">
            <div className="font-bold text-white truncate">{row.original.name}</div>
            <div className="text-[10px] text-gray-500 font-mono">{row.original.url}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'size',
      header: 'Size',
      cell: ({ row }) => (
        <div className="flex items-center text-xs text-gray-400 font-bold">
          <HardDrive className="w-3 h-3 mr-2 text-gray-600" />
          {formatSize(row.original.size)}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Uploaded At',
      cell: ({ row }) => (
        <div className="flex items-center text-xs text-gray-400">
          <Clock className="w-3 h-3 mr-2 text-gray-600" />
          {new Date(row.original.createdAt).toLocaleString()}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <a 
            href={row.original.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:bg-emerald transition-all group"
          >
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </a>
          <button 
            onClick={() => handleDelete(row.original.name)}
            className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:bg-red-500 transition-all group"
          >
            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="p-12 text-center text-gray-500">Scanning filesystem...</div>;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-black text-white tracking-tight flex items-center">
            <HardDrive className="mr-4 text-emerald" size={40} />
            Media <span className="text-emerald">Library</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Manage uploaded posters, videos, and static assets.</p>
        </div>
        
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept="video/*,image/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center space-x-2 bg-emerald text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald/90 transition-all shadow-xl shadow-emerald/20 disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
          </button>
        </div>
      </div>

      <div className="bg-gray-950/50 border border-gray-800 p-8 rounded-3xl shadow-2xl backdrop-blur-3xl">
        <PowerTable columns={columns} data={files} searchKey="name" />
      </div>
    </div>
  );
}
