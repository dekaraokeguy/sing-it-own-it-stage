
import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QRCodeShareProps {
  videoId?: string;
  videoTitle?: string;
  appUrl?: string;
}

const QRCodeShare: React.FC<QRCodeShareProps> = ({ 
  videoId, 
  videoTitle, 
  appUrl = window.location.origin 
}) => {
  const shareUrl = videoId ? `${window.location.origin}/performances/${videoId}` : appUrl;
  
  // In a real implementation, we would use a library like qrcode.react here
  const generateQRPlaceholder = () => {
    // This is a placeholder for the actual QR code
    return (
      <div className="w-32 h-32 bg-white p-2 rounded-lg mx-auto">
        <div className="w-full h-full border-2 border-karaoke-purple grid grid-cols-3 grid-rows-3 gap-1 p-2">
          <div className="bg-black" />
          <div className="bg-black" />
          <div className="bg-black" />
          <div className="bg-black" />
          <div className="bg-white" />
          <div className="bg-black" />
          <div className="bg-black" />
          <div className="bg-black" />
          <div className="bg-black" />
        </div>
      </div>
    );
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: videoTitle || "Sing It Own It",
        text: videoTitle ? `Check out this karaoke performance: ${videoTitle}` : "Check out the Sing It Own It app!",
        url: shareUrl,
      })
      .then(() => toast.success("Shared successfully!"))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  return (
    <div className="bg-black/40 p-4 rounded-lg text-center">
      <h3 className="text-lg font-semibold mb-3">Share This App</h3>
      
      {generateQRPlaceholder()}
      
      <p className="text-sm my-3">Scan this QR code to open the app!</p>
      
      <Button 
        onClick={handleShare}
        variant="outline"
        className="border-karaoke-yellow text-karaoke-yellow hover:bg-karaoke-yellow/20"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share App
      </Button>
    </div>
  );
};

export default QRCodeShare;
