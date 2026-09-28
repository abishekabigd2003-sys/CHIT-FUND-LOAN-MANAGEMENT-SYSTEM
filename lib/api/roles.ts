import { RoleDefinition, CreateRoleDto, UpdateRoleDto } from '@/lib/permissions/permissions';
import { INITIAL_ROLES, ALL_PERMISSION_IDS } from '@/lib/permissions/permission-constants';
import { auditService } from '@/services/audit.service';
import { assertAdmin } from '@/lib/permissions/backend-guard';
import { User, UserRole } from '@/types/auth';

const STORAGE_KEY = 'dyn_rbac_roles_v2';
let memoryCachedRoles: RoleDefinition[] | null = null;

function loadStoredRoles(): RoleDefinition[] {
  if (memoryCachedRoles) {
    return memoryCachedRoles;
  }
  if (typeof window === 'undefined') {
    return [...INITIAL_ROLES];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ROLES));
      memoryCachedRoles = [...INITIAL_ROLES];
      return memoryCachedRoles;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure ADMIN has all permissions always
      memoryCachedRoles = parsed.map((r: RoleDefinition) => {
        if (r.code === 'ADMIN') {
          return { ...r, permissions: ALL_PERMISSION_IDS };
        }
        return r;
      });
      return memoryCachedRoles;
    }
  } catch (err) {
    console.error('Failed to parse stored roles, falling back to defaults', err);
  }
  memoryCachedRoles = [...INITIAL_ROLES];
  return memoryCachedRoles;
}

function persistRoles(roles: RoleDefinition[]): void {
  // Ensure Admin always has all permissions
  const sanitized = roles.map((r) =>
    r.code === 'ADMIN' ? { ...r, permissions: ALL_PERMISSION_IDS } : r
  );
  memoryCachedRoles = sanitized;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    // Dispatch custom event for real-time reactivity across components
    window.dispatchEvent(new CustomEvent('rbac-permissions-updated', { detail: { timestamp: Date.now() } }));
  }
}

