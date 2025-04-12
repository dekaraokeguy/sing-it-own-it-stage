
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic2, Music, Camera, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/Layout/PageLayout';

const Index = () => {
  const [logoAnimate, setLogoAnimate] = useState(false);
  
  useEffect(() => {
    // Start animation after a small delay
    const timer = setTimeout(() => setLogoAnimate(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Audio click effect
  const playClickSound = () => {
    // This would play a click sound if we had one
    console.log("Click sound would play here");
  };

  return (
    <PageLayout>
      <div className="relative overflow-hidden">
        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-b from-karaoke-purple via-karaoke-pink to-karaoke-blue text-white px-4 py-16 text-center">
          <div className={`transition-all duration-1000 ${logoAnimate ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
            <div className="relative mb-6">
              <h1 className="text-5xl sm:text-7xl font-bold text-white mb-4 logo-animate">
                <span className="block">DEAN</span> 
                <span className="block text-3xl sm:text-5xl">DE KARAOKE GUY</span>
              </h1>
              <div className="absolute inset-0 bg-shimmer animate-shimmer"></div>
            </div>
            
            <div className="mb-8 animate-bounce-subtle">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-karaoke-yellow neon-text">
                SING IT OWN IT
              </h2>
              <p className="text-xl sm:text-2xl font-bold text-white animate-pulse-slow mt-2">
                No Shame If Yuh Buss
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                asChild
                onClick={playClickSound}
                className="bg-karaoke-yellow hover:bg-karaoke-yellow/80 text-black px-6 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105"
              >
                <Link to="/performances">
                  <Mic2 className="mr-2 h-5 w-5" />
                  View Countdown
                </Link>
              </Button>
              <Button 
                asChild
                onClick={playClickSound}
                className="bg-karaoke-pink hover:bg-karaoke-pink/80 text-white px-6 py-3 rounded-full font-bold text-lg transition-all transform hover:scale-105"
              >
                <Link to="/upload">
                  <Video className="mr-2 h-5 w-5" />
                  Upload Performance
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-16 bg-gradient-to-b from-black to-karaoke-purple text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Karaoke Experience Like No Other</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-black/30 p-6 rounded-xl shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-karaoke-pink/30">
                    <Mic2 className="h-8 w-8 text-karaoke-pink" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Sing It Own It Countdown</h3>
                <p className="text-center text-white/80">
                  Vote for your favorite performances and see who takes the crown in our weekly countdown.
                </p>
              </div>
              
              <div className="bg-black/30 p-6 rounded-xl shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-karaoke-yellow/30">
                    <Camera className="h-8 w-8 text-karaoke-yellow" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Share Your Performances</h3>
                <p className="text-center text-white/80">
                  Upload your videos and photos to share your karaoke moments with friends and fans.
                </p>
              </div>
              
              <div className="bg-black/30 p-6 rounded-xl shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-karaoke-blue/30">
                    <Music className="h-8 w-8 text-karaoke-blue" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">Access Songbooks</h3>
                <p className="text-center text-white/80">
                  Browse and download our extensive collection of songbooks for your next karaoke session.
                </p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Button 
                asChild
                onClick={playClickSound}
                className="bg-karaoke-green hover:bg-karaoke-green/80 text-white px-6 py-3 rounded-full font-bold text-lg"
              >
                <Link to="/about">Learn More About Dean De Karaoke Guy</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Event Booking Section */}
        <div className="py-16 bg-gradient-to-b from-karaoke-purple to-black text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-black/40 p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-center mb-4 gradient-text">Book Your Next Karaoke Event</h2>
              <p className="text-center mb-8">
                Available for private parties, corporate events, and special occasions. Let's bring the karaoke fun to you!
              </p>
              
              <div className="flex justify-center">
                <Button 
                  asChild
                  onClick={playClickSound}
                  className="bg-karaoke-blue hover:bg-karaoke-blue/80 text-white px-6 py-3 rounded-full font-bold text-lg"
                >
                  <Link to="/contact">Contact Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
