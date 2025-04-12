
import React, { useState } from 'react';
import { BookOpen, Download, Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageLayout from '@/components/Layout/PageLayout';

// Mock data until connected to Supabase
const mockSongbooks = [
  { id: '1', title: 'Top 100 Caribbean Hits', file_url: '#', uploaded_at: '2024-04-01' },
  { id: '2', title: 'R&B Classics Collection', file_url: '#', uploaded_at: '2024-03-15' },
  { id: '3', title: 'Pop Hits 2023', file_url: '#', uploaded_at: '2024-02-20' },
  { id: '4', title: 'Country Favorites', file_url: '#', uploaded_at: '2024-01-10' },
  { id: '5', title: 'Old School Hip-Hop', file_url: '#', uploaded_at: '2023-12-25' },
];

const Songbooks = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "File Required",
        description: "Please select a file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    if (!title) {
      toast({
        title: "Title Required",
        description: "Please enter a title for the songbook.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // This would connect to Supabase Storage and DB in the real implementation
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Upload Successful!",
        description: "Your songbook has been uploaded.",
      });
      
      // Clear form
      setTitle('');
      setFile(null);
      
      // Reset file input field
      const fileInput = document.getElementById('songbook-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }, 2000);
  };

  const handleDownload = (title: string) => {
    toast({
      title: "Download Started",
      description: `${title} is downloading...`,
    });
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-karaoke-blue via-karaoke-purple to-black text-white p-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold gradient-text mb-2">Karaoke Songbooks</h1>
            <p className="text-xl">Browse and download songbooks for your next karaoke session</p>
          </div>
          
          <Tabs defaultValue="browse">
            <div className="bg-black/40 rounded-xl shadow-lg p-6">
              <TabsList className="grid w-full grid-cols-2 bg-black/30">
                <TabsTrigger value="browse" className="data-[state=active]:bg-karaoke-purple text-white">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Songbooks
                </TabsTrigger>
                <TabsTrigger value="upload" className="data-[state=active]:bg-karaoke-pink text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Songbook
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="browse" className="mt-4">
                <div className="space-y-4">
                  {mockSongbooks.map((songbook) => (
                    <div 
                      key={songbook.id}
                      className="flex items-center justify-between bg-black/30 p-4 rounded-lg hover:bg-black/40 transition-colors"
                    >
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-karaoke-yellow mr-4" />
                        <div>
                          <h3 className="font-medium">{songbook.title}</h3>
                          <p className="text-sm text-white/70">Uploaded: {songbook.uploaded_at}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(songbook.title)}
                        className="text-karaoke-yellow border-karaoke-yellow hover:bg-karaoke-yellow/20"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                  
                  {mockSongbooks.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-16 w-16 text-white/50 mx-auto mb-4" />
                      <p className="text-xl">No songbooks available yet.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="upload" className="mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="songbook-title" className="block text-sm font-medium">
                      Songbook Title
                    </label>
                    <input
                      id="songbook-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a descriptive title"
                      className="w-full px-4 py-2 bg-black/40 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-karaoke-pink text-white"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="songbook-upload" className="block text-sm font-medium">
                      Songbook File
                    </label>
                    <input
                      id="songbook-upload"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt"
                      className="w-full px-4 py-2 bg-black/40 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-karaoke-pink text-white file:bg-karaoke-pink file:text-white file:border-0 file:rounded-md"
                      required
                    />
                    <p className="text-xs text-white/70">Supported formats: PDF, DOC, DOCX, TXT</p>
                  </div>
                  
                  {file && (
                    <div className="p-3 bg-karaoke-purple/20 rounded-lg">
                      <p className="font-medium">Selected file: {file.name}</p>
                      <p className="text-sm text-white/70">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <Button 
                      type="submit" 
                      className="w-full bg-karaoke-pink hover:bg-karaoke-pink/90 text-white font-bold py-3"
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload Songbook"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </div>
          </Tabs>
          
          <div className="mt-8 bg-black/40 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">About Our Songbooks</h2>
            <div className="space-y-3 text-white/90">
              <p>
                Browse our collection of curated songbooks featuring lyrics to the most popular karaoke songs. 
                These songbooks are perfect for practicing before your next performance or for hosting your own karaoke night!
              </p>
              <p>
                Feel free to upload your own songbooks to share with the community. All uploads will be reviewed before being made public.
              </p>
              <p className="text-karaoke-yellow">
                Remember: "No Shame If Yuh Buss" - The stage is yours to own!
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Songbooks;
