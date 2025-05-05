
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../../firebase';
import { AuthResult, mapFirebaseUser } from '../../types/auth.types';
import { toast } from 'sonner';

// Login anonymously
export const loginAnonymously = async (): Promise<AuthResult> => {
  try {
    const userCredential = await signInAnonymously(auth);
    toast.success('Logged in anonymously');
    return { user: mapFirebaseUser(userCredential.user), error: null };
  } catch (error: any) {
    console.error('Anonymous login error:', error.message);
    toast.error(error.message || 'Failed to login anonymously');
    return { user: null, error: error.message };
  }
};
