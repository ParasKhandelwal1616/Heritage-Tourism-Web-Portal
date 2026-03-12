import React from 'react';
import Link from 'next/link';
import { Landmark, Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-heritage-bg pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-heritage-bg/20 pb-12 mb-8">
        
        {/* Brand Section */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 overflow-hidden rounded-xl border border-secondary/20 shadow-lg">
              <img 
                src="/logo.jpeg" 
                alt="Heritage & Tourism Club Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight">
              Heritage <span className="text-secondary">& Tourism</span> Club
            </span>
          </Link>
          <p className="text-heritage-bg/70 leading-relaxed text-sm">
            Preserving history, exploring culture, and connecting travelers with 
            the stories that shaped our world. Join us in our mission.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-secondary transition-colors"><Instagram size={20} /></Link>
            <Link href="#" className="hover:text-secondary transition-colors"><Twitter size={20} /></Link>
            <Link href="#" className="hover:text-secondary transition-colors"><Facebook size={20} /></Link>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-6 text-secondary">Explore</h3>
          <ul className="space-y-3">
            <li><Link href="/heritage-map" className="text-heritage-bg/80 hover:text-white transition-colors">Heritage Sites</Link></li>
            <li><Link href="/blogs" className="text-heritage-bg/80 hover:text-white transition-colors">Travel Blog</Link></li>
            <li><Link href="/events" className="text-heritage-bg/80 hover:text-white transition-colors">Club Events</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-lg font-bold mb-6 text-secondary">Resources</h3>
          <ul className="space-y-3">
            <li><Link href="/faq" className="text-heritage-bg/80 hover:text-white transition-colors">FAQ</Link></li>
            <li><Link href="/membership" className="text-heritage-bg/80 hover:text-white transition-colors">Membership</Link></li>
            <li><Link href="/privacy" className="text-heritage-bg/80 hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="text-heritage-bg/80 hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold mb-6 text-secondary">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3 text-heritage-bg/80">
              <Mail size={18} className="text-secondary shrink-0" />
              <span className="text-sm">hello@heritagetours.club</span>
            </li>
            <li className="flex items-center space-x-3 text-heritage-bg/80">
              <Phone size={18} className="text-secondary shrink-0" />
              <span className="text-sm">+1 (555) 000-HERITAGE</span>
            </li>
            <li className="flex items-center space-x-3 text-heritage-bg/80">
              <MapPin size={18} className="text-secondary shrink-0" />
              <span className="text-sm">123 History Lane, Cultural Hub, NY 10001</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-heritage-bg/40 text-xs">
        <p>&copy; {currentYear} Heritage & Tourism Club. All rights reserved.</p>
        <p className="mt-2 italic font-serif">"Honoring the past, inspiring the future."</p>
      </div>
    </footer>
  );
};

export default Footer;
