
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Mic2, Camera, Video, User, PhoneCall, LogIn, LogOut, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn, user, phoneNumber } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Countdown', path: '/performances', icon: Mic2 },
    { name: 'Upload', path: '/upload', icon: Camera },
    { name: 'Gallery', path: '/gallery', icon: Camera },
    { name: 'Performance Videos', path: '/performance-videos', icon: Video },
    { name: 'About', path: '/about', icon: User },
    { name: 'Contact', path: '/contact', icon: PhoneCall },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  // For mobile, we put login/logout at bottom of the drawer, for desktop in the navbar
  const AuthButton = () => {
    if (isLoggedIn) {
      return (
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 rounded-md"
          onClick={() => window.location.assign('/logout')}
        >
          <UserCircle className="h-5 w-5 text-karaoke-yellow" />
          {user?.email || phoneNumber || 'Account'}
          <LogOut className="h-4 w-4 ml-1" />
        </Button>
      );
    }
    return (
      <Button
        asChild
        variant="outline"
        size="sm"
        className="border-karaoke-yellow text-karaoke-yellow hover:bg-karaoke-yellow/20 flex items-center gap-2 px-3 py-2"
      >
        <Link to="/login">
          <LogIn className="h-4 w-4 mr-1" />
          Login
        </Link>
      </Button>
    );
  };

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
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-white hover:text-white/80 focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed top-0 left-0 w-full h-full bg-black/80 z-40">
          <div className="w-full px-6 pt-24 pb-4 bg-gradient-to-b from-karaoke-purple to-karaoke-pink min-h-screen flex flex-col space-y-2">
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
            <div className="mt-6 border-t border-white/10 pt-4">
              <AuthButton />
            </div>
            <button
              onClick={toggleMenu}
              className="absolute top-6 right-6 text-white focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
