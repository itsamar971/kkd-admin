import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  manualAdminLogin: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAdminSession = localStorage.getItem('kkd_admin_session');
    if (savedAdminSession) {
      try {
        const parsedUser = JSON.parse(savedAdminSession);
        setUser(parsedUser);
        setIsAdmin(true);
      } catch (e) {
        localStorage.removeItem('kkd_admin_session');
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsAdmin(false);
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const manualAdminLogin = () => {
    const adminUser = {
      uid: 'hardcoded-admin-id',
      email: 'admin@kisankadukan.in',
      emailVerified: true,
    } as User;
    setUser(adminUser);
    setIsAdmin(true);
    localStorage.setItem('kkd_admin_session', JSON.stringify(adminUser));
  };

  const handleLogout = async () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem('kkd_admin_session');
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, logout: handleLogout, manualAdminLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
