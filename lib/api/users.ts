import { User, UserRole } from '@/types/auth';
import { auditService } from '@/services/audit.service';
import { assertAdmin } from '@/lib/permissions/backend-guard';

const USERS_STORAGE_KEY = 'dyn_rbac_users_v2';

const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'S. Narayanan',
    email: 'admin@chitfund.com',
    role: 'ADMIN',
    branch: 'Corporate Headquarters',
    phone: '+91 98400 11223',
    lastLogin: new Date().toISOString(),
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-mgmt-1',
    name: 'P. Ramanathan',
    email: 'mgmt@chitfund.com',
    role: 'MANAGEMENT',
    branch: 'Regional Zonal Office',
    phone: '+91 98400 33445',
    lastLogin: new Date(Date.now() - 3600000 * 4).toISOString(),
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-staff-1',
    name: 'Karthik Raman',
    email: 'staff@chitfund.com',
    role: 'STAFF',
    branch: 'Anna Nagar West Branch',
    phone: '+91 98400 55667',
    lastLogin: new Date(Date.now() - 3600000 * 2).toISOString(),
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'usr-staff-2',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@chitfund.com',
    role: 'STAFF',
    branch: 'Adyar Branch',
    phone: '+91 98400 77889',
    lastLogin: new Date(Date.now() - 3600000 * 8).toISOString(),
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
];

function loadStoredUsers(): User[] {
  if (typeof window === 'undefined') return [...INITIAL_USERS];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return [...INITIAL_USERS];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (err) {
    console.error('Failed to parse stored users:', err);
  }
  return [...INITIAL_USERS];
}

function persistUsers(users: User[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent('rbac-user-updated', { detail: { timestamp: Date.now() } }));
  }
}

export const usersApi = {
  async getUsers(): Promise<User[]> {
    return loadStoredUsers();
  },

  async getUserById(id: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find((u) => u.id === id) || null;
  },

  async assignRole(userId: string, newRoleCode: string, currentUser?: User | null): Promise<User> {
    assertAdmin(currentUser, 'assigning user roles');

    const users = loadStoredUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      throw new Error(`User with ID '${userId}' not found.`);
    }

    const targetUser = users[index];
    const prevRole = targetUser.role;
    const cleanRole = newRoleCode.toUpperCase() as UserRole;

    const updatedUser: User = {
      ...targetUser,
      role: cleanRole,
    };

    users[index] = updatedUser;
    persistUsers(users);

    // If current logged in user was modified, update their active session storage too
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user_data');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed.id === userId) {
            localStorage.setItem('user_data', JSON.stringify(updatedUser));
            localStorage.setItem('simulated_role', cleanRole);
          }
        }
      } catch {}
    }

    // Record audit event
    await auditService.logAction({
      userId: currentUser?.id || 'usr-admin-1',
      userName: currentUser?.name || 'Administrator',
      userRole: (currentUser?.role || 'ADMIN') as UserRole,
      action: 'UPDATE',
      module: 'SETTINGS',
      recordId: `USER-${userId}`,
      description: `Reassigned role for user '${targetUser.name}' (${targetUser.email}) from '${prevRole}' to '${cleanRole}'.`,
      previousValue: { role: prevRole },
      newValue: { role: cleanRole },
    });

    return updatedUser;
  },

  async createUser(data: Partial<User>, currentUser?: User | null): Promise<User> {
    assertAdmin(currentUser, 'provisioning user accounts');

    const users = loadStoredUsers();
    const email = data.email?.trim().toLowerCase();

    if (!email) throw new Error('Email address is required.');
    if (users.some((u) => u.email.toLowerCase() === email)) {
      throw new Error(`A user with email '${email}' already exists.`);
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name?.trim() || 'New Officer',
      email,
      role: (data.role?.toUpperCase() as UserRole) || 'STAFF',
      branch: data.branch?.trim() || 'Chennai Main Branch',
      phone: data.phone?.trim() || '+91 98400 00000',
      lastLogin: new Date().toISOString(),
      avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };

    users.push(newUser);
    persistUsers(users);

    await auditService.logAction({
      userId: currentUser?.id || 'usr-admin-1',
      userName: currentUser?.name || 'Administrator',
      userRole: (currentUser?.role || 'ADMIN') as UserRole,
      action: 'CREATE',
      module: 'SETTINGS',
      recordId: `USER-${newUser.id}`,
      description: `Provisioned new staff user '${newUser.name}' with role '${newUser.role}' at branch '${newUser.branch}'.`,
      newValue: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });

    return newUser;
  },

  async updateUser(userId: string, data: Partial<User>, currentUser?: User | null): Promise<User> {
    assertAdmin(currentUser, 'modifying user accounts');

    const users = loadStoredUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');

    const existing = users[index];
    const updated: User = {
      ...existing,
      name: data.name !== undefined ? data.name : existing.name,
      email: data.email !== undefined ? data.email : existing.email,
      branch: data.branch !== undefined ? data.branch : existing.branch,
      phone: data.phone !== undefined ? data.phone : existing.phone,
      role: data.role ? (data.role.toUpperCase() as UserRole) : existing.role,
    };

    users[index] = updated;
    persistUsers(users);

    await auditService.logAction({
      userId: currentUser?.id || 'usr-admin-1',
      userName: currentUser?.name || 'Administrator',
      userRole: (currentUser?.role || 'ADMIN') as UserRole,
      action: 'UPDATE',
      module: 'SETTINGS',
      recordId: `USER-${userId}`,
      description: `Updated profile details for '${updated.name}'.`,
      previousValue: { name: existing.name, email: existing.email, branch: existing.branch, role: existing.role },
      newValue: { name: updated.name, email: updated.email, branch: updated.branch, role: updated.role },
    });

    return updated;
  },

  async deleteUser(userId: string, currentUser?: User | null): Promise<void> {
    assertAdmin(currentUser, 'deleting users');

    const users = loadStoredUsers();
    const target = users.find((u) => u.id === userId);
    if (!target) throw new Error('User not found');

    if (target.role === 'ADMIN' && users.filter((u) => u.role === 'ADMIN').length <= 1) {
      throw new Error('Safety Constraint: Cannot delete the last remaining Administrator account.');
    }

    const filtered = users.filter((u) => u.id !== userId);
    persistUsers(filtered);

    await auditService.logAction({
      userId: currentUser?.id || 'usr-admin-1',
      userName: currentUser?.name || 'Administrator',
      userRole: (currentUser?.role || 'ADMIN') as UserRole,
      action: 'DELETE',
      module: 'SETTINGS',
      recordId: `USER-${userId}`,
      description: `Deactivated and deleted user profile '${target.name}' (${target.email}).`,
      previousValue: { id: target.id, email: target.email, role: target.role },
    });
  },
};
