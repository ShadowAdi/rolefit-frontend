"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, UserAuthenticatedResponse } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (response: UserAuthenticatedResponse) => {
    const userData: User = {
      id: response.id,
      email: response.email,
      created_at: response.created_at,
    };
    
    setToken(response.access_token);
    setUser(userData);
    localStorage.setItem('authToken', response.access_token);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('auth_user');
  };

  const value: AuthContextType = {
    token,
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};