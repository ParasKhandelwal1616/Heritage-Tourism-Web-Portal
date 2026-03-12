'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MapOverlay from './MapOverlay';
import { Landmark, Navigation } from 'lucide-react';

// Default heritage sites as fallback
const defaultSites = [
  {
    id: 'default-1',
    name: "Taj Mahal",
    position: [27.1751, 78.0421] as [number, number],
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1000",
    description: "Symbol of love, ivory-white marble mausoleum on the south bank of the Yamuna river in Agra."
  },
  {
    id: 'default-2',
    name: "Qutub Minar",
    position: [28.5245, 77.1855] as [number, number],
    image: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?auto=format&fit=crop&q=80&w=1000",
    description: "UNESCO World Heritage site in Delhi, a 73-metre tall tapering tower built in 1193."
  },
  {
    id: 'default-3',
    name: "Hampi",
    position: [15.3350, 76.4600] as [number, number],
    image: "https://images.unsplash.com/photo-1600100397608-f09075841499?auto=format&fit=crop&q=80&w=1000",
    description: "The capital of the Vijayanagara Empire, featuring stunning ruins and monolithic sculptures."
  },
  {
    id: 'default-4',
    name: "Amer Fort",
    position: [26.9855, 75.8513] as [number, number],
    image: "https://images.unsplash.com/photo-1599661046289-e318978b6fc7?auto=format&fit=crop&q=80&w=1000",
    description: "A majestic hilltop fort in Jaipur known for its artistic Hindu-style elements."
  }
];

// Component to handle map clicks to close overlay
const MapClickHandler = ({ onClose }: { onClose: () => void }) => {
  useMapEvents({
    click: () => {
      onClose();
    },
  });
  return null;
};

// Component to handle custom marker icons
const CustomMarker = ({ site, onClick }: { site: any, onClick: (site: any) => void }) => {
  const icon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-2xl border-2 border-saffron hover:scale-125 transition-transform duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9933" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-landmark"><line x1="3" y1="22" x2="21" y2="22"></line><line x1="6" y1="18" x2="6" y2="11"></line><line x1="10" y1="18" x2="10" y2="11"></line><line x1="14" y1="18" x2="14" y2="11"></line><line x1="18" y1="18" x2="18" y2="11"></line><polygon points="12 2 2 7 22 7 12 2"></polygon></svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  return (
    <Marker position={site.position} icon={icon} eventHandlers={{ click: () => onClick(site) }}>
      <Popup className="heritage-popup">
        <div className="p-2">
          <h3 className="font-bold text-charcoal">{site.name}</h3>
          <p className="text-xs text-charcoal/60 mt-1">{site.description}</p>
          <button 
            onClick={() => onClick(site)}
            className="mt-2 w-full bg-saffron text-white text-[10px] font-black py-2 rounded-lg uppercase tracking-widest hover:bg-emerald transition-colors"
          >
            Explore with AI
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

interface HeritageMapProps {
  initialSites?: any[];
}

const HeritageMap = ({ initialSites = [] }: HeritageMapProps) => {
  const [selectedSite, setSelectedSite] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const sitesToShow = initialSites.length > 0 ? initialSites : defaultSites;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative h-screen w-full bg-ash/50">
      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        className="z-0"
      >
        <MapClickHandler onClose={() => setSelectedSite(null)} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-antique-filter"
        />
        {sitesToShow.map((site) => (
          <CustomMarker key={site._id || site.id} site={site} onClick={setSelectedSite} />
        ))}
      </MapContainer>

      {/* Map Legend/Info */}
      <div className="absolute bottom-10 left-10 z-[100] bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-black/5 shadow-2xl max-w-xs">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-saffron rounded-2xl text-white shadow-lg">
            <Navigation size={20} />
          </div>
          <div>
            <h4 className="font-serif font-black text-charcoal">Heritage Explorer</h4>
            <p className="text-[10px] uppercase font-black text-charcoal/40 tracking-widest">Interactive Map & AI Guide</p>
          </div>
        </div>
        <p className="text-xs text-charcoal/60 leading-relaxed font-medium">
          Explore India's cultural treasures. Click any pin to see details and unlock 
          <span className="text-emerald font-bold"> AI-powered insights</span> and historical quizzes.
        </p>
      </div>

      <MapOverlay location={selectedSite} onClose={() => setSelectedSite(null)} />

      <style jsx global>{`
        .leaflet-container {
          background: #fdf5e6 !important;
        }
        .map-antique-filter {
          filter: grayscale(100%) sepia(20%) contrast(110%) brightness(100%);
        }
        .heritage-popup .leaflet-popup-content-wrapper {
          border-radius: 1.5rem;
          padding: 0.5rem;
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
        }
        .heritage-popup .leaflet-popup-tip {
          background: white;
        }
        .custom-div-icon {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default HeritageMap;
