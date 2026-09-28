import { useQuery } from '@tanstack/react-query';
import { auditService } from '@/services/audit.service';
import { AuditFilterParams } from '@/types/audit';

export function useAuditLogs(filter?: AuditFilterParams) {
  return useQuery({
    queryKey: ['audit-logs', filter],
    queryFn: () => auditService.getLogs(filter),
  });
}
