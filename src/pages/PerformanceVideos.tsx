
import React, { useState } from 'react';
import { Play, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/Layout/PageLayout';

// Mock data until connected to Supabase
const mockVideos = [
  { 
    id: '1', 
    title: 'Electric Slide Karaoke Performance', 
    url: 'https://example.com/video1.mp4', 
    uploader_name: 'Jane123', 
    votes: 25,
    photo_url: '/lovable-uploads/624dcf17-1dd5-4d12-a2b7-3f1661f35717.png'
  },
  { 
    id: '2', 
    title: 'Single Ladies Cover', 
    url: 'https://example.com/video2.mp4', 
    uploader_name: 'John456', 
    votes: 18,
    photo_url: '/lovable-uploads/624dcf17-1dd5-4d12-a2b7-3f1661f35717.png'
  },
  { 
    id: '3', 
    title: 'YMCA Group Performance', 
    url: 'https://example.com/video3.mp4', 
    uploader_name: 'DanceTeam', 
    votes: 32,
    photo_url: '/lovable-uploads/624dcf17-1dd5-4d12-a2b7-3f1661f35717.png'
  },
  { 
    id: '4', 
    title: 'Macarena Cover', 
    url: 'https://example.com/video4.mp4', 
    uploader_name: 'Party789', 
    votes: 14,
    photo_url: '/lovable-uploads/624dcf17-1dd5-4d12-a2b7-3f1661f35717.png'
  },
  { 
    id: '5', 
    title: 'Bohemian Rhapsody Solo', 
    url: 'https://example.com/video5.mp4', 
    uploader_name: 'QueenFan', 
    votes: 29,
    photo_url: '/lovable-uploads/624dcf17-1dd5-4d12-a2b7-3f1661f35717.png'
  },
  { 
    id: '6', 
    title: 'Sweet Caroline Duet', 
    url: 'https://example.com/video6.mp4', 
    uploader_name: 'DuetDuo', 
    votes: 21,
    photo_url: '/lovable-uploads/624dcf17-1dd5-4d12-a2b7-3f1661f35717.png'
  },
];

const PerformanceVideos = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [videos, setVideos] = useState(mockVideos);
  const [userCode, setUserCode] = useState('');
  const { toast } = useToast();

  // Sort videos by votes in descending order
  const sortedVideos = [...videos].sort((a, b) => b.votes - a.votes);

  const handleLogin = () => {
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
      <div className="min-h-screen bg-gradient-to-b from-karaoke-purple via-karaoke-pink to-black text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/128efdba-cc64-44d0-a015-719d38b0c501.png" 
              alt="Sing It Own It Countdown" 
              className="h-32 mx-auto mb-4"
            />
            <p className="text-xl">Browse all performance videos!</p>
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
            </div>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedVideos.map((video) => (
              <div 
                key={video.id} 
                className="bg-black/40 rounded-xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-bold truncate">{video.title}</h3>
                    <div className="bg-karaoke-pink/20 px-2 py-0.5 rounded-full text-xs">
                      {video.votes} votes
                    </div>
                  </div>
                  
                  <div className="relative mb-2">
                    <img 
                      src={video.photo_url} 
                      alt={video.title} 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-white/70" />
                    <p className="text-xs text-white/90">{video.uploader_name}</p>
                  </div>
                  
                  <div className="flex flex-col">                    
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs">Rate:</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star}
                            onClick={() => handleVote(video.id, star)}
                            disabled={!isLoggedIn}
                            className={`transition-transform hover:scale-110 ${isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                            aria-label={`Rate ${star} stars`}
                          >
                            <Star className="h-4 w-4 text-karaoke-yellow fill-karaoke-yellow/40 hover:fill-karaoke-yellow" />
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

export default PerformanceVideos;
