
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, AuthUser, getCurrentUser } from '@/services/auth';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

interface AuthContextType {
  user: AuthUser | null;
  isInitialized: boolean;
  isLoggedIn: boolean;
  phoneNumber: string | null;
  userProfile: any | null;
  updatePhoneNumber: (phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isInitialized: false,
  isLoggedIn: false,
  phoneNumber: null,
  userProfile: null,
  updatePhoneNumber: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  useEffect(() => {
    // Load current user on mount
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setPhoneNumber(currentUser.phoneNumber);
    }

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange(async (authUser) => {
      setUser(authUser);
      setPhoneNumber(authUser?.phoneNumber || null);
      
      if (authUser) {
        // Check if user profile exists, create if not
        const userRef = doc(db, 'users', authUser.id);
        try {
          const docSnap = await getDoc(userRef);
          
          if (docSnap.exists()) {
            setUserProfile(docSnap.data());
          } else {
            // Create a new user profile
            const newProfile = {
              whatsapp_number: authUser.phoneNumber,
              created_at: new Date()
            };
            
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      
      setIsInitialized(true);
    });
    
    return () => unsubscribe();
  }, []);

  // Update user's phone number
  const updatePhoneNumber = async (phone: string) => {
    if (user) {
      const userRef = doc(db, 'users', user.id);
      try {
        await setDoc(userRef, {
          whatsapp_number: phone,
          updated_at: new Date()
        }, { merge: true });
        
        setPhoneNumber(phone);
        
        // Update local profile data
        setUserProfile((prev: any) => ({
          ...prev,
          whatsapp_number: phone
        }));
      } catch (error) {
        console.error("Error updating phone number:", error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isInitialized,
        isLoggedIn: !!user,
        phoneNumber,
        userProfile,
        updatePhoneNumber
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
