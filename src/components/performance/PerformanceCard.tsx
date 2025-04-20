
import React, { useState } from 'react';
import { Star, Play, Pause, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { playClickSound } from '@/utils/soundEffects';
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase/config';

interface PerformanceCardProps {
  performance: {
    id: string;
    title: string;
    url: string;
    uploader_name: string;
    votes: number;
    photo_url?: string;
  };
  isLoggedIn: boolean;
  votesRemaining: number;
  canVoteFor: (id: string) => boolean;
  recordVote: (id: string) => boolean;
  isLeader?: boolean;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  performance,
  isLoggedIn,
  votesRemaining,
  canVoteFor,
  recordVote,
  isLeader = false
}) => {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  // To prevent permissions issues, ensure videos are correctly hosted and can be played with CORS policies
  const videoUrl = performance.url;
  
  // Extract GoFile ID if the URL is from GoFile
  const getGoFileEmbedUrl = (url: string): string => {
    // Check if it's already a GoFile embed URL
    if (url.includes('gofile.io/embed')) {
      return url;
    }
    
    // Try to extract the content ID from a GoFile URL
    const gofileRegex = /gofile\.io\/d\/([a-zA-Z0-9]+)/;
    const match = url.match(gofileRegex);
    if (match && match[1]) {
      return `https://gofile.io/embed/${match[1]}`;
    }
    
    // Return the original URL if it doesn't match
    return url;
  };

  const handleVote = async (rating: number) => {
    playClickSound();
    
    if (!isLoggedIn) {
      toast.error("Please login to vote.");
      return;
    }
    
    if (!canVoteFor(performance.id)) {
      toast.error("You've already voted for this performance today.");
      return;
    }
    
    if (votesRemaining <= 0) {
      toast.error("No votes remaining today.");
      return;
    }
    
    // Record the vote locally
    if (!recordVote(performance.id)) {
      return;
    }
    
    try {
      const performanceRef = doc(db, 'performances', performance.id);
      await updateDoc(performanceRef, {
        votes: increment(1)
      });
      
      toast.success(`You gave this performance ${rating} stars!`);
    } catch (error: any) {
      console.error('Voting error:', error);
      toast.error(error.message || "Could not record your vote.");
    }
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      // Pause all other videos when playing this one
      document.querySelectorAll('video').forEach((video) => {
        if (video !== videoRef.current) {
          video.pause();
        }
      });
      
      videoRef.current.play().catch(error => {
        console.error('Video playback error:', error);
        toast.error("Could not play video. Try again.");
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const embedUrl = getGoFileEmbedUrl(videoUrl);
  const isEmbedVideo = embedUrl !== videoUrl;

  return (
    <div 
      className={`bg-black/40 rounded-xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-xl
        ${isLeader ? 'sm:col-span-2 md:col-span-1 border border-karaoke-yellow' : ''}`}
    >
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-bold truncate">{performance.title}</h3>
          <div className="bg-karaoke-pink/20 px-2 py-0.5 rounded-full text-xs">
            {performance.votes} votes
          </div>
        </div>
        
        {performance.photo_url && (
          <img 
            src={performance.photo_url} 
            alt={performance.title} 
            className="w-full h-24 object-cover rounded-lg mb-2"
          />
        )}
        
        <div className="mb-2 relative">
          {isEmbedVideo ? (
            <iframe 
              src={embedUrl} 
              className="w-full h-24 rounded-lg"
              allowFullScreen
              title={performance.title}
            ></iframe>
          ) : (
            <>
              <video 
                ref={videoRef}
                poster={performance.photo_url} 
                className="w-full h-24 object-cover rounded-lg"
                preload="none"
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support video playback.
              </video>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  onClick={handlePlayPause}
                  className="bg-black/50 p-2 rounded-full hover:bg-karaoke-pink/50 transition-colors"
                >
                  {isPlaying ? 
                    <Pause className="h-6 w-6 text-white" /> : 
                    <Play className="h-6 w-6 text-white" />
                  }
                </button>
                
                {isPlaying && (
                  <button 
                    onClick={handleMuteToggle}
                    className="absolute bottom-1 right-1 bg-black/50 p-1 rounded-full hover:bg-karaoke-pink/50 transition-colors"
                  >
                    <VolumeX className={`h-4 w-4 text-white ${!isMuted && 'text-karaoke-yellow'}`} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        
        <div className="flex flex-col">
          <p className="text-xs text-white/70 mb-1">By: {performance.uploader_name}</p>
          
          <div className="flex items-center justify-between mt-1">
            <div className="text-xs">Rate:</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  onClick={() => handleVote(star)}
                  disabled={!isLoggedIn || !canVoteFor(performance.id) || votesRemaining <= 0}
                  className={`transition-transform hover:scale-110 ${
                    isLoggedIn && canVoteFor(performance.id) && votesRemaining > 0 
                      ? 'cursor-pointer' 
                      : 'cursor-not-allowed opacity-50'
                  }`}
                  aria-label={`Rate ${star} stars`}
                >
                  <Star className="h-4 w-4 text-karaoke-yellow fill-karaoke-yellow/40 hover:fill-karaoke-yellow" />
                </button>
              ))}
            </div>
          </div>
          
          {!isLoggedIn ? (
            <p className="text-xs text-white/50 mt-1 italic text-right">Login to vote</p>
          ) : !canVoteFor(performance.id) ? (
            <p className="text-xs text-white/50 mt-1 italic text-right">Already voted</p>
          ) : votesRemaining <= 0 ? (
            <p className="text-xs text-white/50 mt-1 italic text-right">Vote limit reached</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PerformanceCard;
