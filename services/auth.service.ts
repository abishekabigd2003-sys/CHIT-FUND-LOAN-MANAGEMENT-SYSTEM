import apiClient from '@/lib/axios';
import { AuthResponse, LoginCredentials, User, UserRole } from '@/types/auth';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

export interface RoleAccount {
  user: User;
  passwords: string[];
  aliases?: string[];
  redirectUrl: string;
}

export const ROLE_ACCOUNTS: Record<UserRole, RoleAccount> = {
  ADMIN: {
    user: {
      id: 'usr-admin-1',
      name: 'Suresh Ramanathan',
      email: 'admin@chitfund.com',
      role: 'ADMIN',
      branch: 'Corporate HQ - Chennai',
      phone: '+91 98400 11223',
      lastLogin: new Date().toISOString(),
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    },
    passwords: ['Admin@123', 'admin123', 'admin'],
    aliases: ['admin@chitfund.com', 'administrator@chitfund.com'],
    redirectUrl: '/dashboard/admin',
  },
  MANAGEMENT: {
    user: {
      id: 'usr-mgmt-1',
      name: 'Kavitha Rajagopalan',
      email: 'management@chitfund.com',
      role: 'MANAGEMENT',
      branch: 'Executive Directorate',
      phone: '+91 98402 77889',
      lastLogin: new Date().toISOString(),
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    passwords: ['Management@123', 'mgmt123', 'management123', 'mgmt@123'],
    aliases: ['mgmt@chitfund.com', 'management@chitfund.com', 'executive@chitfund.com'],
    redirectUrl: '/dashboard/management',
  },
  STAFF: {
    user: {
      id: 'usr-staff-1',
      name: 'Anand Sundar',
      email: 'staff@chitfund.com',
      role: 'STAFF',
      branch: 'Anna Nagar Retail Branch',
      phone: '+91 98401 44556',
      lastLogin: new Date().toISOString(),
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    },
    passwords: ['Staff@123', 'staff123', 'staff', 'officer123'],
    aliases: ['staff@chitfund.com', 'officer@chitfund.com', 'field@chitfund.com'],
    redirectUrl: '/dashboard/staff',
  },
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse & { redirectUrl: string }> {
    if (!USE_MOCK) {
      const response = await apiClient.post<AuthResponse & { redirectUrl?: string }>('/auth/login', credentials);
      const role = response.data.user.role;
      const redirectUrl =
        response.data.redirectUrl ||
        (role === 'ADMIN' ? '/dashboard/admin' : role === 'MANAGEMENT' ? '/dashboard/management' : '/dashboard/staff');
      return {
        ...response.data,
        redirectUrl,
      };
    }

    const email = (credentials.email || '').trim().toLowerCase();
    const password = (credentials.password || '').trim();

    if (!email) {
      throw new Error('Please enter your email ID');
    }
    if (!password) {
      throw new Error('Please enter your password');
    }

    // Match account strictly by email or registered aliases
    const accountEntry = Object.values(ROLE_ACCOUNTS).find((acc) => {
      if (acc.user.email.toLowerCase() === email) return true;
      if (acc.aliases?.some((a) => a.toLowerCase() === email)) return true;
      return false;
    });

    if (!accountEntry) {
      throw new Error('Unrecognized email address. No registered user found for this role.');
    }

    // Verify password strictly
    const isPasswordValid = accountEntry.passwords.includes(password);
    if (!isPasswordValid) {
      throw new Error('Incorrect password. Please verify the credentials for this account.');
    }

    const user: User = {
      ...accountEntry.user,
      lastLogin: new Date().toISOString(),
    };
    const role: UserRole = user.role;
    const mockToken = `jwt-${role.toLowerCase()}-${Date.now()}`;

    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_data', JSON.stringify(user));
      localStorage.setItem('simulated_role', role);
    }

    return {
      user,
      token: mockToken,
      redirectUrl: accountEntry.redirectUrl,
    };
  },

  async getCurrentUser(): Promise<User | null> {
    if (!USE_MOCK) {
      const response = await apiClient.get<User>('/auth/me');
      return response.data;
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user_data');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return ROLE_ACCOUNTS.ADMIN.user;
        }
      }
    }
    return ROLE_ACCOUNTS.ADMIN.user;
  },

  async switchRole(role: UserRole): Promise<User> {
    const account = ROLE_ACCOUNTS[role] || ROLE_ACCOUNTS.ADMIN;
    const user = account.user;
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user));
      localStorage.setItem('simulated_role', role);
    }
    return user;
  },

  async logout(): Promise<void> {
    if (!USE_MOCK) {
      await apiClient.post('/auth/logout');
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      localStorage.removeItem('simulated_role');
    }
  },
};
