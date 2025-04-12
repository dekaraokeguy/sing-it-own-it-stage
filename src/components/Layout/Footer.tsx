
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-karaoke-purple to-karaoke-pink text-white mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold gradient-text">Dean De Karaoke Guy</h3>
            <p className="text-sm">No Shame If Yuh Buss</p>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="font-semibold mb-2">Connect With Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-karaoke-yellow transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-karaoke-yellow transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="hover:text-karaoke-yellow transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
                <a href="tel:7769319" className="hover:text-karaoke-yellow transition-colors flex items-center">
                  <Phone className="h-5 w-5 mr-1" />
                  <span>776-9319</span>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Navigation</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Link to="/" className="hover:text-karaoke-yellow transition-colors">Home</Link>
                <Link to="/performances" className="hover:text-karaoke-yellow transition-colors">Countdown</Link>
                <Link to="/upload" className="hover:text-karaoke-yellow transition-colors">Upload</Link>
                <Link to="/about" className="hover:text-karaoke-yellow transition-colors">About</Link>
                <Link to="/gallery" className="hover:text-karaoke-yellow transition-colors">Gallery</Link>
                <Link to="/contact" className="hover:text-karaoke-yellow transition-colors">Contact</Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-white/20 pt-4">
          <p className="text-center text-sm">
            &copy; {new Date().getFullYear()} Dean De Karaoke Guy - Sing It Own It. All rights reserved.
          </p>
        </div>
        
        {/* Sponsors Section */}
        <div className="mt-6 border-t border-white/20 pt-4">
          <h4 className="text-center font-semibold mb-4">Our Sponsors</h4>
          <div className="flex flex-wrap justify-center gap-6">
            {/* These will be populated from the sponsors table */}
            <div className="bg-white/20 p-2 rounded-lg w-24 h-12 flex items-center justify-center">
              <span className="text-xs">Sponsor 1</span>
            </div>
            <div className="bg-white/20 p-2 rounded-lg w-24 h-12 flex items-center justify-center">
              <span className="text-xs">Sponsor 2</span>
            </div>
            <div className="bg-white/20 p-2 rounded-lg w-24 h-12 flex items-center justify-center">
              <span className="text-xs">Sponsor 3</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
