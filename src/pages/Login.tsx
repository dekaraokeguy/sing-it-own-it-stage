
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/Layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loginWithSupabase, registerWithSupabase } from '@/services/auth';
import { toast } from 'sonner';
import { WhatsAppInput } from '@/components/upload/WhatsAppInput';
import { useAuth } from '@/context/AuthContext';
import { Mail, Key, Phone } from 'lucide-react';
import { playClickSound } from '@/utils/soundEffects';

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already logged in
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);
  
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await loginWithSupabase(email, password);
      if (result.user) {
        navigate('/');
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await registerWithSupabase(email, password);
      if (!result.error) {
        toast.success("Registration successful! Check your email for verification.");
      }
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
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
          
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-karaoke-yellow">Sign In</CardTitle>
              <CardDescription>Choose how you want to login</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="whatsapp" className="w-full">
                <TabsList className="grid grid-cols-2 w-full bg-black/40">
                  <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                </TabsList>
                
                <TabsContent value="whatsapp" className="mt-4">
                  <div className="space-y-4">
                    <WhatsAppInput 
                      value={whatsappNumber} 
                      onChange={setWhatsappNumber}
                    />
                    <div className="text-xs text-white/70 mt-2">
                      Login with your WhatsApp number for quick access
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="email" className="mt-4">
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid grid-cols-2 w-full bg-black/40">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="login" className="mt-4">
                      <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-black/30 border-white/20"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password" className="flex items-center">
                            <Key className="h-4 w-4 mr-2" />
                            Password
                          </Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-black/30 border-white/20"
                            required
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-karaoke-pink hover:bg-karaoke-pink/80"
                          disabled={isLoading}
                        >
                          {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="register" className="mt-4">
                      <form onSubmit={handleEmailRegister} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-email" className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </Label>
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-black/30 border-white/20"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password" className="flex items-center">
                            <Key className="h-4 w-4 mr-2" />
                            Password
                          </Label>
                          <Input
                            id="register-password"
                            type="password"
                            placeholder="Choose a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-black/30 border-white/20"
                            required
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-karaoke-green hover:bg-karaoke-green/80"
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating account..." : "Create Account"}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </Tabs>
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
