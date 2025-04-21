import React, { useState, useEffect } from 'react';
import { Star, Trophy, Search, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PageLayout from '@/components/Layout/PageLayout';
import { Input } from '@/components/ui/input';
import { useVoteLimiter } from '@/hooks/useVoteLimiter';
import QRShareBox from '@/components/QRShareBox';
import { playClickSound } from '@/utils/soundEffects';
import { collection, getDocs, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Performance {
  id: string;
  title: string;
  url: string;
  uploader: string;
  votes: number;
  photo_url: string;
}

const Performances = () => {
  const { isLoggedIn, user } = useFirebaseAuth();
  const [videos, setVideos] = useState<Performance[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { votesRemaining, nextVoteTime, recordVote, canVoteFor } = useVoteLimiter();
  
  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        setIsLoading(true);
        const performancesQuery = query(
          collection(db, 'performances'),
          orderBy('votes', 'desc')
        );
        
        const querySnapshot = await getDocs(performancesQuery);
        const performancesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title || doc.data().song_title,
          url: doc.data().url || doc.data().video_url,
          uploader: doc.data().uploader_name,
          votes: doc.data().votes || 0,
          photo_url: doc.data().photo_url || doc.data().thumbnail_url || '/lovable-uploads/624dcf17-1dd5-4d12-a2b7-3f1661f35717.png'
        }));
        
        setVideos(performancesData);
      } catch (error) {
        console.error('Error fetching performances:', error);
        toast.error("Could not load performances. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPerformances();
  }, []);

  const handleLogin = async () => {
    playClickSound();
    
    if (!phoneNumber || phoneNumber.length < 5) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    
    try {
      localStorage.setItem('phone_number', phoneNumber);
      toast.success("Login Successful");
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Could not log in. Please try again.");
    }
  };

  const handleVote = async (videoId: string, rating: number) => {
    playClickSound();
    
    if (!isLoggedIn) {
      toast.error("Please login with your phone number to vote.");
      return;
    }
    
    if (!canVoteFor(videoId)) {
      toast.error("You've already voted for this performance today.");
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
      
      setVideos(prevVideos => 
        prevVideos.map(video => 
          video.id === videoId 
            ? { ...video, votes: video.votes + 1 } 
            : video
        )
      );
      
      toast.success(`You gave this performance ${rating} stars.`);
    } catch (error: any) {
      console.error('Voting error:', error);
      toast.error(error.message || "Could not record your vote. Please try again.");
    }
  };

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    video.uploader.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedVideos = [...filteredVideos].sort((a, b) => b.votes - a.votes);

  return (
    <PageLayout fullWidth>
      <div className="min-h-screen bg-gradient-to-b from-karaoke-blue via-karaoke-purple to-black text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/128efdba-cc64-44d0-a015-719d38b0c501.png" 
              alt="Sing It Own It Countdown" 
              className="h-32 mx-auto mb-4"
            />
            <p className="text-xl">Vote for your favorite performances!</p>
          </div>

          <div className="w-full flex flex-col md:flex-row md:justify-end mb-6 gap-4">
            <div className="mx-auto md:mx-0 w-full max-w-xs">
              <QRShareBox 
                url={window.location.origin + '/performances'}
                title="Share Sing It Own It Countdown"
                description="Scan to view & vote the karaoke countdown!"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="md:w-2/3">
              {!isLoggedIn && (
                <div className="bg-black/40 p-6 rounded-xl shadow-lg mb-4">
                  <h2 className="text-xl font-bold mb-4">Login to Vote</h2>
                  <div className="flex mb-4">
                    <Input 
                      type="tel" 
                      placeholder="Enter your phone number" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-grow px-4 py-2 bg-black/40 border border-white/30 rounded-l-md focus:outline-none focus:ring-2 focus:ring-karaoke-pink text-white"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            onClick={handleLogin}
                            className="bg-green-500 hover:bg-green-600 rounded-l-none flex items-center"
                          >
                            Login
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Login with your phone number to vote for performances!</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              )}
              
              {isLoggedIn && (
                <div className="bg-black/40 p-4 rounded-xl shadow-lg mb-4 flex flex-col sm:flex-row items-center justify-between">
                  <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                    <div className="bg-karaoke-pink/20 px-3 py-1 rounded-full">
                      <span className="text-karaoke-pink font-medium">{votesRemaining}</span> votes remaining today
                    </div>
                    
                    {nextVoteTime && (
                      <div className="flex items-center text-sm text-white/70">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Next vote in: {formatTimeUntil(nextVoteTime)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white"
                    onClick={() => {
                      localStorage.removeItem('phone_number');
                      window.location.reload();
                    }}
                  >
                    Logout
                  </Button>
                </div>
              )}
              
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input 
                  type="text"
                  placeholder="Search performances or uploaders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/40 border-white/20 text-white"
                />
              </div>
            </div>
            
            <div className="md:w-1/3">
              <QRShareBox />
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-karaoke-pink"></div>
              <p className="mt-4 text-xl">Loading performances...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedVideos.map((video, index) => (
                <div 
                  key={video.id} 
                  className={`bg-black/40 rounded-xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-xl
                    ${index === 0 ? 'sm:col-span-2 md:col-span-1 border border-karaoke-yellow' : ''}`}
                >
                  {index === 0 && (
                    <div className="bg-karaoke-yellow text-black py-1 px-4 flex items-center justify-center">
                      <Trophy className="h-4 w-4 mr-1" />
                      <span className="font-bold text-sm">Leader</span>
                    </div>
                  )}
                  
                  <div className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-bold truncate">{video.title}</h3>
                      <div className="bg-karaoke-pink/20 px-2 py-0.5 rounded-full text-xs">
                        {video.votes} votes
                      </div>
                    </div>
                    
                    {video.photo_url && (
                      <img 
                        src={video.photo_url} 
                        alt={video.title} 
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                    )}
                    
                    <div className="mb-2">
                      <video 
                        controls 
                        poster={video.photo_url} 
                        className="w-full h-24 object-cover rounded-lg"
                        preload="none"
                      >
                        <source src={video.url} type="video/mp4" />
                        Your browser does not support video playback.
                      </video>
                    </div>
                    
                    <div className="flex flex-col">
                      <p className="text-xs text-white/70 mb-1">By: {video.uploader}</p>
                      
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-xs">Rate:</div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button 
                              key={star}
                              onClick={() => handleVote(video.id, star)}
                              disabled={!isLoggedIn || !canVoteFor(video.id) || votesRemaining <= 0}
                              className={`transition-transform hover:scale-110 ${
                                isLoggedIn && canVoteFor(video.id) && votesRemaining > 0 
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
                      ) : !canVoteFor(video.id) ? (
                        <p className="text-xs text-white/50 mt-1 italic text-right">Already voted</p>
                      ) : votesRemaining <= 0 ? (
                        <p className="text-xs text-white/50 mt-1 italic text-right">Vote limit reached</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && sortedVideos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl">No performances found. {searchTerm ? 'Try a different search term.' : 'Be the first to upload!'}</p>
              <Button asChild className="mt-4 bg-karaoke-pink hover:bg-karaoke-pink/80">
                <a href="/upload">Upload Your Performance</a>
              </Button>
            </div>
          )}
          
          <div className="mt-8 border-t border-white/10 pt-8 opacity-70 hover:opacity-90 transition-opacity">
            <div className="text-center mb-2">
              <p className="text-sm text-white/50">Our Partners</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="text-center">
                <img 
                  src="/lovable-uploads/dad69e7c-a979-464e-b5dd-00a563b5a544.png" 
                  alt="Sponsor logo" 
                  className="h-12 mx-auto filter grayscale hover:grayscale-0 transition-all"
                />
                <p className="text-xs text-white/50 mt-1">Platinum Sponsor</p>
              </div>
              <div className="text-center">
                <img 
                  src="/lovable-uploads/8f07ad83-98c0-439b-bbd2-08b32ce62aaf.png" 
                  alt="Sponsor logo" 
                  className="h-10 mx-auto filter grayscale hover:grayscale-0 transition-all"
                />
                <p className="text-xs text-white/50 mt-1">Gold Sponsor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

const formatTimeUntil = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  if (diffMs <= 0) return 'now';
  
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffHrs > 0) {
    return `${diffHrs}h ${diffMins}m`;
  }
  return `${diffMins}m`;
};

export default Performances;
