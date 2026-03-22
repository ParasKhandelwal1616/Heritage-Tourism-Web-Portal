'use client';

import React, { useEffect, useState } from 'react';
import { getMediaFiles, deleteMediaFile } from '@/app/actions/site';
import { PowerTable } from '@/components/ui/PowerTable';
import { ColumnDef } from '@tanstack/react-table';
import { ImageIcon, FileIcon, VideoIcon, ExternalLink, HardDrive, Clock, Trash2, Upload, Loader2, Link as LinkIcon } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleUploadSuccess = (result: any) => {
    if (result.event === 'success') {
      const newFile = {
        name: result.info.original_filename || 'Cloudinary Upload',
        url: result.info.secure_url,
        size: result.info.bytes,
        createdAt: new Date().toISOString(),
      };
      // Manually add to list since backend only reads local files for now
      setFiles(prev => [newFile, ...prev]);
      alert('Upload Successful!');
    }
  };

  const handleDelete = async (url: string) => {
    if (!confirm(`Permanently remove this file reference?`)) return;
    try {
      const res = await deleteMediaFile(url);
      if (res.success) {
        setFiles(prev => prev.filter(f => f.url !== url));
      } else {
        alert('Deletion failed: ' + (res.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Error during operation');
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
          <div className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
             {row.original.url.match(/\.(mp4|webm|ogg)/i) || row.original.url.includes('/video/upload/') ? (
              <VideoIcon className="w-5 h-5 text-emerald" />
            ) : row.original.url.match(/\.(jpg|jpeg|png|gif|svg|webp)/i) || row.original.url.includes('/image/upload/') ? (
              <img src={row.original.url} className="w-full h-full object-cover" alt="" />
            ) : (
              <FileIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className="overflow-hidden">
            <div className="font-bold text-white truncate max-w-[200px]">{row.original.name}</div>
            <div className="text-[10px] text-gray-500 font-mono truncate max-w-[200px]">{row.original.url}</div>
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
            onClick={() => handleDelete(row.original.url)}
            className="p-2 bg-gray-900 border border-gray-800 rounded-lg hover:bg-red-500 transition-all group"
          >
            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-white" />
          </button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="p-12 text-center text-gray-500">Scanning assets...</div>;

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-black text-white tracking-tight flex items-center">
            <HardDrive className="mr-4 text-emerald" size={40} />
            Media <span className="text-emerald">Library</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Manage cloud-hosted posters, videos, and static assets.</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <CldUploadWidget 
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "ml_default"}
            onSuccess={handleUploadSuccess}
            options={{
              maxFileSize: 100000000, // 100MB
              resourceType: 'auto',
              clientAllowedFormats: ['png', 'jpeg', 'jpg', 'gif', 'mp4', 'webm', 'ogg'],
            }}
          >
            {({ open }) => (
              <button 
                onClick={() => open()}
                className="flex items-center justify-center space-x-2 bg-emerald text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald/90 transition-all shadow-xl shadow-emerald/20"
              >
                <Upload className="w-5 h-5" />
                <span>Upload via Cloudinary</span>
              </button>
            )}
          </CldUploadWidget>
        </div>
      </div>

      <div className="bg-gray-950/50 border border-gray-800 p-8 rounded-3xl shadow-2xl backdrop-blur-3xl">
        <PowerTable columns={columns} data={files} searchKey="name" />
      </div>

      <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
         <p className="text-blue-400 text-sm font-medium flex items-center">
            <LinkIcon className="w-4 h-4 mr-2" />
            Note: Ensure `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` are set in your environment.
         </p>
      </div>
    </div>
  );
}
