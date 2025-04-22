
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LogIn, LogOut } from 'lucide-react';
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
          <Button 
            variant="destructive" 
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      ) : (
        <Button 
          asChild
          variant="default" 
          size="sm"
          className="bg-karaoke-yellow text-black hover:bg-karaoke-yellow/80"
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
