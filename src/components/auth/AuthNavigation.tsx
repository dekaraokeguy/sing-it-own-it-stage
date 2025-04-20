
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LogIn, LogOut, UserCircle } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { logout } from '@/services/auth';
import { playClickSound } from '@/utils/soundEffects';

const AuthNavigation: React.FC = () => {
  const { isLoggedIn, user, phoneNumber } = useAuth();
  
  const handleLogout = async () => {
    playClickSound();
    const result = await logout();
    if (!result.error) {
      toast.success('Logged out successfully');
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
              <UserCircle className="h-6 w-6 text-karaoke-yellow" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-black/80 text-white border-karaoke-pink">
            <DropdownMenuLabel>
              {user?.email || phoneNumber || 'My Account'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem 
              className="cursor-pointer hover:bg-karaoke-purple/30"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          asChild
          variant="outline" 
          size="sm"
          className="border-karaoke-yellow text-karaoke-yellow hover:bg-karaoke-yellow/20"
          onClick={playClickSound}
        >
          <Link to="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Link>
        </Button>
      )}
    </div>
  );
};

export default AuthNavigation;
