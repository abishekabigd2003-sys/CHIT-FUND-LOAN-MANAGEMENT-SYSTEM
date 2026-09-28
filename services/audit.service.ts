import { AuditLog, AuditFilterParams } from '@/types/audit';
import { mockAuditLogs } from './mock-data/audit';

let auditLogsStore: AuditLog[] = [...mockAuditLogs];

export const auditService = {
  async getLogs(filter?: AuditFilterParams): Promise<AuditLog[]> {
    let logs = [...auditLogsStore];

    if (filter?.module) {
      logs = logs.filter((l) => l.module === filter.module);
    }
    if (filter?.action) {
      logs = logs.filter((l) => l.action === filter.action);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      logs = logs.filter(
        (l) =>
          l.recordId.toLowerCase().includes(q) ||
          l.userName.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q)
      );
    }
    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  async logAction(data: Omit<AuditLog, 'id' | 'timestamp'>): Promise<AuditLog> {
    const newLog: AuditLog = {
      id: `aud-log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...data,
    };
    auditLogsStore = [newLog, ...auditLogsStore];
    return newLog;
  },
};
