
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const { isLoggedIn, phoneNumber } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    playClickSound();
    try {
      const result = await logout();
      if (!result.error) {
        toast.success('Logged out successfully');
        // Force navigation to home page after logout
        navigate('/');
      } else {
        toast.error('Failed to logout: ' + result.error);
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('An unexpected error occurred during logout');
    }
  };
  
  const handleLoginClick = () => {
    playClickSound();
  };
  
  return (
    <div className="flex items-center space-x-2">
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <span className="text-karaoke-yellow text-sm hidden sm:inline">
            Signed in: {phoneNumber || 'User'}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-karaoke-pink bg-black/50">
                <UserCircle className="h-5 w-5 mr-2 text-karaoke-yellow" />
                <span className="text-white">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 text-white border-karaoke-pink">
              <DropdownMenuLabel>
                {phoneNumber || 'My Account'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-karaoke-purple/30 flex items-center"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button 
          asChild
          variant="outline" 
          size="sm"
          className="border-karaoke-yellow text-karaoke-yellow hover:bg-karaoke-yellow/20"
          onClick={handleLoginClick}
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
