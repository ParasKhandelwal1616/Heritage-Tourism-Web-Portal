import React from 'react';
import LandingClient from '@/components/layout/LandingClient';
import { getHeroVideo, getPublicStats, getAllHeritageSites } from '@/app/actions/site';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const videoUrl = await getHeroVideo();
  const stats = await getPublicStats();
  const sites = await getAllHeritageSites();

  // Map sites to destinations format expected by LandingClient
  const destinations = sites.slice(0, 4).map((site: any) => ({
    image: site.image,
    title: site.name,
    location: `${site.position[0].toFixed(2)}, ${site.position[1].toFixed(2)}`,
    category: site.category,
    description: site.description
  }));
  
  // Fallback destinations if none in DB
  const fallbackDestinations = [
    {
      image: 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=2073',
      title: 'Taj Mahal',
      location: 'Agra, India',
      category: 'Wonders of the World',
      description: 'An ivory-white marble mausoleum on the south bank of the Yamuna river.'
    },
    {
      image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=2070',
      title: 'Jaipur Forts',
      location: 'Rajasthan, India',
      category: 'Royal Heritage',
      description: 'The majestic Amer Fort, perched high on a hill, is a major tourist attraction.'
    },
    {
      image: 'https://images.unsplash.com/photo-1561043433-9265f73e685f?auto=format&fit=crop&q=80&w=2070',
      title: 'Varanasi Ghats',
      location: 'Uttar Pradesh, India',
      category: 'Spiritual Heritage',
      description: 'The spiritual heart of India, where life and death converge on the banks of the Ganges.'
    },
    {
      image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&q=80&w=2070',
      title: 'Hampi Ruins',
      location: 'Karnataka, India',
      category: 'UNESCO Sites',
      description: 'Explore the spectacular ruins of the Vijayanagara Empire across a surreal landscape.'
    }
  ];

  return (
    <LandingClient 
      destinations={destinations.length > 0 ? destinations : fallbackDestinations} 
      videoUrl={videoUrl} 
      stats={stats} 
    />
  );
}
