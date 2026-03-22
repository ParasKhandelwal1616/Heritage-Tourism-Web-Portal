'use client';

import React, { useEffect, useState } from 'react';
import Hero from '@/components/layout/Hero';

export default function LandingPage() {
  const [stats, setStats] = useState({ members: 0, events: 0, blogs: 0 });
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats and settings from our new Express API
        const [statsRes, settingsRes] = await Promise.all([
          fetch('http://localhost:5000/api/blogs'), // Just an example, we can create a dedicated stats endpoint
          fetch('http://localhost:5000/api/settings')
        ]);

        const blogs = await statsRes.json();
        const settings = await settingsRes.json();

        setStats({
          members: 1250, // Static for now or fetch from user count
          events: 45,
          blogs: blogs.length || 0
        });

        if (settings?.heroVideoUrl) {
          setVideoUrl(settings.heroVideoUrl);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="min-h-screen">
      <Hero videoUrl={videoUrl} stats={stats} />
      
      <section className="py-20 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-serif font-black text-charcoal mb-6">
          Welcome to <span className="text-saffron">Heritage Club</span>
        </h2>
        <p className="text-xl text-charcoal/60 max-w-3xl mx-auto leading-relaxed">
          Exploring the past, preserving the future. Join us on our journey to discover 
          the world's most incredible heritage sites and stories.
        </p>
      </section>

      {!loading && (
        <section className="pb-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-ash rounded-3xl border border-black/5">
              <h3 className="text-2xl font-serif font-black text-charcoal mb-4">Our Mission</h3>
              <p className="text-charcoal/60">To document and preserve the cultural heritage of our region through digital storytelling.</p>
            </div>
            <div className="p-8 bg-ash rounded-3xl border border-black/5">
              <h3 className="text-2xl font-serif font-black text-charcoal mb-4">Events</h3>
              <p className="text-charcoal/60">Weekly meetups, workshops, and guided tours of local historical landmarks.</p>
            </div>
            <div className="p-8 bg-ash rounded-3xl border border-black/5">
              <h3 className="text-2xl font-serif font-black text-charcoal mb-4">Community</h3>
              <p className="text-charcoal/60">A vibrant network of historians, travelers, and cultural enthusiasts.</p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
