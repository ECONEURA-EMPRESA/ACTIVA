import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// --- CONFIGURACIÓN FIREBASE ---
// En entorno Vite usamos import.meta.env
const defaultConfig = {
  apiKey: "AIzaSyDpu0nSy8VjZcRLcosLALsUzUoMOT8wwiE",
  authDomain: "webycrm-activa.firebaseapp.com",
  projectId: "webycrm-activa",
  storageBucket: "webycrm-activa.firebasestorage.app",
  messagingSenderId: "823376527663",
  appId: "1:823376527663:web:9f357563065b253b890961",
};

// Allow manual override for debugging if needed
const firebaseConfig = (window as any).TITANIUM_CONFIG_OVERRIDE || defaultConfig;

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app); // EXPORT STORAGE

// Initialize Firestore with modern persistence settings
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});


