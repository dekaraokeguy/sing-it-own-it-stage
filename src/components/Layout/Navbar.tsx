
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Mic2, Camera, Video, Book, Home, User, PhoneCall } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Countdown', path: '/performances', icon: Mic2 },
    { name: 'Upload', path: '/upload', icon: Camera },
    { name: 'Gallery', path: '/gallery', icon: Camera },
    { name: 'Performance Videos', path: '/performance-videos', icon: Video },
    { name: 'About', path: '/about', icon: User },
    { name: 'Contact', path: '/contact', icon: PhoneCall },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-karaoke-purple to-karaoke-pink text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/dad69e7c-a979-464e-b5dd-00a563b5a544.png" 
                alt="Dean De Karaoke Guy" 
                className="h-10 mr-2"
              />
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-karaoke-purple/30 transition-colors",
                    location.pathname === link.path ? 
                      "bg-karaoke-purple/50 text-white font-bold" : 
                      "text-white/90"
                  )}
                >
                  <IconComponent className="mr-1 h-4 w-4" />
                  {link.name === 'Countdown' ? 'Countdown' : link.name}
                </Link>
              );
            })}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white hover:text-white/80">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <Link 
                  key={link.name} 
                  to={link.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-base font-medium hover:bg-karaoke-purple/30",
                    location.pathname === link.path ? 
                      "bg-karaoke-purple/50 text-white font-bold" : 
                      "text-white/90"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <IconComponent className="mr-2 h-5 w-5" />
                  {link.name === 'Countdown' ? 'Countdown' : link.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
