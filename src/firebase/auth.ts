
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  User
} from 'firebase/auth';
import { auth } from './config';

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Login error:', error.message);
    return { user: null, error: error.message };
  }
};

export const signUpUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Signup error:', error.message);
    return { user: null, error: error.message };
  }
};

export const loginAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Anonymous login error:', error.message);
    return { user: null, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    console.error('Logout error:', error.message);
    return { error: error.message };
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
