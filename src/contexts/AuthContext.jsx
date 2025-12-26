import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, getCurrentUser } from '../lib/firebaseAuth';
import { getUser, createUser } from '../lib/firebaseDb';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        setCurrentUser(user);
        // Get user data from Firestore
        const userDataResult = await getUser(user.uid);
        if (userDataResult.success) {
          setUserData(userDataResult.data);
        } else {
          // Create user document if it doesn't exist
          await createUser(user.uid, {
            email: user.email,
            displayName: user.displayName || '',
            role: 'student', // default role
            createdAt: new Date().toISOString()
          });
          setUserData({
            email: user.email,
            displayName: user.displayName || '',
            role: 'student'
          });
        }
      } else {
        setCurrentUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

