import React from 'react';
import HeritageMapClient from '@/components/layout/HeritageMapClient';
import { getAllHeritageSites } from '@/app/actions/site';

export default async function HeritageMapPage() {
  const sites = await getAllHeritageSites();

  return (
    <main className="min-h-screen pt-20">
      <HeritageMapClient initialSites={sites} />
    </main>
  );
}
