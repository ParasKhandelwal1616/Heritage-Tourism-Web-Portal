import React from 'react';
import HeritageManagerClient from './HeritageManagerClient';
import { getAllHeritageSites } from '@/app/actions/site';

export default async function HeritageManagerPage() {
  const sites = await getAllHeritageSites();
  
  return (
    <HeritageManagerClient initialSites={sites} />
  );
}
