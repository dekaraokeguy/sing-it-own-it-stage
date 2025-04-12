
import React, { useState, useCallback } from 'react';
import { Upload as UploadIcon, Camera, AlertCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/Layout/PageLayout';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Maximum file size in bytes (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const UploadPage = () => {
  const [userCode, setUserCode] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const { toast } = useToast();
  
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File Too Large",
          description: "Video file must be under 50MB.",
          variant: "destructive"
        });
        return;
      }
      setVideoFile(file);
    }
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "File Too Large",
          description: "Image file must be under 5MB.",
          variant: "destructive"
        });
        return;
      }
      setPhotoFile(file);
    }
  };
  
  const handleVideoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingVideo(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('video/')) {
        toast({
          title: "Invalid File Type",
          description: "Please drop a video file.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File Too Large",
          description: "Video file must be under 50MB.",
          variant: "destructive"
        });
        return;
      }
      
      setVideoFile(file);
    }
  }, [toast]);
  
  const handlePhotoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingPhoto(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please drop an image file.",
          variant: "destructive"
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "File Too Large",
          description: "Image file must be under 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      setPhotoFile(file);
    }
  }, [toast]);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);
  
  const handleDragEnter = useCallback((e: React.DragEvent, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    e.preventDefault();
    setter(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    e.preventDefault();
    setter(false);
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const hasValidCode = userCode.length === 7;
    const hasValidWhatsapp = whatsappNumber.length >= 10;
    
    if (!hasValidCode && !hasValidWhatsapp) {
      toast({
        title: "Login Required",
        description: "Please enter your 7-digit code or WhatsApp number.",
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
      setWhatsappNumber('');
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
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="text-white flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  WhatsApp Number (Optional)
                </Label>
                <div className="flex">
                  <Input
                    id="whatsapp"
                    type="tel" 
                    placeholder="Enter your WhatsApp number" 
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="bg-black/40 border-white/30 text-white rounded-r-none"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button type="button" className="bg-green-500 hover:bg-green-600 p-2 rounded-l-none">
                          <img 
                            src="/lovable-uploads/721a2af9-55db-4eea-804a-766b032c872b.png" 
                            alt="WhatsApp" 
                            className="h-6 w-6"
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Using your WhatsApp number has benefits like updates, promotions, and more!</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Video Upload (Required)
                </Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
                    isDraggingVideo ? 'border-karaoke-yellow bg-karaoke-yellow/10' : 'border-white/30'
                  }`}
                  onDragEnter={(e) => handleDragEnter(e, setIsDraggingVideo)}
                  onDragLeave={(e) => handleDragLeave(e, setIsDraggingVideo)}
                  onDragOver={handleDragOver}
                  onDrop={handleVideoDrop}
                >
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                    <UploadIcon className="h-12 w-12 text-white/70 mb-2" />
                    <p className="text-center text-white/80">
                      {videoFile ? videoFile.name : "Drag & drop video here or click to browse"}
                    </p>
                    <p className="text-xs text-white/70 mt-1">Max size: 50MB</p>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photo-upload" className="text-white flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  Thumbnail Image (Optional)
                </Label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer ${
                    isDraggingPhoto ? 'border-karaoke-blue bg-karaoke-blue/10' : 'border-white/30'
                  }`}
                  onDragEnter={(e) => handleDragEnter(e, setIsDraggingPhoto)}
                  onDragLeave={(e) => handleDragLeave(e, setIsDraggingPhoto)}
                  onDragOver={handleDragOver}
                  onDrop={handlePhotoDrop}
                >
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center">
                    <Camera className="h-8 w-8 text-white/70 mb-1" />
                    <p className="text-center text-white/80">
                      {photoFile ? photoFile.name : "Drag & drop image here or click to browse"}
                    </p>
                    <p className="text-xs text-white/70 mt-1">Max size: 5MB</p>
                  </label>
                </div>
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
              <li>Enter your 7-digit event code (received at a karaoke event) or WhatsApp number</li>
              <li>Upload your performance video (max 50MB)</li>
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

export default UploadPage;
