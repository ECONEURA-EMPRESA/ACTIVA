
import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export function useFirebaseAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setDemoMode(false);
        setError(null);

        // FOUNDER OVERRIDE: Always premium for admin
        if (currentUser.email === 'info@activamusicoterapia.com') {
          setIsPremium(true);
          setLoading(false);
          return;
        }

        // Real Firestore Listener for Customers
        unsubscribeProfile = onSnapshot(doc(db, 'users', currentUser.uid), (docSnapshot) => {
          const data = docSnapshot.data();
          // Check for 'premium' status (case insensitive)
          const status = data?.subscriptionStatus?.toLowerCase();
          setIsPremium(status === 'premium' || status === 'lifetime');
          setLoading(false);
        }, (err) => {
          console.error('Error fetching profile:', err);
          setIsPremium(false); // Default to free on error
          setLoading(false);
        });

      } else {
        // Logged out
        setIsPremium(false);
        if (unsubscribeProfile) unsubscribeProfile();
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error('Login Failed:', err);
      setError(err.message || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Note: User document creation should be handled here or via trigger if not existing
    } catch (err: any) {
      console.error('Registration Failed:', err);
      setError(err.message || 'Error al registrar usuario');
      setLoading(false);
    }
  };

  const signOut = async () => {
    setDemoMode(false);
    await firebaseSignOut(auth);
  };

  const enterDemoMode = () => {
    setDemoMode(true);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google Login Failed:', err);
      setError(err.message || 'Error al iniciar sesión con Google');
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    demoMode,
    isPremium,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    enterDemoMode,
  };
}
