
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/Layout/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { WhatsAppInput } from '@/components/upload/WhatsAppInput';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  
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
          
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
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
            <CardFooter className="flex flex-col items-center">
              <p className="text-xs text-white/60 mt-4">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;
