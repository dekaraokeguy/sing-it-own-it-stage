
import React, { useState, useEffect } from 'react';
import { Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PageLayout from '@/components/Layout/PageLayout';
import { useToast } from '@/hooks/use-toast';

// Temporary mock data until connected to Supabase
const mockVideos = [
  { 
    id: '1', 
    title: 'Electric Slide Karaoke Performance', 
    url: 'https://example.com/video1.mp4', 
    uploader: 'Jane123', 
    votes: 25,
    photo_url: '/lovable-uploads/624dcf17-1dd5-4d12-a2b7-3f1661f35717.png'
  },
  { 
    id: '2', 
    title: 'Single Ladies Cover', 
    url: 'https://example.com/video2.mp4', 
    uploader: 'John456', 
    votes: 18,
    photo_url: '/lovable-uploads/624dcf17-1dd5-4d12-a2b7-3f1661f35717.png'
  },
  { 
    id: '3', 
    title: 'YMCA Group Performance', 
    url: 'https://example.com/video3.mp4', 
    uploader: 'DanceTeam', 
    votes: 32,
    photo_url: '/lovable-uploads/624dcf17-1dd5-4d12-a2b7-3f1661f35717.png'
  },
  { 
    id: '4', 
    title: 'Macarena Cover', 
    url: 'https://example.com/video4.mp4', 
    uploader: 'Party789', 
    votes: 14,
    photo_url: '/lovable-uploads/624dcf17-1dd5-4d12-a2b7-3f1661f35717.png'
  },
];

const Performances = () => {
  const [videos, setVideos] = useState(mockVideos);
  const [userCode, setUserCode] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  
  // Sort videos by votes in descending order
  const sortedVideos = [...videos].sort((a, b) => b.votes - a.votes);

  const handleLogin = () => {
    // This would authenticate with Supabase in the real implementation
    if (userCode.length === 7) {
      setIsLoggedIn(true);
      toast({
        title: "Login Successful",
        description: "You can now vote for performances!",
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 7-digit login code.",
        variant: "destructive"
      });
    }
  };

  const handleVote = (videoId: string, rating: number) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login with your code to vote.",
        variant: "destructive"
      });
      return;
    }

    // Update the vote count (this would connect to Supabase in the real implementation)
    setVideos(videos.map(video => 
      video.id === videoId ? { ...video, votes: video.votes + rating } : video
    ));
    
    toast({
      title: "Vote Recorded!",
      description: `You gave this performance ${rating} stars.`,
    });
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-karaoke-blue via-karaoke-purple to-black text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text mb-2">Sing It Own It Countdown</h1>
            <p className="text-xl">Vote for your favorite performances!</p>
          </div>
          
          {!isLoggedIn && (
            <div className="max-w-md mx-auto bg-black/40 p-6 rounded-xl shadow-lg mb-8">
              <h2 className="text-xl font-bold mb-4">Login to Vote</h2>
              <div className="flex">
                <input 
                  type="text" 
                  maxLength={7}
                  placeholder="Enter your 7-digit code" 
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="flex-grow px-4 py-2 bg-black/40 border border-white/30 rounded-l-md focus:outline-none focus:ring-2 focus:ring-karaoke-pink text-white"
                />
                <Button 
                  onClick={handleLogin}
                  className="bg-karaoke-pink hover:bg-karaoke-pink/80 rounded-l-none"
                >
                  Login
                </Button>
              </div>
              <p className="text-sm mt-2 text-white/70">Don't have a code? Get one at your next karaoke event!</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedVideos.map((video, index) => (
              <div 
                key={video.id} 
                className={`bg-black/40 rounded-xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-xl
                  ${index === 0 ? 'md:col-span-2 lg:col-span-3 border-2 border-karaoke-yellow' : ''}`}
              >
                {index === 0 && (
                  <div className="bg-karaoke-yellow text-black py-1 px-4 flex items-center justify-center">
                    <Trophy className="h-5 w-5 mr-2" />
                    <span className="font-bold">Current Leader</span>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{video.title}</h3>
                    <div className="bg-karaoke-pink/20 px-3 py-1 rounded-full text-sm">
                      {video.votes} votes
                    </div>
                  </div>
                  
                  {video.photo_url && (
                    <img 
                      src={video.photo_url} 
                      alt={video.title} 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <div className="mb-4">
                    <video 
                      controls 
                      poster={video.photo_url} 
                      className="w-full rounded-lg"
                      preload="none"
                    >
                      <source src={video.url} type="video/mp4" />
                      Your browser does not support video playback.
                    </video>
                  </div>
                  
                  <div className="flex flex-col">
                    <p className="text-sm text-white/70 mb-2">Uploaded by: {video.uploader}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm">Rate this performance:</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star}
                            onClick={() => handleVote(video.id, star)}
                            disabled={!isLoggedIn}
                            className={`text-2xl transition-transform hover:scale-110 ${isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                          >
                            <Star className="h-6 w-6 text-karaoke-yellow fill-karaoke-yellow/40 hover:fill-karaoke-yellow" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {!isLoggedIn && (
                      <p className="text-xs text-white/50 mt-1 italic text-right">Login to vote</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {sortedVideos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl">No performances uploaded yet. Be the first!</p>
              <Button asChild className="mt-4 bg-karaoke-pink hover:bg-karaoke-pink/80">
                <a href="/upload">Upload Your Performance</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Performances;
