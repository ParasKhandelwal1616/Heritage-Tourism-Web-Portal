'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Using dynamic import to avoid Leaflet SSR issues
const HeritageMap = dynamic(() => import('@/components/ui/HeritageMap'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full flex items-center justify-center bg-ash/50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-saffron/20 border-t-saffron rounded-full animate-spin" />
        <p className="font-serif font-black text-charcoal animate-pulse">Initializing Heritage Map...</p>
      </div>
    </div>
  )
});

export default function HeritageMapPage() {
  return (
    <main className="min-h-screen pt-20">
      <HeritageMap />
    </main>
  );
}
