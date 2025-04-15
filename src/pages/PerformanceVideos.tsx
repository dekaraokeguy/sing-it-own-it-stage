
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useVoteLimiter } from '@/hooks/useVoteLimiter';
import { playClickSound } from '@/utils/soundEffects';
import PageLayout from '@/components/Layout/PageLayout';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import PerformanceCard from '@/components/performance/PerformanceCard';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Performance } from '@/firebase/firestore';

const PerformanceVideos = () => {
  const { isLoggedIn } = useFirebaseAuth();
  const [videos, setVideos] = useState<Performance[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { votesRemaining, recordVote, canVoteFor } = useVoteLimiter();

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        setIsLoading(true);
        const performancesQuery = query(
          collection(db, 'performances'),
          orderBy('created_at', 'desc')
        );
        
        const querySnapshot = await getDocs(performancesQuery);
        const performancesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Performance[];
        
        setVideos(performancesData);
      } catch (error) {
        console.error('Error fetching performances:', error);
        
        // Fall back to mock data if API fails
        setVideos([
          { 
            id: '1', 
            title: 'Electric Slide Karaoke Performance', 
            url: 'https://example.com/video1.mp4', 
            uploader_name: 'Jane123', 
            votes: 25,
            photo_url: '/lovable-uploads/624dcf17-1dd5-4d12-a2b7-3f1661f35717.png',
            created_at: new Date()
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPerformances();
  }, []);

  // Filter videos by search term
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    video.uploader_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort videos by votes in descending order
  const sortedVideos = [...filteredVideos].sort((a, b) => b.votes - a.votes);

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-karaoke-purple via-karaoke-pink to-black text-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/128efdba-cc64-44d0-a015-719d38b0c501.png" 
              alt="Sing It Own It" 
              className="h-32 mx-auto mb-4"
            />
            <p className="text-xl">Browse all performance videos!</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="md:w-2/3">
              {!isLoggedIn && (
                <div className="bg-black/40 p-6 rounded-xl shadow-lg mb-4">
                  <h2 className="text-xl font-bold mb-4">Login to Vote</h2>
                  <div className="flex">
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
                            onClick={() => playClickSound()}
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
              <QRCodeGenerator 
                url={window.location.href}
                title="Share Performance Videos"
                description="Scan to browse all karaoke performances"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-karaoke-pink"></div>
              <p className="mt-4 text-xl">Loading performances...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedVideos.map((video) => (
                <PerformanceCard
                  key={video.id}
                  performance={video}
                  isLoggedIn={isLoggedIn}
                  canVoteFor={canVoteFor}
                  votesRemaining={votesRemaining}
                  recordVote={recordVote}
                />
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
        </div>
      </div>
    </PageLayout>
  );
};

export default PerformanceVideos;
