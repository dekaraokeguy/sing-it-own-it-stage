
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { AuthResult, AuthUser, mapFirebaseUser } from '../../types/auth.types';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { logoutFromSupabase } from './supabase-auth.service';

// Logout from both Firebase and Supabase
export const logout = async (): Promise<{ error: string | null }> => {
  try {
    // Logout from Firebase
    await signOut(auth);
    
    // Also logout from Supabase if enabled
    await logoutFromSupabase();
    
    toast.success('Logged out successfully');
    return { error: null };
  } catch (error: any) {
    console.error('Logout error:', error.message);
    toast.error(error.message || 'Failed to logout');
    return { error: error.message };
  }
};

// Get current user (prioritize Supabase if available)
export const getCurrentUser = (): AuthUser | null => {
  // Check Supabase session first
  const session = supabase.auth.getSession();
  if (session) {
    // This will be handled in getSupabaseSession in supabase-auth.service
    return null;
  }
  
  // Fall back to Firebase
  return mapFirebaseUser(auth.currentUser);
};

// Subscribe to auth state changes (both Firebase and Supabase)
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  // Set up Supabase auth listener
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (session && session.user) {
      callback({
        id: session.user.id,
        email: session.user.email || null,
        isAnonymous: false,
        phoneNumber: session.user.phone || null,
      });
    }
  });
  
  // Set up Firebase auth listener as fallback
  const firebaseUnsubscribe = onAuthStateChanged(auth, (user) => {
    // Only call callback if Supabase didn't already handle it
    if (!supabase.auth.getSession()) {
      callback(mapFirebaseUser(user));
    }
  });

  // Return a combined unsubscribe function
  return () => {
    if (data.subscription) {
      data.subscription.unsubscribe();
    }
    firebaseUnsubscribe();
  };
};
