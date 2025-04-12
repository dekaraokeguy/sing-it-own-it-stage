
import React, { useState } from 'react';
import { Upload, Camera, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/Layout/PageLayout';

const Upload = () => {
  const [userCode, setUserCode] = useState('');
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userCode || userCode.length !== 7) {
      toast({
        title: "Invalid Code",
        description: "Please enter your 7-digit login code.",
        variant: "destructive"
      });
      return;
    }
    
    if (!title) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your performance.",
        variant: "destructive"
      });
      return;
    }
    
    if (!videoFile) {
      toast({
        title: "Video Required",
        description: "Please select a video to upload.",
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
        description: "Your performance has been uploaded and will be reviewed shortly.",
      });
      
      // Clear form
      setUserCode('');
      setTitle('');
      setVideoFile(null);
      setPhotoFile(null);
      
      // Reset file input fields
      const videoInput = document.getElementById('video-upload') as HTMLInputElement;
      const photoInput = document.getElementById('photo-upload') as HTMLInputElement;
      if (videoInput) videoInput.value = '';
      if (photoInput) photoInput.value = '';
    }, 2000);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-karaoke-pink via-karaoke-purple to-black text-white p-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold gradient-text mb-2">Upload Your Performance</h1>
            <p className="text-xl">Share your karaoke moments with the world!</p>
          </div>
          
          <div className="bg-black/40 rounded-xl shadow-lg p-6">
            <Alert className="mb-6 border-karaoke-yellow bg-black/40">
              <AlertCircle className="h-4 w-4 text-karaoke-yellow" />
              <AlertTitle className="text-karaoke-yellow">Important</AlertTitle>
              <AlertDescription className="text-white/80">
                You need a 7-digit code from a karaoke event to upload. Get yours at the next Dean De Karaoke Guy event!
              </AlertDescription>
            </Alert>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="user-code" className="text-white">Your 7-Digit Code</Label>
                <Input
                  id="user-code"
                  type="text" 
                  maxLength={7}
                  placeholder="Enter your code" 
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="bg-black/40 border-white/30 text-white"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Performance Title</Label>
                <Input
                  id="title"
                  type="text" 
                  placeholder="Name your performance" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-black/40 border-white/30 text-white"
                  required
                />
              </div>
              
              <Separator className="bg-white/20" />
              
              <div className="space-y-2">
                <Label htmlFor="video-upload" className="text-white flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Video Upload (Required)
                </Label>
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="bg-black/40 border-white/30 text-white file:bg-karaoke-pink file:text-white file:border-0 file:rounded-md"
                  required
                />
                <p className="text-xs text-white/70">Supported formats: MP4, MOV, WebM (Max: 100MB)</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photo-upload" className="text-white flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  Thumbnail Image (Optional)
                </Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="bg-black/40 border-white/30 text-white file:bg-karaoke-blue file:text-white file:border-0 file:rounded-md"
                />
                <p className="text-xs text-white/70">Supported formats: JPG, PNG, WebP (Max: 5MB)</p>
              </div>
              
              {videoFile && (
                <div className="p-3 bg-karaoke-purple/20 rounded-lg">
                  <p className="font-medium">Selected video: {videoFile.name}</p>
                  <p className="text-sm text-white/70">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-karaoke-yellow to-karaoke-pink hover:from-karaoke-yellow/90 hover:to-karaoke-pink/90 text-white font-bold py-3"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload Performance"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-white/80 text-sm">
                By uploading, you agree to share your performance on the Sing It Own It platform.
                <br/>Your content will be reviewed before appearing in the countdown.
              </p>
            </div>
          </div>
          
          <div className="mt-8 bg-black/40 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">How It Works</h2>
            <ol className="list-decimal list-inside space-y-3 text-white/90">
              <li>Enter your 7-digit event code (received at a karaoke event)</li>
              <li>Upload your performance video</li>
              <li>Add an optional thumbnail image</li>
              <li>Wait for approval (usually within 24 hours)</li>
              <li>Share with friends and collect votes!</li>
            </ol>
            <p className="mt-4 text-karaoke-yellow">Top voted performances will be featured in our weekly "Sing It Own It Countdown"!</p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Upload;
