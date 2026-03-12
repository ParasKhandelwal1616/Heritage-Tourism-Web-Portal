import React from 'react';
import LandingClient from '@/components/layout/LandingClient';
import { getHeroVideo } from '@/app/actions/site';

const destinations = [
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

export default async function LandingPage() {
  const videoUrl = await getHeroVideo();
  
  return (
    <LandingClient destinations={destinations} videoUrl={videoUrl} />
  );
}
