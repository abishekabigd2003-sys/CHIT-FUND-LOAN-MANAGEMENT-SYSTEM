'use client';

import React from 'react';
import { RolePermissionEditor } from '@/components/permissions/RolePermissionEditor';

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <RolePermissionEditor />
    </div>
  );
}
