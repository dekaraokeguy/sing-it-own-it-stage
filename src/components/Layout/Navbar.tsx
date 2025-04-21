
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Home, Mic2, Camera, Video, User, PhoneCall, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import AuthNavigation from '@/components/auth/AuthNavigation';
import { Sheet, SheetContent, SheetOverlay } from '@/components/ui/sheet';

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

  const toggleMenu = () => setIsOpen((v) => !v);

  return (
    <nav className="bg-gradient-to-r from-karaoke-purple to-karaoke-pink text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
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
                  {link.name}
                </Link>
              );
            })}
            <AuthNavigation />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-white/80 focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Sheet (Drawer) on mobile */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="left"
          className="w-[80vw] max-w-xs bg-gradient-to-b from-karaoke-purple to-karaoke-pink p-0 text-white border-none"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 pt-6">
              <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center">
                <img
                  src="/lovable-uploads/dad69e7c-a979-464e-b5dd-00a563b5a544.png"
                  alt="Dean De Karaoke Guy"
                  className="h-10"
                />
              </Link>
              <button
                onClick={toggleMenu}
                className="text-white focus:outline-none"
                aria-label="Close navigation menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col gap-1 mt-10 px-4">
              {navLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "flex items-center px-3 py-3 rounded-md text-base font-medium hover:bg-karaoke-purple/40 transition-colors",
                      location.pathname === link.path ?
                        "bg-karaoke-purple/60 text-white font-bold" :
                        "text-white/90"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <IconComponent className="mr-2 h-5 w-5" />
                    {link.name}
                  </Link>
                );
              })}
            </div>
            <div className="mt-auto border-t border-white/10 pt-6 px-4 pb-6">
              <AuthNavigation />
            </div>
          </div>
        </SheetContent>
        <SheetOverlay
          className="md:hidden"
          onClick={() => setIsOpen(false)}
        />
      </Sheet>
    </nav>
  );
};

export default Navbar;
