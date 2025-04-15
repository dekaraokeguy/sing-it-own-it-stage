
import React from 'react';
import { Play, Star, User } from 'lucide-react';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { toast } from 'sonner';
import { Performance } from '@/firebase/firestore';

interface PerformanceCardProps {
  performance: Performance;
  isLoggedIn: boolean;
  canVoteFor: (id: string) => boolean;
  votesRemaining: number;
  recordVote: (id: string) => boolean;
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  performance,
  isLoggedIn,
  canVoteFor,
  votesRemaining,
  recordVote,
}) => {
  const handleVote = async (videoId: string, rating: number) => {
    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please login with your phone number to vote.",
        variant: "destructive"
      });
      return;
    }
    
    if (!canVoteFor(videoId)) {
      toast({
        title: "Already Voted",
        description: "You've already voted for this performance today.",
        variant: "destructive"
      });
      return;
    }
    
    if (!recordVote(videoId)) {
      return;
    }
    
    try {
      const performanceRef = doc(db, 'performances', videoId);
      await updateDoc(performanceRef, {
        votes: increment(1)
      });
      
      toast({
        title: "Vote Recorded!",
        description: `You gave this performance ${rating} stars.`,
      });
    } catch (error: any) {
      console.error('Voting error:', error);
      toast({
        title: "Voting Failed",
        description: error.message || "Could not record your vote. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-black/40 rounded-xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="p-3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-bold truncate">{performance.title}</h3>
          <div className="bg-karaoke-pink/20 px-2 py-0.5 rounded-full text-xs">
            {performance.votes} votes
          </div>
        </div>
        
        <div className="relative mb-2">
          <img 
            src={performance.photo_url} 
            alt={performance.title} 
            className="w-full h-32 object-cover rounded-lg"
          />
          <a 
            href={performance.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 hover:opacity-100 transition-opacity"
          >
            <Play className="h-12 w-12 text-white" />
          </a>
        </div>
        
        <div className="flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-white/70" />
          <p className="text-xs text-white/90">{performance.uploader_name}</p>
        </div>
        
        <div className="flex flex-col">                    
          <div className="flex items-center justify-between mt-1">
            <div className="text-xs">Rate:</div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star}
                  onClick={() => handleVote(performance.id, star)}
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
