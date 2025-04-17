
import React from 'react';
import { QRCode } from 'react-qrcode-logo';
import { Button } from '@/components/ui/button';
import { Share, Download, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { playClickSound } from '@/utils/soundEffects';

interface QRShareBoxProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
}

const QRShareBox: React.FC<QRShareBoxProps> = ({
  url = window.location.href,
  title = "Sing It Own It",
  description = "Scan to share this app with your friends",
  className
}) => {
  const handleShare = async () => {
    playClickSound();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out ${title}!`,
          url: url,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(url)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  const handleDownloadQR = () => {
    playClickSound();
    
    // Create a temporary canvas to download the QR code
    const canvas = document.querySelector(`#qr-box-${title.replace(/\s+/g, '-').toLowerCase()} canvas`) as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("QR code downloaded!");
    } else {
      toast.error("Could not download QR code");
    }
  };

  return (
    <div className={`bg-black/40 p-4 rounded-lg text-center ${className}`}>
      <h3 className="text-lg font-semibold mb-3 flex items-center justify-center">
        <QrCode className="mr-2 h-4 w-4" />
        {title}
      </h3>
      
      <div 
        id={`qr-box-${title.replace(/\s+/g, '-').toLowerCase()}`} 
        className="w-32 h-32 mx-auto mb-3 bg-white p-2 rounded-lg"
      >
        <QRCode 
          value={url}
          size={112}
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="L"
          qrStyle="dots"
        />
      </div>
      
      <p className="text-sm my-3">{description}</p>
      
      <div className="flex flex-wrap gap-2 justify-center">
        <Button 
          onClick={handleShare}
          variant="outline"
          className="border-karaoke-yellow text-karaoke-yellow hover:bg-karaoke-yellow/20"
          size="sm"
        >
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
        
        <Button 
          onClick={handleDownloadQR}
          variant="outline"
          className="border-karaoke-pink text-karaoke-pink hover:bg-karaoke-pink/20"
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Download QR
        </Button>
      </div>
    </div>
  );
};

export default QRShareBox;
