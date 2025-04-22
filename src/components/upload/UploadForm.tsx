
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, UploadCloud } from 'lucide-react';
import { FileUploadBox } from './FileUploadBox';
import { WhatsAppInput } from './WhatsAppInput';
import { toast } from 'sonner';
import { playClickSound } from '@/utils/soundEffects';
import { storage, db } from '@/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { UploadFormData } from '@/types/upload.types';
import { useAuth } from '@/context/AuthContext';

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;  // 5MB

export const UploadForm: React.FC = () => {
  const { isLoggedIn, phoneNumber } = useAuth();
  const [formData, setFormData] = useState<UploadFormData>({
    whatsappNumber: phoneNumber || '',
    title: '',
    videoFile: null,
    photoFile: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    
    setUploadSuccess(false);
    setUploadError(null);
    
    if (!formData.whatsappNumber || !formData.title || !formData.videoFile) {
      setUploadError("Please fill in all required fields and select a video.");
      toast.error("Please fill in all required fields and select a video.");
      return;
    }
    
    if (!isLoggedIn) {
      setUploadError("You must be logged in to upload performances.");
      toast.error("You must be logged in to upload performances.");
      return;
    }
    
    setIsUploading(true);
    
    try {
      let userId;
      
      // Check if user exists in Firestore
      const usersRef = collection(db, 'users');
      const userQuery = doc(usersRef, formData.whatsappNumber);
      const userDoc = await getDoc(userQuery);
      
      if (userDoc.exists()) {
        userId = userDoc.id;
      } else {
        await setDoc(doc(db, 'users', formData.whatsappNumber), {
          whatsapp_number: formData.whatsappNumber,
          created_at: serverTimestamp()
        });
        userId = formData.whatsappNumber;
      }
      
      // Upload video
      const videoFileName = `performances/${userId}_${Date.now()}_${formData.videoFile.name.replace(/\s+/g, '_')}`;
      const videoStorageRef = ref(storage, videoFileName);
      await uploadBytes(videoStorageRef, formData.videoFile);
      const videoUrl = await getDownloadURL(videoStorageRef);
      
      let thumbnailUrl = null;
      
      // Upload thumbnail if provided
      if (formData.photoFile) {
        const photoFileName = `thumbnails/${userId}_${Date.now()}_${formData.photoFile.name.replace(/\s+/g, '_')}`;
        const photoStorageRef = ref(storage, photoFileName);
        await uploadBytes(photoStorageRef, formData.photoFile);
        thumbnailUrl = await getDownloadURL(photoStorageRef);
      }
      
      // Create performance record
      await addDoc(collection(db, 'performances'), {
        user_id: userId,
        song_title: formData.title,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        uploader_name: `User-${formData.whatsappNumber.slice(-4)}`,
        votes: 0,
        created_at: serverTimestamp()
      });
      
      setUploadSuccess(true);
      toast.success("Your performance has been uploaded and will be reviewed shortly!");
      
      // Reset form
      setFormData({
        whatsappNumber: phoneNumber || '',
        title: '',
        videoFile: null,
        photoFile: null
      });
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || "There was an error uploading your performance.");
      toast.error(error.message || "There was an error uploading your performance.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isLoggedIn && (
        <Alert className="mb-6 border-karaoke-yellow bg-black/40">
          <AlertCircle className="h-4 w-4 text-karaoke-yellow" />
          <AlertTitle className="text-karaoke-yellow">Login Required</AlertTitle>
          <AlertDescription className="text-white/80">
            You need to log in with your WhatsApp number to upload performances.
          </AlertDescription>
        </Alert>
      )}
      
      {uploadSuccess && (
        <Alert className="mb-6 border-green-500 bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-500">Upload Successful!</AlertTitle>
          <AlertDescription className="text-white/80">
            Your performance has been uploaded and will be reviewed shortly. Thank you!
          </AlertDescription>
        </Alert>
      )}
      
      {uploadError && (
        <Alert className="mb-6 border-red-500 bg-red-900/20">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-500">Upload Failed</AlertTitle>
          <AlertDescription className="text-white/80">
            {uploadError}
          </AlertDescription>
        </Alert>
      )}
      
      <WhatsAppInput
        value={formData.whatsappNumber}
        onChange={(value) => setFormData(prev => ({ ...prev, whatsappNumber: value }))}
      />
      
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white">Performance Title</Label>
        <Input
          id="title"
          type="text" 
          placeholder="Name your performance" 
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="bg-black/40 border-white/30 text-white"
          required
        />
      </div>
      
      <Separator className="bg-white/20" />
      
      <FileUploadBox
        id="video-upload"
        label="Video Upload (Required)"
        accept="video/*"
        maxSize={MAX_VIDEO_SIZE}
        file={formData.videoFile}
        onChange={(file) => setFormData(prev => ({ ...prev, videoFile: file }))}
      />
      
      <FileUploadBox
        id="photo-upload"
        label="Thumbnail Image (Optional)"
        accept="image/*"
        maxSize={MAX_PHOTO_SIZE}
        file={formData.photoFile}
        onChange={(file) => setFormData(prev => ({ ...prev, photoFile: file }))}
      />
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-karaoke-yellow to-karaoke-pink hover:from-karaoke-yellow/90 hover:to-karaoke-pink/90 text-white font-bold py-3"
        disabled={isUploading}
        onClick={() => playClickSound()}
      >
        {isUploading ? (
          <>
            <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin mr-2" />
            Uploading...
          </>
        ) : (
          <>
            <UploadCloud className="mr-2 h-5 w-5" />
            Upload Performance
          </>
        )}
      </Button>
      
      <div className="text-center text-sm text-white/60 mt-2">
        {isLoggedIn ? 
          "Your upload will be tied to your account." :
          "Please log in before uploading your performance."
        }
      </div>
    </form>
  );
};
