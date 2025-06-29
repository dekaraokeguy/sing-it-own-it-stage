
import { User } from 'firebase/auth';

export interface AuthUser {
  id: string;
  email?: string | null;
  phoneNumber: string | null;
  displayName?: string | null;
  isAnonymous: boolean;
  metadata?: any;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
}

export const mapFirebaseUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  
  return {
    id: user.uid,
    email: user.email,
    phoneNumber: user.phoneNumber,
    displayName: user.displayName,
    isAnonymous: user.isAnonymous,
    metadata: {
      createdAt: user.metadata.creationTime,
      lastLoginAt: user.metadata.lastSignInTime
    }
  };
};
