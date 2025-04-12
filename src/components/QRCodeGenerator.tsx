
import React, { useState, useEffect } from 'react';
import { Share2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { playClickSound } from '@/utils/soundEffects';

interface QRCodeGeneratorProps {
  url: string;
  title?: string;
  description?: string;
  size?: number;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  url, 
  title = "Share this performance", 
  description = "Scan this QR code to view and vote",
  size = 150
}) => {
  const [qrSrc, setQrSrc] = useState<string>('');
  
  useEffect(() => {
    // Generate QR code using Google Charts API
    const googleChartsUrl = `https://chart.googleapis.com/chart?cht=qr&chs=${size}x${size}&chl=${encodeURIComponent(url)}&choe=UTF-8`;
    setQrSrc(googleChartsUrl);
  }, [url, size]);
  
  const handleShare = () => {
    playClickSound();
    if (navigator.share) {
      navigator.share({
        title: title,
        text: description,
        url: url,
      })
      .then(() => toast.success("Shared successfully!"))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(url)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };
  
  const handleDownload = () => {
    playClickSound();
    const link = document.createElement('a');
    link.href = qrSrc;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded!");
  };
  
  return (
    <div className="bg-black/40 p-4 rounded-lg text-center">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      
      {qrSrc && (
        <div className="flex justify-center mb-3">
          <img 
            src={qrSrc} 
            alt="QR Code"
            className="bg-white p-2 rounded-lg"
            width={size}
            height={size}
          />
        </div>
      )}
      
      <p className="text-sm my-3">{description}</p>
      
      <div className="flex gap-2 justify-center">
        <Button 
          onClick={handleShare}
          variant="outline"
          className="border-karaoke-yellow text-karaoke-yellow hover:bg-karaoke-yellow/20"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        
        <Button 
          onClick={handleDownload}
          variant="outline"
          className="border-karaoke-pink text-karaoke-pink hover:bg-karaoke-pink/20"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
