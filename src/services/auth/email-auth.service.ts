
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { AuthResult, mapFirebaseUser } from '../../types/auth.types';
import { toast } from 'sonner';

// Login with email and password
export const loginWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: mapFirebaseUser(userCredential.user), error: null };
  } catch (error: any) {
    console.error('Login error:', error.message);
    toast.error(error.message || 'Failed to login');
    return { user: null, error: error.message };
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string): Promise<AuthResult> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: mapFirebaseUser(userCredential.user), error: null };
  } catch (error: any) {
    console.error('Signup error:', error.message);
    toast.error(error.message || 'Failed to sign up');
    return { user: null, error: error.message };
  }
};
