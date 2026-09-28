import { PermissionDefinition, AppModule } from '@/lib/permissions/permissions';
import { ALL_PERMISSIONS, APP_MODULES, ModuleConfig, ALL_PERMISSION_IDS } from '@/lib/permissions/permission-constants';
import { rolesApi } from './roles';

export const permissionsApi = {
  getAllPermissions(): PermissionDefinition[] {
    return ALL_PERMISSIONS;
  },

  getAllModules(): ModuleConfig[] {
    return APP_MODULES;
  },

  getPermissionsByModule(): Record<AppModule, PermissionDefinition[]> {
    const grouped: Record<string, PermissionDefinition[]> = {};
    for (const mod of APP_MODULES) {
      grouped[mod.id] = ALL_PERMISSIONS.filter((p) => p.module === mod.id);
    }
    return grouped as Record<AppModule, PermissionDefinition[]>;
  },

  async getEffectivePermissions(roleCode: string): Promise<string[]> {
    if (!roleCode) return [];
    if (roleCode.toUpperCase() === 'ADMIN') {
      return [...ALL_PERMISSION_IDS];
    }
    const role = await rolesApi.getRoleByCode(roleCode);
    return role ? role.permissions : [];
  },
};
