import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  signOut: () => Promise<void>;
  loginDemo: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  loading: true,
  signOut: async () => { },
  loginDemo: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isDemo) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setLoading(false);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isDemo) {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setRole(null);
          setLoading(false);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [isDemo]);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      setRole(data?.role as UserRole);
    } catch (error) {
      console.error('Error fetching role:', error);
      // Fallback or handle error
      setRole(UserRole.SALES); // Default fallback
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = () => {
    setIsDemo(true);
    const demoUser = {
      id: 'demo-user-id',
      email: 'admin@demo.com',
      app_metadata: {},
      user_metadata: { full_name: 'Usuário Demo', company_id: '00000000-0000-0000-0000-000000000000' },
      aud: 'authenticated',
      created_at: new Date().toISOString()
    } as User;

    setUser(demoUser);
    setRole(UserRole.ADMIN);
    setSession({
      access_token: 'demo-token',
      refresh_token: 'demo-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: demoUser
    });
    setLoading(false);
  };

  const signOut = async () => {
    if (isDemo) {
      setIsDemo(false);
      setUser(null);
      setSession(null);
      setRole(null);
    } else {
      await supabase.auth.signOut();
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, role, loading, signOut, loginDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);