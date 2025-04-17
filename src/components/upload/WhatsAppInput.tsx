
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Phone, LogIn } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { loginAnonymously, logout } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { playClickSound } from '@/utils/soundEffects';

interface WhatsAppInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const WhatsAppInput: React.FC<WhatsAppInputProps> = ({ value, onChange }) => {
  const { user, isLoggedIn, updatePhoneNumber } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleQuickLogin = async () => {
    playClickSound();
    
    if (!value || value.trim().length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (!isLoggedIn) {
        // Login anonymously first
        const result = await loginAnonymously();
        
        if (result.user) {
          // Store phone number with user
          await updatePhoneNumber(value);
          toast.success("Logged in successfully!");
        } else {
          toast.error(result.error || "Login failed");
        }
      } else {
        // Update phone number for existing user
        await updatePhoneNumber(value);
        toast.success("Phone number updated!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = async () => {
    playClickSound();
    await logout();
    onChange("");
  };

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
              <Button 
                type="button" 
                className="bg-green-500 hover:bg-green-600 p-2 rounded-l-none"
                onClick={handleQuickLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-6 w-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                ) : isLoggedIn ? (
                  <img 
                    src="/lovable-uploads/721a2af9-55db-4eea-804a-766b032c872b.png" 
                    alt="WhatsApp" 
                    className="h-6 w-6"
                  />
                ) : (
                  <LogIn className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isLoggedIn 
                  ? "Update your WhatsApp number"
                  : "Quick login with WhatsApp number"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {isLoggedIn && (
        <div className="flex justify-between items-center">
          <p className="text-xs text-karaoke-yellow">
            Logged in {user?.isAnonymous ? 'anonymously' : ''}
          </p>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={handleLogout} 
            className="text-xs text-white/70 hover:text-white"
          >
            Sign out
          </Button>
        </div>
      )}
    </div>
  );
};
