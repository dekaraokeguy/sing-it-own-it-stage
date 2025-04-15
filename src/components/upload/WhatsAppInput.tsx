
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface WhatsAppInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const WhatsAppInput: React.FC<WhatsAppInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="whatsapp" className="text-white flex items-center gap-2">
        <Phone className="h-4 w-4" />
        WhatsApp Number
      </Label>
      <div className="flex">
        <Input
          id="whatsapp"
          type="tel" 
          placeholder="Enter your WhatsApp number" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-black/40 border-white/30 text-white rounded-r-none"
          required
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
              <p>Using your WhatsApp number gives you benefits like updates, promotions, and easier logins!</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
