
import { useState, useEffect } from 'react';
import { auth } from '@/firebase/auth';
import { User } from 'firebase/auth';

export const useFirebaseAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return { isLoggedIn, user };
};
