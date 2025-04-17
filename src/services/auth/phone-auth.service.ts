
import { signInWithPhoneNumber, RecaptchaVerifier, PhoneAuthProvider, linkWithCredential } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { AuthResult, mapFirebaseUser } from '../../types/auth.types';
import { toast } from 'sonner';

// Initialize recaptcha verifier
export const initializeRecaptcha = (containerId: string) => {
  if (typeof window !== 'undefined') {
    try {
      const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log('reCAPTCHA verified');
        }
      });
      window.recaptchaVerifier = recaptchaVerifier;
      return recaptchaVerifier;
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
