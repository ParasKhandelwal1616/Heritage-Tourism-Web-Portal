'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit, MapPin, Image as ImageIcon, Info, X, Send, Search } from 'lucide-react';
import { createHeritageSite, updateHeritageSite, deleteHeritageSite } from '@/app/actions/site';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeritageManagerClient({ initialSites }: { initialSites: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingSite, setEditingSite] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sites, setSites] = useState(initialSites);

  const filteredSites = sites.filter(site => 
    site.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    site.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (site: any) => {
    setEditingSite(site);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSite(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this heritage site?')) {
      const res = await deleteHeritageSite(id);
      if (res.success) {
        setSites(prev => prev.filter(s => s._id !== id));
      }
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-saffron font-black uppercase tracking-[0.4em] text-[10px] mb-2 block">
            Map Management
          </span>
          <h2 className="font-serif text-5xl font-black text-charcoal leading-tight">
            Manage <span className="text-emerald italic">Heritage Sites</span>
          </h2>
        </div>
        <button 
          onClick={() => showForm ? handleCancel() : setShowForm(true)}
          className="flex items-center space-x-3 bg-saffron text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald transition-all shadow-xl shadow-saffron/20 active:scale-95 group shrink-0"
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          <span>{showForm ? 'Cancel' : 'Add New Location'}</span>
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-4 border-saffron/10 mb-8">
              <form action={async (formData) => {
                if (editingSite) {
                  const res = await updateHeritageSite(editingSite._id, formData);
                  if (res.success) {
                    // Update local state if needed or rely on refresh
                    window.location.reload();
                  }
                } else {
                  const res = await createHeritageSite(formData);
                  if (res.success) {
                    window.location.reload();
                  }
                }
              }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest block ml-4">Site Name</label>
                  <input 
                    name="name" 
                    defaultValue={editingSite?.name}
                    required 
                    className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold" 
                    placeholder="E.g. Taj Mahal" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest block ml-4">Category</label>
                  <input 
                    name="category" 
                    defaultValue={editingSite?.category || 'Cultural'}
                    required 
                    className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold" 
                    placeholder="E.g. UNESCO Site, Religious, Fort" 
                  />
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest block ml-4">Description</label>
                  <textarea 
                    name="description" 
                    defaultValue={editingSite?.description}
                    required 
                    className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold h-32" 
                    placeholder="Detailed history and significance..." 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest block ml-4">Latitude (Map Position)</label>
                  <input 
                    name="lat" 
                    type="number" 
                    step="0.000001"
                    defaultValue={editingSite?.position?.[0]}
                    required 
                    className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-emerald outline-none font-bold" 
                    placeholder="E.g. 27.1751" 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest block ml-4">Longitude (Map Position)</label>
                  <input 
                    name="lng" 
                    type="number" 
                    step="0.000001"
                    defaultValue={editingSite?.position?.[1]}
                    required 
                    className="w-full bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-emerald outline-none font-bold" 
                    placeholder="E.g. 78.0421" 
                  />
                </div>
                <div className="space-y-4 md:col-span-2">
                  <label className="text-[10px] font-black text-charcoal/40 uppercase tracking-widest block ml-4">Image URL</label>
                  <div className="flex items-center space-x-4">
                    <input 
                      name="image" 
                      defaultValue={editingSite?.image}
                      required 
                      className="flex-grow bg-ash px-6 py-4 rounded-xl border border-black/5 focus:border-saffron outline-none font-bold" 
                      placeholder="https://images.unsplash.com/..." 
                    />
                  </div>
                </div>

                <div className="md:col-span-2 pt-4">
                  <button type="submit" className="w-full bg-charcoal text-white py-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-emerald transition-all shadow-xl shadow-charcoal/20 group">
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    <span>{editingSite ? 'Update Location Details' : 'Add Location to Map'}</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-md group mb-12">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-charcoal/30 group-focus-within:text-saffron transition-colors" size={18} />
        <input 
          type="text" 
          placeholder="Search locations..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-16 bg-white rounded-3xl border border-black/5 outline-none pl-16 pr-6 font-bold focus:border-saffron shadow-xl shadow-charcoal/5"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSites.map((site) => (
          <div key={site._id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-charcoal/5 border border-black/5 group hover:shadow-saffron/5 transition-all flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img src={site.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-charcoal/40 border border-black/5">
                {site.category}
              </div>
            </div>
            <div className="p-8 space-y-4 flex-grow">
              <h3 className="font-serif text-2xl font-black text-charcoal">{site.name}</h3>
              <p className="text-sm text-charcoal/60 font-medium line-clamp-2 italic">"{site.description}"</p>
              <div className="flex items-center space-x-2 text-xs font-bold text-charcoal/30 pt-4">
                <MapPin size={14} className="text-saffron" />
                <span>{site.position[0].toFixed(4)}, {site.position[1].toFixed(4)}</span>
              </div>
            </div>
            <div className="p-6 bg-ash/30 border-t border-black/5 flex items-center justify-end space-x-3">
              <button 
                onClick={() => handleEdit(site)}
                className="p-3 bg-white hover:bg-saffron hover:text-white rounded-xl text-charcoal/30 transition-all shadow-sm border border-black/5"
              >
                <Edit size={18} />
              </button>
              <button 
                onClick={() => handleDelete(site._id)}
                className="p-3 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl text-red-500 transition-all shadow-sm border border-red-100"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {filteredSites.length === 0 && (
          <div className="col-span-full text-center py-32 bg-white/40 border-4 border-dashed border-black/5 rounded-[3rem]">
            <MapPin className="mx-auto h-16 w-16 text-charcoal/10 mb-6" />
            <p className="font-serif text-2xl font-black text-charcoal/40">No pins found on the map</p>
            <p className="text-charcoal/30 text-sm font-bold mt-2">Start adding heritage locations to populate the map!</p>
          </div>
        )}
      </div>
    </div>
  );
}
