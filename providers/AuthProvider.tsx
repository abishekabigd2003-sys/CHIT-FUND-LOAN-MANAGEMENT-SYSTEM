'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole, LoginCredentials } from '@/types/auth';
import { authService } from '@/services/auth.service';
import { canAccessModule, AppModule } from '@/lib/permissions';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  hasRole: (allowedRoles: UserRole[]) => boolean;
  canAccess: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore and verify session on mount (client-side only to prevent hydration mismatch)
  useEffect(() => {
    let mounted = true;

    // Fast-path: synchronously restore user from localStorage if available
    try {
      const stored = localStorage.getItem('user_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (mounted) {
          setUser(parsed);
          setIsLoading(false);
        }
      }
    } catch {}

    async function initAuth() {
      try {
        const currentUser = await authService.getCurrentUser();
        if (mounted && currentUser) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Failed to restore session:', err);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();
    return () => {
      mounted = false;
    };
  }, []);

  const role: UserRole = user?.role || 'ADMIN';
  const isAuthenticated = !!user;

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      try {
        const response = await authService.login(credentials);
        setUser(response.user);
        const targetUrl =
          response.redirectUrl ||
          (response.user.role === 'ADMIN'
            ? '/dashboard/admin'
            : response.user.role === 'MANAGEMENT'
            ? '/dashboard/management'
            : '/dashboard/staff');
        router.push(targetUrl);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const switchRole = useCallback(async (newRole: UserRole) => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.switchRole(newRole);
      setUser(updatedUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasRole = useCallback(
    (allowedRoles: UserRole[]) => {
      if (!user) return false;
      return allowedRoles.includes(user.role);
    },
    [user]
  );
  const canAccess = useCallback(
    (moduleName: string): boolean => {
      if (!user) return false;
      return canAccessModule(user.role, moduleName as AppModule);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        logout,
        switchRole,
        hasRole,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
