
import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  User,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useActivityLog } from '@/hooks/useActivityLog';

export function useFirebaseAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const { logActivity } = useActivityLog();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  /* AUTH STATE LISTENER */
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
      logActivity('security', `Inicio de sesión exitoso: ${email}`);
    } catch (err: unknown) {
      console.error('Login Failed:', err);
      // We could log failures too if desired, but maybe too noisy
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCred.user);
      // Note: User document creation should be handled here or via trigger if not existing
    } catch (err: unknown) {
      console.error('Registration Failed:', err);
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message || 'Error al registrar usuario');
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

  /* GOOGLE AUTH WITH POPUP (RESTORED - RELIABLE) */
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const { GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();

      // FORCE ACCOUNT SELECTION (Prevents "Stuck" login)
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      // FORCE PERSISTENCE: local (survives browser close)
      await setPersistence(auth, browserLocalPersistence);

      // CLASSIC POPUP (Bypasses Redirect Restrictions)
      await signInWithPopup(auth, provider);

      logActivity('security', 'Inicio de sesión con Google exitoso');
    } catch (err: unknown) {
      console.error('Google Login Failed:', err);

      let message = 'Error al iniciar sesión con Google';
      if (err instanceof Error) {
        message = err.message;

        // Titanium Standard: Type Guard for Firebase Error Code
        const firebaseErr = err as { code?: string };

        if (firebaseErr.code === 'auth/popup-closed-by-user') {
          message = 'Inicio de sesión cancelado por el usuario';
        } else if (firebaseErr.code === 'auth/domain-not-authorized') {
          message = 'Dominio no autorizado. Contacte soporte.';
        } else if (firebaseErr.code === 'auth/popup-blocked') {
          message = 'El navegador bloqueó la ventana emergente. Permita popups para este sitio.';
        }
      }
      setError(message);
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
