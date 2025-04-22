
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageLayout from '@/components/Layout/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { WhatsAppInput } from '@/components/upload/WhatsAppInput';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { playClickSound } from '@/utils/soundEffects';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        navigate('/');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    
    if (!whatsappNumber || whatsappNumber.length < 5) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Store in localStorage for now (this will be replaced with proper auth later)
      localStorage.setItem('phone_number', whatsappNumber);
      
      toast.success("Login Successful");
      setShowSuccess(true);
      
      // Short delay before navigating
      setTimeout(() => {
        navigate('/');
        // Force reload to update auth state across the app
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Could not log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-karaoke-purple via-karaoke-blue to-black text-white p-4">
        <div className="max-w-md mx-auto pt-16">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/f7911802-f5a5-4147-aefa-1fa881d7c4f8.png" 
              alt="Sing It Own It" 
              className="h-24 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back!</h1>
            <p>Login to upload performances and vote for your favorites</p>
          </div>
          
          {showSuccess ? (
            <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-500">Login Successful!</CardTitle>
                <CardDescription>You are now signed in</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="border-green-500 bg-green-900/20">
                  <AlertCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-500">Success</AlertTitle>
                  <AlertDescription className="text-white/80">
                    Redirecting you to the home page...
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Link to="/" className="w-full">
                  <Button 
                    className="w-full bg-karaoke-pink hover:bg-karaoke-pink/80 mt-4"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go to Home Page
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle className="text-karaoke-yellow">Sign In</CardTitle>
                  <CardDescription>Login with your WhatsApp number</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <WhatsAppInput 
                      value={whatsappNumber} 
                      onChange={setWhatsappNumber}
                    />
                    <div className="text-xs text-white/70 mt-2">
                      Login with your WhatsApp number for quick access
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit"
                    className="w-full bg-karaoke-pink hover:bg-karaoke-pink/80"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login / Sign Up'}
                  </Button>
                  <p className="text-xs text-white/60">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </p>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;
