import apiClient from '@/lib/axios';
import { ChitScheme, CreateChitSchemeInput, ChitMemberSubscription } from '@/types/chit';
import { mockChitSchemes } from './mock-data/chits';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

let inMemoryChits = [...mockChitSchemes];

export const chitService = {
  async getChits(params?: { status?: string; search?: string }): Promise<ChitScheme[]> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: ChitScheme[] }>('/chits', { params });
      return response.data.data;
    }
    let result = [...inMemoryChits];

    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.schemeName.toLowerCase().includes(q) ||
          c.schemeCode.toLowerCase().includes(q)
      );
    }

    if (params?.status && params.status !== 'ALL') {
      result = result.filter((c) => c.status === params.status);
    }

    return result;
  },

  async getChitById(id: string): Promise<ChitScheme> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: ChitScheme }>(`/chits/${id}`);
      return response.data.data;
    }
    const scheme = inMemoryChits.find((c) => c.id === id || c.schemeCode === id);
    if (!scheme) {
      throw new Error(`Chit scheme with ID ${id} not found.`);
    }
    return scheme;
  },

  async createChit(input: CreateChitSchemeInput): Promise<ChitScheme> {
    if (!USE_MOCK) {
      const response = await apiClient.post<{ success: boolean; data: ChitScheme }>('/chits', input);
      return response.data.data;
    }

    const code = `CFT-${Math.round(input.totalValue / 1000)}K-${input.durationMonths}M`;
    const newScheme: ChitScheme = {
      id: `chit-${Date.now()}`,
      schemeCode: code,
      schemeName: input.schemeName,
      totalValue: Number(input.totalValue),
      monthlyContribution: Number(input.monthlyContribution),
      durationMonths: Number(input.durationMonths),
      totalMembers: Number(input.totalMembers),
      enrolledMembersCount: 0,
      currentMonth: 0,
      foremanCommissionPct: Number(input.foremanCommissionPct),
      startDate: input.startDate,
      endDate: new Date(new Date(input.startDate).setMonth(new Date(input.startDate).getMonth() + Number(input.durationMonths))).toISOString().split('T')[0],
      status: 'UPCOMING',
      description: input.description,
      members: [],
      auctions: [],
    };

    inMemoryChits.unshift(newScheme);
    return newScheme;
  },

  async addMember(chitId: string, customerId: string, customerName: string, customerCode: string): Promise<ChitMemberSubscription> {
    if (!USE_MOCK) {
      const response = await apiClient.post<{ success: boolean; data: ChitMemberSubscription }>(`/chits/${chitId}/members`, {
        customerId,
      });
      return response.data.data;
    }
    const scheme = inMemoryChits.find((c) => c.id === chitId);
    if (!scheme) throw new Error('Chit scheme not found');

    const nextTicket = (scheme.members?.length || 0) + 1;
    const newMember: ChitMemberSubscription = {
      id: `sub-${chitId}-${nextTicket}`,
      chitId,
      customerId,
      customerName,
      customerCode,
      ticketNumber: nextTicket,
      joinedAt: new Date().toISOString().split('T')[0],
      totalPaid: 0,
      totalDue: scheme.monthlyContribution,
      isPrized: false,
      dividendEarned: 0,
      status: 'ACTIVE',
    };

    if (!scheme.members) scheme.members = [];
    scheme.members.push(newMember);
    scheme.enrolledMembersCount = scheme.members.length;

    return newMember;
  },

  async updateChit(id: string, input: Partial<ChitScheme>): Promise<ChitScheme> {
    if (!USE_MOCK) {
      const response = await apiClient.put<{ success: boolean; data: ChitScheme }>(`/chits/${id}`, input);
      return response.data.data;
    }
    const idx = inMemoryChits.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Chit scheme not found');

    const updated = {
      ...inMemoryChits[idx],
      ...input,
    };
    inMemoryChits[idx] = updated;
    return updated;
  },
};
