import apiClient from '@/lib/axios';
import { Customer, CreateCustomerInput } from '@/types/customer';
import { PaginatedResponse, QueryParams } from '@/types/api';
import { mockCustomers } from './mock-data/customers';
import { mockLoans } from './mock-data/loans';
import { mockChitSchemes } from './mock-data/chits';
import { mockPayments } from './mock-data/payments';
import { mockDocuments } from './mock-data/documents';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

let inMemoryCustomers = [...mockCustomers];

export const customerService = {
  async getCustomers(params?: QueryParams): Promise<PaginatedResponse<Customer>> {
    if (!USE_MOCK) {
      const response = await apiClient.get<PaginatedResponse<Customer>>('/customers', { params });
      return response.data;
    }

    let filtered = [...inMemoryCustomers];
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.customerCode.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    if (params?.status && params.status !== 'ALL') {
      filtered = filtered.filter((c) => c.status === params.status);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const data = filtered.slice(startIndex, startIndex + limit);

    return {
      success: true,
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  },

  async getCustomerById(id: string): Promise<Customer> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: Customer }>(`/customers/${id}`);
      return response.data.data;
    }
    const customer = inMemoryCustomers.find((c) => c.id === id || c.customerCode === id);
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found.`);
    }
    return customer;
  },

  async createCustomer(input: CreateCustomerInput): Promise<Customer> {
    if (!USE_MOCK) {
      const response = await apiClient.post<{ success: boolean; data: Customer }>('/customers', input);
      return response.data.data;
    }

    const newCode = `CUST-${1000 + inMemoryCustomers.length + 1}`;
    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      customerCode: newCode,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      alternatePhone: input.alternatePhone,
      dob: input.dob,
      gender: input.gender,
      status: 'PENDING',
      address: {
        addressLine1: input.addressLine1,
        addressLine2: input.addressLine2,
        city: input.city,
        state: input.state,
        pincode: input.pincode,
        country: input.country || 'India',
      },
      kyc: {
        aadharNumber: input.aadharNumber,
        panNumber: input.panNumber,
        occupation: input.occupation,
        annualIncome: Number(input.annualIncome),
        nomineeName: input.nomineeName,
        nomineeRelationship: input.nomineeRelationship,
        nomineePhone: input.nomineePhone,
      },
      stats: {
        activeChits: 0,
        activeLoans: 0,
        totalInvested: 0,
        totalLoanOutstanding: 0,
        completedChits: 0,
        creditScore: 720,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryCustomers.unshift(newCustomer);
    return newCustomer;
  },

  async updateCustomer(id: string, input: Partial<Customer>): Promise<Customer> {
    if (!USE_MOCK) {
      const response = await apiClient.put<{ success: boolean; data: Customer }>(`/customers/${id}`, input);
      return response.data.data;
    }
    const index = inMemoryCustomers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Customer not found');

    const updated = {
      ...inMemoryCustomers[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };
    inMemoryCustomers[index] = updated;
    return updated;
  },

  async getCustomerLoans(customerId: string): Promise<typeof mockLoans> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: typeof mockLoans }>(`/customers/${customerId}/loans`);
      return response.data.data;
    }
    return mockLoans.filter((l) => l.customerId === customerId);
  },

  async getCustomerChits(customerId: string): Promise<typeof mockChitSchemes> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: typeof mockChitSchemes }>(`/customers/${customerId}/chits`);
      return response.data.data;
    }
    return mockChitSchemes.filter((c) => c.members?.some((m) => m.customerId === customerId));
  },

  async getCustomerPayments(customerId: string): Promise<typeof mockPayments> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: typeof mockPayments }>(`/customers/${customerId}/payments`);
      return response.data.data;
    }
    return mockPayments.filter((p) => p.customerId === customerId);
  },

  async getCustomerDocuments(customerId: string): Promise<typeof mockDocuments> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: typeof mockDocuments }>(`/customers/${customerId}/documents`);
      return response.data.data;
    }
    return mockDocuments.filter((d) => d.customerId === customerId);
  },
};
