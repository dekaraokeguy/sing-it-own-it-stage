
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
  const { isLoggedIn, phoneNumber } = useAuth();
  
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        navigate('/');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, navigate]);

  // Set initial whatsapp number if logged in
  useEffect(() => {
    if (phoneNumber) {
      setWhatsappNumber(phoneNumber);
    }
  }, [phoneNumber]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    
    if (!whatsappNumber || whatsappNumber.length < 5) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      localStorage.setItem('phone_number', whatsappNumber);
      toast.success("Login Successful!");
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);
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
          {showSuccess ? (
            <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-500">Login Successful!</CardTitle>
                <CardDescription>Welcome back, {whatsappNumber}!</CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="border-green-500 bg-green-900/20">
                  <AlertCircle className="h-4 w-4 text-green-500" />
                  <AlertTitle className="text-green-500">Success</AlertTitle>
                  <AlertDescription className="text-white/80">
                    Taking you to the home page...
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle className="text-karaoke-yellow">Sign In</CardTitle>
                  <CardDescription>Enter your WhatsApp number to continue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <WhatsAppInput 
                      value={whatsappNumber} 
                      onChange={setWhatsappNumber}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit"
                    className="w-full bg-karaoke-pink hover:bg-karaoke-pink/80 font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In / Sign Up'}
                  </Button>
                  <Button 
                    variant="link" 
                    asChild 
                    className="text-white/60"
                  >
                    <Link to="/">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Home
                    </Link>
                  </Button>
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
