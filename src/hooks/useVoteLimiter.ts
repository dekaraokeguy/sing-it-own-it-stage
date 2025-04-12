
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface VoteRecord {
  performanceId: string;
  timestamp: number;
}

const VOTES_PER_DAY = 2;
const HOURS_24_IN_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'karaoke_votes';

export const useVoteLimiter = () => {
  const [votesRemaining, setVotesRemaining] = useState<number>(VOTES_PER_DAY);
  const [voteHistory, setVoteHistory] = useState<VoteRecord[]>([]);
  const [nextVoteTime, setNextVoteTime] = useState<Date | null>(null);

  // Load vote history on component mount
  useEffect(() => {
    const loadVoteHistory = () => {
      try {
        const storedHistory = localStorage.getItem(STORAGE_KEY);
        if (storedHistory) {
          const parsedHistory: VoteRecord[] = JSON.parse(storedHistory);
          setVoteHistory(parsedHistory);
          
          // Filter out votes older than 24 hours
          const now = Date.now();
          const recentVotes = parsedHistory.filter(vote => 
            (now - vote.timestamp) < HOURS_24_IN_MS
          );
          
          setVoteHistory(recentVotes);
          setVotesRemaining(Math.max(0, VOTES_PER_DAY - recentVotes.length));
          
          // If votes are used up, calculate when next vote will be available
          if (recentVotes.length >= VOTES_PER_DAY && recentVotes.length > 0) {
            // Sort by timestamp (oldest first)
            const sortedVotes = [...recentVotes].sort((a, b) => a.timestamp - b.timestamp);
            const oldestVote = sortedVotes[0];
            const nextAvailableTime = new Date(oldestVote.timestamp + HOURS_24_IN_MS);
            setNextVoteTime(nextAvailableTime);
          } else {
            setNextVoteTime(null);
          }
          
          // Save the cleaned up history back to storage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(recentVotes));
        }
      } catch (error) {
        console.error("Error loading vote history:", error);
        // Reset if there's any error
        localStorage.removeItem(STORAGE_KEY);
        setVotesRemaining(VOTES_PER_DAY);
        setVoteHistory([]);
      }
    };
    
    loadVoteHistory();
    
    // Set up an interval to refresh the vote limits
    const intervalId = setInterval(loadVoteHistory, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, []);

  const recordVote = (performanceId: string): boolean => {
    // Check if already voted for this performance in the last 24h
    const hasVotedForPerformance = voteHistory.some(vote => 
      vote.performanceId === performanceId && 
      (Date.now() - vote.timestamp) < HOURS_24_IN_MS
    );
    
    if (hasVotedForPerformance) {
      toast.error("You have already voted for this performance");
      return false;
    }
    
    // Check if daily vote limit reached
    if (votesRemaining <= 0) {
      const timeUntilNextVote = nextVoteTime 
        ? `Available in ${formatTimeRemaining(nextVoteTime)}` 
        : "Try again tomorrow";
      
      toast.error(`Vote limit reached (${VOTES_PER_DAY} per day). ${timeUntilNextVote}`);
      return false;
    }
    
    // Record the new vote
    const newVote: VoteRecord = {
      performanceId,
      timestamp: Date.now()
    };
    
    const updatedHistory = [...voteHistory, newVote];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    setVoteHistory(updatedHistory);
    setVotesRemaining(Math.max(0, votesRemaining - 1));
    
    // If this was the last vote, calculate next available time
    if (votesRemaining === 1) {
      const nextAvailableTime = new Date(Date.now() + HOURS_24_IN_MS);
      setNextVoteTime(nextAvailableTime);
    }
    
    return true;
  };
  
  // Helper to format time remaining until next vote
  const formatTimeRemaining = (nextTime: Date): string => {
    const diff = nextTime.getTime() - Date.now();
    if (diff <= 0) return "now";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  return {
    votesRemaining,
    nextVoteTime,
    recordVote,
    canVoteFor: (performanceId: string): boolean => {
      // Check if already voted for this performance
      return !voteHistory.some(vote => 
        vote.performanceId === performanceId && 
        (Date.now() - vote.timestamp) < HOURS_24_IN_MS
      );
    }
  };
};
