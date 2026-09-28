import apiClient from '@/lib/axios';
import { PaymentRecord, RecordPaymentPayload } from '@/types/payment';
import { PaymentStatus } from '@/types/loan';
import { mockPayments } from './mock-data/payments';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

let inMemoryPayments = [...mockPayments];

export const paymentService = {
  async getPayments(params?: {
    status?: PaymentStatus | 'ALL';
    category?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    customerId?: string;
  }): Promise<PaymentRecord[]> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: PaymentRecord[] }>('/payments', { params });
      return response.data.data;
    }
    let result = [...inMemoryPayments];

    if (params?.customerId) {
      result = result.filter((p) => p.customerId === params.customerId);
    }
    if (params?.status && params.status !== 'ALL') {
      result = result.filter((p) => p.status === params.status);
    }
    if (params?.category && params.category !== 'ALL') {
      result = result.filter((p) => p.category === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.customerName.toLowerCase().includes(q) ||
          p.receiptNumber.toLowerCase().includes(q) ||
          p.referenceCode.toLowerCase().includes(q)
      );
    }

    return result;
  },

  async recordPayment(payload: RecordPaymentPayload): Promise<PaymentRecord> {
    if (!USE_MOCK) {
      const response = await apiClient.post<{ success: boolean; data: PaymentRecord }>('/payments', payload);
      return response.data.data;
    }

    const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNo,
      customerId: payload.customerId,
      customerName: "Customer Name",
      category: payload.category,
      referenceId: payload.referenceId,
      referenceCode: `REF-${payload.referenceId.slice(0, 8)}`,
      installmentNumber: payload.installmentNumber,
      dueDate: new Date().toISOString().split('T')[0],
      amountDue: payload.amountPaid,
      amountPaid: payload.amountPaid,
      penaltyPaid: payload.penaltyAmount || 0,
      paidDate: new Date().toISOString().split('T')[0],
      paymentMethod: payload.paymentMethod,
      transactionReference: payload.transactionReference || `TXN-${Date.now().toString().slice(-6)}`,
      status: 'PAID',
      notes: payload.notes,
      collectedBy: 'Logged-in Agent',
    };

    inMemoryPayments.unshift(newRecord);
    return newRecord;
  },

  async getOverduePayments(): Promise<PaymentRecord[]> {
    return this.getPayments({ status: 'OVERDUE' });
  },

  async getCollections(): Promise<PaymentRecord[]> {
    return this.getPayments({ status: 'PAID' });
  },
};
