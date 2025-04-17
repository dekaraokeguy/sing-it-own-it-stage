
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInAnonymously,
  User,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
  linkWithCredential,
  AuthError
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { toast } from 'sonner';

export interface AuthUser {
  id: string;
  phoneNumber: string | null;
  displayName?: string | null;
  isAnonymous: boolean;
  metadata?: any;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
}

const mapFirebaseUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  
  return {
    id: user.uid,
    phoneNumber: user.phoneNumber,
    displayName: user.displayName,
    isAnonymous: user.isAnonymous,
    metadata: {
      createdAt: user.metadata.creationTime,
      lastLoginAt: user.metadata.lastSignInTime
    }
  };
};

// Initialize recaptcha verifier
const initializeRecaptcha = (containerId: string) => {
  if (typeof window !== 'undefined') {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log('reCAPTCHA verified');
        }
      });
      return window.recaptchaVerifier;
    } catch (error) {
      console.error('Error initializing recaptcha:', error);
      return null;
    }
  }
  return null;
};

// Login with phone number
export const loginWithPhoneNumber = async (
  phoneNumber: string,
  recaptchaContainerId: string = 'recaptcha-container'
): Promise<{verificationId?: string; error?: string}> => {
  try {
    const appVerifier = initializeRecaptcha(recaptchaContainerId);
    if (!appVerifier) {
      throw new Error('Failed to initialize reCAPTCHA');
    }
    
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return { verificationId: confirmationResult.verificationId };
  } catch (error: any) {
    console.error('Login with phone error:', error);
    toast.error(error.message || 'Failed to send verification code');
    return { error: error.message };
  }
};

// Verify phone code
export const verifyPhoneCode = async (code: string): Promise<AuthResult> => {
  try {
    if (!window.confirmationResult) {
      throw new Error('No verification sent. Please request a code first.');
    }
    
    const result = await window.confirmationResult.confirm(code);
    return { user: mapFirebaseUser(result.user), error: null };
  } catch (error: any) {
    console.error('Code verification error:', error);
    toast.error(error.message || 'Invalid verification code');
    return { user: null, error: error.message };
  }
};

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

// Link anonymous account with phone number
export const linkWithPhone = async (
  phoneNumber: string,
  recaptchaContainerId: string = 'recaptcha-container'
): Promise<{verificationId?: string; error?: string}> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not logged in');
    }
    
    const appVerifier = initializeRecaptcha(recaptchaContainerId);
    if (!appVerifier) {
      throw new Error('Failed to initialize reCAPTCHA');
    }
    
    const provider = new PhoneAuthProvider(auth);
    const verificationId = await provider.verifyPhoneNumber(phoneNumber, appVerifier);
    return { verificationId };
  } catch (error: any) {
    console.error('Link with phone error:', error);
    return { error: error.message };
  }
};

// Complete linking with phone verification code
export const completePhoneLinking = async (
  verificationId: string,
  verificationCode: string
): Promise<AuthResult> => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not logged in');
    }
    
    const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
    const result = await linkWithCredential(auth.currentUser, credential);
    return { user: mapFirebaseUser(result.user), error: null };
  } catch (error: any) {
    console.error('Complete phone linking error:', error);
    return { user: null, error: error.message };
  }
};

// Subscribe to auth state changes
export const onAuthStateChanged = (callback: (user: AuthUser | null) => void) => {
  return auth.onAuthStateChanged((user) => {
    callback(mapFirebaseUser(user));
  });
};

// Declare global types for the window object
declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}
