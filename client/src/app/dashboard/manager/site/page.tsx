'use client';

import React, { useEffect, useState } from 'react';
import { getGlobalSettings, updateGlobalSettings } from '@/app/actions/site';
import { ShieldAlert, Save, Globe, Mail, Link as LinkIcon, Image as ImageIcon, Video, Phone, MapPin, Instagram, Twitter, Facebook, Github, Linkedin, FileText } from 'lucide-react';

export default function GlobalSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await getGlobalSettings();
      setSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await updateGlobalSettings(formData);
      if (result.success) {
        alert('Settings updated successfully');
        setSettings(result.data);
      } else {
        alert('Failed to update: ' + result.error);
      }
    } catch (error) {
      alert('Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-serif italic">Loading configurations...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-serif font-black text-white tracking-tight flex items-center">
            <ShieldAlert className="mr-4 text-emerald" size={40} />
            Global <span className="text-emerald">Settings</span>
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Configure club identity, contact details, and system-wide parameters.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-950/50 border border-gray-800 p-8 rounded-3xl shadow-2xl space-y-8 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Club Info */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-emerald uppercase tracking-[0.2em] mb-4 flex items-center">
              <span>Club Identity</span>
              <div className="ml-2 h-0.5 flex-grow bg-emerald/10 rounded-full" />
            </h3>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                <Globe className="w-3 h-3 mr-2" /> Club Name
              </label>
              <input 
                name="clubName" 
                defaultValue={settings?.clubName}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-emerald outline-hidden"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                <FileText className="w-3 h-3 mr-2" /> Club Description
              </label>
              <textarea 
                name="clubDescription" 
                defaultValue={settings?.clubDescription}
                rows={4}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-emerald outline-hidden"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-emerald uppercase tracking-[0.2em] mb-4 flex items-center">
              <span>Contact Information</span>
              <div className="ml-2 h-0.5 flex-grow bg-emerald/10 rounded-full" />
            </h3>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                <Mail className="w-3 h-3 mr-2" /> Contact Email
              </label>
              <input 
                name="contactEmail" 
                type="email"
                defaultValue={settings?.contactEmail}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-emerald outline-hidden"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                <Phone className="w-3 h-3 mr-2" /> Contact Phone
              </label>
              <input 
                name="contactPhone" 
                defaultValue={settings?.contactPhone}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-emerald outline-hidden"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                <MapPin className="w-3 h-3 mr-2" /> Contact Address
              </label>
              <input 
                name="contactAddress" 
                defaultValue={settings?.contactAddress}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-emerald outline-hidden"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6 md:col-span-2">
            <h3 className="text-xs font-black text-emerald uppercase tracking-[0.2em] mb-4 flex items-center">
              <span>Social Connectivity</span>
              <div className="ml-2 h-0.5 flex-grow bg-emerald/10 rounded-full" />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                  <Instagram className="w-3 h-3 mr-2" /> Instagram
                </label>
                <input name="instagramUrl" defaultValue={settings?.instagramUrl} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-emerald outline-hidden" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                  <Twitter className="w-3 h-3 mr-2" /> Twitter
                </label>
                <input name="twitterUrl" defaultValue={settings?.twitterUrl} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-emerald outline-hidden" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                  <Facebook className="w-3 h-3 mr-2" /> Facebook
                </label>
                <input name="facebookUrl" defaultValue={settings?.facebookUrl} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-emerald outline-hidden" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                  <Github className="w-3 h-3 mr-2" /> GitHub
                </label>
                <input name="githubUrl" defaultValue={settings?.githubUrl} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-emerald outline-hidden" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                  <Linkedin className="w-3 h-3 mr-2" /> LinkedIn
                </label>
                <input name="linkedinUrl" defaultValue={settings?.linkedinUrl} className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-emerald outline-hidden" />
              </div>
            </div>
          </div>

          {/* Media Assets */}
          <div className="space-y-6 md:col-span-2">
            <h3 className="text-xs font-black text-emerald uppercase tracking-[0.2em] mb-4 flex items-center">
              <span>Core Media Assets</span>
              <div className="ml-2 h-0.5 flex-grow bg-emerald/10 rounded-full" />
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                  <ImageIcon className="w-3 h-3 mr-2" /> Logo Image URL
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl border border-gray-800 overflow-hidden shrink-0 bg-white">
                    <img src={settings?.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                  </div>
                  <input 
                    name="logoUrl" 
                    defaultValue={settings?.logoUrl}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-emerald outline-hidden"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center">
                  <Video className="w-3 h-3 mr-2" /> Hero Video URL
                </label>
                <input 
                  name="heroVideoUrl" 
                  defaultValue={settings?.heroVideoUrl}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-bold focus:ring-2 focus:ring-emerald outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center space-x-3 px-12 py-4 bg-emerald text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-emerald/90 transition-all disabled:opacity-50"
          >
            <Save size={20} />
            <span>{saving ? 'Synchronizing...' : 'Save Global State'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
