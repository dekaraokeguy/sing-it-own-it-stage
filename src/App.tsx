
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { subscribeToAuthChanges } from "./firebase/auth";
import Index from "./pages/Index";
import Performances from "./pages/Performances";
import UploadPage from "./pages/UploadPage";
import Gallery from "./pages/Gallery";
import PerformanceVideos from "./pages/PerformanceVideos";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      setUser(firebaseUser);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/performances" element={<Performances />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/performance-videos" element={<PerformanceVideos />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
