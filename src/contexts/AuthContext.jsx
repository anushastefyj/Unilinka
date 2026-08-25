import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setCurrentUser(session.user);
          fetchUserData(session.user.id);
        } else {
          setCurrentUser(null);
          setUserData(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error fetching user data:', error);
      } else if (data) {
        setUserData(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  };

  const signup = async (email, password, profileData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return { data, error };

    // Insert the profile
    if (data?.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          name: profileData.name || data.user.email.split('@')[0],
          role: profileData.role || 'student',
          course: profileData.course || null,
          year: profileData.year || null
        });
      
      if (profileError) {
        console.error('Error creating profile:', profileError);
        return { data, error: profileError };
      }
    }

    return { data, error };
  };

  const logout = async () => {
    return await supabase.auth.signOut();
  };

  const value = {
    currentUser,
    userData,
    loading,
    isAuthenticated: !!currentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