export const rolesApi = {
  invalidateCache(): void {
    memoryCachedRoles = null;
  },

  getStoredPermissionsForRole(roleCode: string): string[] {
    if (!roleCode || roleCode.toUpperCase() === 'ADMIN') {
      return ALL_PERMISSION_IDS;
    }
    const roles = loadStoredRoles();
    const roleDef = roles.find((r) => r.code.toUpperCase() === roleCode.toUpperCase());
    return roleDef?.permissions || [];
  },

  async getRoles(): Promise<RoleDefinition[]> {
    return loadStoredRoles();
  },

  async getRoleByCode(code: string): Promise<RoleDefinition | null> {
    const roles = await this.getRoles();
    return roles.find((r) => r.code.toUpperCase() === code.toUpperCase()) || null;
  },

  async updateRolePermissions(
    roleCode: string,
    newPermissions: string[],
    currentUser?: User | null
  ): Promise<RoleDefinition> {
    // Backend security assertion: strictly only ADMIN can configure permissions
    assertAdmin(currentUser, 'permission configuration');

    const upperCode = roleCode.toUpperCase();
    if (upperCode === 'ADMIN') {
      throw new Error('Administrative Security Rule: ADMIN role privileges are immutable and cannot be revoked.');
    }

    const roles = loadStoredRoles();
    const index = roles.findIndex((r) => r.code.toUpperCase() === upperCode);
    if (index === -1) {
      throw new Error(`Role '${roleCode}' not found`);
    }

    const previousRole = roles[index];
    const prevSet = new Set(previousRole.permissions);
    const newSet = new Set(newPermissions);

    const added = newPermissions.filter((p) => !prevSet.has(p));
    const removed = previousRole.permissions.filter((p) => !newSet.has(p));

    const updatedRole: RoleDefinition = {
      ...previousRole,
      permissions: newPermissions,
      updatedAt: new Date().toISOString(),
    };

    roles[index] = updatedRole;
    persistRoles(roles);

    // Audit Trail recording
    await auditService.logAction({
      userId: currentUser?.id || 'usr-admin-1',
      userName: currentUser?.name || 'Administrator',
      userRole: (currentUser?.role || 'ADMIN') as UserRole,
      action: 'UPDATE',
      module: 'SETTINGS',
      recordId: `ROLE-${upperCode}`,
      description: `Configured permissions for role '${previousRole.name}' (${upperCode}). Added: ${added.length}, Removed: ${removed.length}. Previous: ${previousRole.permissions.length} perms, Now: ${newPermissions.length} perms.`,
      previousValue: { permissionsCount: previousRole.permissions.length, sampleRemoved: removed.slice(0, 5) },
      newValue: { permissionsCount: newPermissions.length, sampleAdded: added.slice(0, 5) },
    });

    return updatedRole;
  },

  async createRole(data: CreateRoleDto, currentUser?: User | null): Promise<RoleDefinition> {
    assertAdmin(currentUser, 'creating new custom roles');

    const roles = loadStoredRoles();
    const cleanCode = data.code.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '_');

    if (roles.some((r) => r.code.toUpperCase() === cleanCode)) {
      throw new Error(`Role code '${cleanCode}' already exists. Please choose a unique code.`);
    }

    const newRole: RoleDefinition = {
      id: `role-${cleanCode.toLowerCase()}-${Date.now()}`,
      code: cleanCode,
      name: data.name.trim(),
      description: data.description.trim(),
      isSystem: false,
      permissions: data.permissions || [],
      usersCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    roles.push(newRole);
    persistRoles(roles);

    await auditService.logAction({
      userId: currentUser?.id || 'usr-admin-1',
      userName: currentUser?.name || 'Administrator',
      userRole: (currentUser?.role || 'ADMIN') as UserRole,
      action: 'CREATE',
      module: 'SETTINGS',
      recordId: `ROLE-${cleanCode}`,
      description: `Created new custom role: '${newRole.name}' (${cleanCode}) with ${newRole.permissions.length} initial permissions.`,
      newValue: { code: cleanCode, name: newRole.name, permissionsCount: newRole.permissions.length },
    });

    return newRole;
  },

  async updateRole(
    code: string,
    data: UpdateRoleDto,
    currentUser?: User | null
  ): Promise<RoleDefinition> {
    assertAdmin(currentUser, 'updating role metadata');

    const roles = loadStoredRoles();
    const index = roles.findIndex((r) => r.code.toUpperCase() === code.toUpperCase());
    if (index === -1) {
      throw new Error(`Role '${code}' not found`);
    }

    const role = roles[index];
    const updatedRole: RoleDefinition = {
      ...role,
      name: data.name?.trim() || role.name,
      description: data.description?.trim() || role.description,
      permissions: role.code === 'ADMIN' ? [...ALL_PERMISSION_IDS] : (data.permissions || role.permissions),
      updatedAt: new Date().toISOString(),
    };

    roles[index] = updatedRole;
    persistRoles(roles);

    await auditService.logAction({
      userId: currentUser?.id || 'usr-admin-1',
      userName: currentUser?.name || 'Administrator',
      userRole: (currentUser?.role || 'ADMIN') as UserRole,
      action: 'UPDATE',
      module: 'SETTINGS',
      recordId: `ROLE-${code}`,
      description: `Updated role profile details for '${updatedRole.name}' (${code}).`,
      previousValue: { name: role.name, description: role.description },
      newValue: { name: updatedRole.name, description: updatedRole.description },
    });

    return updatedRole;
  },

  async duplicateRole(
    sourceCode: string,
    newCode: string,
    newName: string,
    currentUser?: User | null
  ): Promise<RoleDefinition> {
    assertAdmin(currentUser, 'duplicating roles');

    const source = await this.getRoleByCode(sourceCode);
    if (!source) {
      throw new Error(`Source role '${sourceCode}' not found`);
    }

    return this.createRole(
      {
        code: newCode,
        name: newName,
        description: `Cloned from ${source.name}. ${source.description}`,
        permissions: [...source.permissions],
      },
      currentUser
    );
  },

  async deleteRole(code: string, currentUser?: User | null): Promise<void> {
    assertAdmin(currentUser, 'deleting custom roles');

    const upperCode = code.toUpperCase();
    if (upperCode === 'ADMIN' || upperCode === 'MANAGEMENT' || upperCode === 'STAFF') {
      throw new Error(`Cannot delete core system role '${code}'. System roles are required for operational continuity.`);
    }

    const roles = loadStoredRoles();
    const target = roles.find((r) => r.code.toUpperCase() === upperCode);
    if (!target) {
      throw new Error(`Role '${code}' not found`);
    }

    const filtered = roles.filter((r) => r.code.toUpperCase() !== upperCode);
    persistRoles(filtered);

    await auditService.logAction({
      userId: currentUser?.id || 'usr-admin-1',
      userName: currentUser?.name || 'Administrator',
      userRole: (currentUser?.role || 'ADMIN') as UserRole,
      action: 'DELETE',
      module: 'SETTINGS',
      recordId: `ROLE-${upperCode}`,
      description: `Deleted custom role: '${target.name}' (${upperCode}).`,
      previousValue: { code: upperCode, name: target.name },
    });
  },

  async resetRolesToDefault(currentUser?: User | null): Promise<RoleDefinition[]> {
    assertAdmin(currentUser, 'resetting roles to system defaults');

    persistRoles(INITIAL_ROLES);

    await auditService.logAction({
      userId: currentUser?.id || 'usr-admin-1',
      userName: currentUser?.name || 'Administrator',
      userRole: (currentUser?.role || 'ADMIN') as UserRole,
      action: 'UPDATE',
      module: 'SETTINGS',
      recordId: 'ROLES-RESET',
      description: 'Reset all enterprise roles and permissions to system defaults.',
    });

    return INITIAL_ROLES;
  },
};
