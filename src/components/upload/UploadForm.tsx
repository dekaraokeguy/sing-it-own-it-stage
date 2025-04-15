
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { FileUploadBox } from './FileUploadBox';
import { WhatsAppInput } from './WhatsAppInput';
import { toast } from 'sonner';
import { playClickSound } from '@/utils/soundEffects';
import { storage, db } from '@/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { UploadFormData } from '@/types/upload.types';

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_PHOTO_SIZE = 5 * 1024 * 1024;  // 5MB

export const UploadForm: React.FC = () => {
  const [formData, setFormData] = useState<UploadFormData>({
    whatsappNumber: '',
    title: '',
    videoFile: null,
    photoFile: null
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    
    if (!formData.whatsappNumber || !formData.title || !formData.videoFile) {
      toast.error("Please fill in all required fields.");
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
      
      toast.success("Your performance has been uploaded and will be reviewed shortly.");
      
      // Reset form
      setFormData({
        whatsappNumber: '',
        title: '',
        videoFile: null,
        photoFile: null
      });
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || "There was an error uploading your performance.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert className="mb-6 border-karaoke-yellow bg-black/40">
        <AlertCircle className="h-4 w-4 text-karaoke-yellow" />
        <AlertTitle className="text-karaoke-yellow">Important</AlertTitle>
        <AlertDescription className="text-white/80">
          Enter your WhatsApp number to log in and upload your performance to Sing It Own It!
        </AlertDescription>
      </Alert>
      
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
        {isUploading ? "Uploading..." : "Upload Performance"}
      </Button>
    </form>
  );
};
