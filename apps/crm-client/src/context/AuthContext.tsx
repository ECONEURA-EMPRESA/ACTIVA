import React, { createContext, useContext } from 'react';

type UserRole = 'admin' | 'therapist';

interface AuthContextType {
  role: UserRole;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
  canDelete: boolean;
  canViewFinancials: boolean;
  canEditConfig: boolean;
  subscriptionStatus: 'free' | 'premium';
  isPremium: boolean;
  upgradeToPremium: () => void; // For demo purposes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { useFirebaseAuthState } from '../auth/useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useFirebaseAuthState();

  // Map Firebase Auth state to Context shape
  const role: UserRole = 'admin'; // Always admin for now
  const isAuthenticated = !!auth.user;
  const isPremium = auth.isPremium;
  const subscriptionStatus = isPremium ? 'premium' : 'free';

  // Legacy signatures compatibility
  const login = (_newRole: UserRole) => {
    // This is now handled by LoginView calling signIn() directly. 
    // We just log to console or ignore since AuthState updates automatically via Firebase Observer.
    // This is now handled by LoginView calling signIn() directly.
  };

  const logout = () => {
    auth.signOut();
  };

  const upgradeToPremium = () => {
    // In real app, this should redirect to payment
    // In real app, this should redirect to payment
  };

  // RBAC LOGIC
  const canDelete = role === 'admin';
  const canViewFinancials = role === 'admin';
  const canEditConfig = role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        role,
        isAuthenticated,
        login,
        logout,
        canDelete,
        canViewFinancials,
        canEditConfig,
        subscriptionStatus,
        isPremium,
        upgradeToPremium
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
