
import { supabase } from '@/integrations/supabase/client';
import { AuthResult, AuthUser } from '../../types/auth.types';
import { toast } from 'sonner';

// Login with email and password using Supabase
export const loginWithSupabase = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase login error:', error.message);
      toast.error(error.message || 'Failed to log in');
      return { user: null, error: error.message };
    }

    toast.success('Logged in successfully');
    return {
      user: {
        id: data.user?.id || '',
        email: data.user?.email || null,
        isAnonymous: false,
        phoneNumber: data.user?.phone || null,
      },
      error: null,
    };
  } catch (error: any) {
    console.error('Login error:', error.message);
    toast.error(error.message || 'Failed to log in');
    return { user: null, error: error.message };
  }
};

// Register new user with email and password using Supabase
export const registerWithSupabase = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Supabase registration error:', error.message);
      toast.error(error.message || 'Failed to register');
      return { user: null, error: error.message };
    }

    toast.success('Registration successful! Check your email for verification.');
    return {
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email || null,
            isAnonymous: false,
            phoneNumber: data.user.phone || null,
          }
        : null,
      error: null,
    };
  } catch (error: any) {
    console.error('Registration error:', error.message);
    toast.error(error.message || 'Failed to register');
    return { user: null, error: error.message };
  }
};

// Check current Supabase session
export const getSupabaseSession = async (): Promise<{ user: AuthUser | null }> => {
  const { data } = await supabase.auth.getSession();
  const { session } = data;

  if (!session) return { user: null };

  return {
    user: {
      id: session.user.id,
      email: session.user.email || null,
      isAnonymous: false,
      phoneNumber: session.user.phone || null,
    },
  };
};

// Logout from Supabase
export const logoutFromSupabase = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Supabase logout error:', error.message);
      toast.error(error.message || 'Failed to log out');
      return { error: error.message };
    }
    toast.success('Logged out successfully');
    return { error: null };
  } catch (error: any) {
    console.error('Logout error:', error.message);
    toast.error(error.message || 'Failed to log out');
    return { error: error.message };
  }
};

// Listen to auth state changes
export const onSupabaseAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (session && session.user) {
      callback({
        id: session.user.id,
        email: session.user.email || null,
        isAnonymous: false,
        phoneNumber: session.user.phone || null,
      });
    } else {
      callback(null);
    }
  });

  return data.subscription.unsubscribe;
};
