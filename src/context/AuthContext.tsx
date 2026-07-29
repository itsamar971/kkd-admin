import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import api from '../api/axios';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock Auth for UI testing
    setTimeout(() => {
      setUser({
        uid: 'admin-mock-id',
        email: 'admin@kisankadukan.com',
        emailVerified: true,
      } as User);
      setIsAdmin(true);
      setLoading(false);
    }, 500);
    
    // Cleanup function
    return () => {};
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, logout: () => signOut(auth) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
