
import React from 'react';
import { Link } from 'react-router-dom';
import { Mic2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-karaoke-purple to-black p-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-karaoke-pink mb-2">404</h1>
        <Mic2 className="h-20 w-20 mx-auto text-white/50 mb-4" />
        <h2 className="text-3xl font-bold text-white mb-6">Oops! The mic dropped</h2>
        <p className="text-xl text-white/80 mb-8">
          The page you're looking for can't be found.<br />
          But the show must go on!
        </p>
        <Button asChild className="bg-karaoke-pink hover:bg-karaoke-pink/80">
          <Link to="/">
            <Home className="h-5 w-5 mr-2" />
            Return to Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
