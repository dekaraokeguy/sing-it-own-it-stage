
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { AuthResult, AuthUser, mapFirebaseUser } from '../../types/auth.types';
import { toast } from 'sonner';

// Logout
export const logout = async (): Promise<{ error: string | null }> => {
  try {
    await signOut(auth);
    toast.success('Logged out successfully');
    return { error: null };
  } catch (error: any) {
    console.error('Logout error:', error.message);
    toast.error(error.message || 'Failed to logout');
    return { error: error.message };
  }
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
  return mapFirebaseUser(auth.currentUser);
};

// Subscribe to auth state changes
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback(mapFirebaseUser(user));
  });

  return unsubscribe;
};
