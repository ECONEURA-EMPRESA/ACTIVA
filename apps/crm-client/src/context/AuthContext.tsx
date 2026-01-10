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
  demoMode: boolean;
  upgradeToPremium: () => void; // For demo purposes
  user: User | null; // Typed strongly via Firebase Auth
}

import { User } from 'firebase/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { useFirebaseAuthState } from '../auth/useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useFirebaseAuthState();

  // Map Firebase Auth state to Context shape
  // Role State (Simulated for Dev Mode)
  const [role, setRole] = React.useState<UserRole>('admin');

  const isAuthenticated = !!auth.user;
  const isPremium = auth.isPremium;
  const subscriptionStatus = isPremium ? 'premium' : 'free';

  // Role Switching Logic
  const login = (newRole: UserRole) => {
    setRole(newRole);

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
        demoMode: auth.demoMode,
        upgradeToPremium,
        user: auth.user // Expose real user for Repositories
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
