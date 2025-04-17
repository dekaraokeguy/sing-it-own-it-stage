
import React from 'react';
import { QRCode } from 'react-qrcode-logo';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share, Download, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { playClickSound } from '@/utils/soundEffects';

interface QRShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
  title?: string;
}

const QRShareModal: React.FC<QRShareModalProps> = ({
  isOpen,
  onClose,
  url = window.location.href,
  title = "Sing It Own It"
}) => {
  const handleShare = async () => {
    playClickSound();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out ${title} on Sing It Own It!`,
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
    const canvas = document.querySelector('#qr-canvas canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `sing-it-own-it-qr-${Date.now()}.png`;
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gradient-to-b from-karaoke-purple/80 to-black/90 border-karaoke-yellow text-white">
        <DialogHeader>
          <DialogTitle className="text-center font-bold text-xl text-karaoke-yellow">
            <div className="flex items-center justify-center">
              <QrCode className="mr-2 h-5 w-5" />
              Scan to Share This App
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 p-4">
          <div id="qr-canvas" className="bg-white p-4 rounded-lg">
            <QRCode 
              value={url}
              size={200}
              bgColor="#FFFFFF"
              fgColor="#000000"
              ecLevel="L"
              qrStyle="dots"
            />
          </div>
          
          <p className="text-white/80 text-center text-sm">
            Scan this QR code to open the app on another device!
          </p>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleShare}
              className="bg-karaoke-yellow hover:bg-karaoke-yellow/80 text-black"
            >
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            
            <Button 
              onClick={handleDownloadQR}
              variant="outline" 
              className="border-karaoke-pink text-karaoke-pink hover:bg-karaoke-pink/20"
            >
              <Download className="mr-2 h-4 w-4" />
              Download QR
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRShareModal;
