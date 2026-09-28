import {
  CollectionTask,
  CreateCollectionTaskInput,
  AddCollectionRemarkInput,
  CollectionRemark,
} from '@/types/collection';
import { mockCollectionTasks } from './mock-data/collections';
import { mockCustomers } from './mock-data/customers';

let collectionTasksStore: CollectionTask[] = [...mockCollectionTasks];

export const collectionService = {
  async getAllTasks(params?: {
    staffId?: string;
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<CollectionTask[]> {
    let list = [...collectionTasksStore];

    if (params?.staffId) {
      list = list.filter((t) => t.assignedStaffId === params.staffId);
    }
    if (params?.status && params.status !== 'ALL') {
      list = list.filter((t) => t.status === params.status);
    }
    if (params?.priority && params.priority !== 'ALL') {
      list = list.filter((t) => t.priority === params.priority);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.customerName.toLowerCase().includes(q) ||
          t.taskNumber.toLowerCase().includes(q) ||
          t.loanNumber.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getMyTasks(staffId: string): Promise<CollectionTask[]> {
    return collectionTasksStore.filter(
      (t) => t.assignedStaffId === staffId && t.status !== 'CLOSED' && t.status !== 'COLLECTED'
    );
  },

  async getTaskById(id: string): Promise<CollectionTask | null> {
    return collectionTasksStore.find((t) => t.id === id) || null;
  },

  async addRemark(input: AddCollectionRemarkInput): Promise<CollectionTask> {
    const idx = collectionTasksStore.findIndex((t) => t.id === input.taskId);
    if (idx === -1) throw new Error('Task not found');

    const newRemark: CollectionRemark = {
      id: `rem-${Date.now()}`,
      taskId: input.taskId,
      staffId: 'usr-staff-1',
      staffName: 'Karthik Raman',
      interactionType: input.interactionType,
      outcome: input.outcome,
      amountCollected: input.amountCollected,
      nextFollowUpDate: input.nextFollowUpDate,
      notes: input.notes,
      location: input.location,
      createdAt: new Date().toISOString(),
    };

    const task = collectionTasksStore[idx];
    const newCollectedAmount = (task.collectedAmount || 0) + (input.amountCollected || 0);
    const isFullyPaid = newCollectedAmount >= task.dueAmount;

    collectionTasksStore[idx] = {
      ...task,
      collectedAmount: newCollectedAmount,
      status: isFullyPaid
        ? 'COLLECTED'
        : input.amountCollected && input.amountCollected > 0
        ? 'PARTIALLY_COLLECTED'
        : input.nextFollowUpDate
        ? 'FOLLOW_UP'
        : task.status,
      nextFollowUpDate: input.nextFollowUpDate || task.nextFollowUpDate,
      lastFollowUpDate: new Date().toISOString().split('T')[0],
      remarks: [newRemark, ...(task.remarks || [])],
      updatedAt: new Date().toISOString(),
    };

    return collectionTasksStore[idx];
  },

  async createTask(input: CreateCollectionTaskInput): Promise<CollectionTask> {
    const customer = mockCustomers.find((c) => c.id === input.customerId);

    const newTask: CollectionTask = {
      id: `tsk-${Date.now().toString().slice(-4)}`,
      taskNumber: `COL-2024-${Math.floor(200 + Math.random() * 800)}`,
      customerId: input.customerId,
      customerName: customer ? `${customer.firstName} ${customer.lastName}` : 'Valued Customer',
      customerPhone: customer?.phone || '+91 98401 00000',
      customerAddress: customer?.address
        ? `${customer.address.addressLine1}, ${customer.address.city}`
        : 'Registered Address, Chennai',
      loanId: input.loanId,
      loanNumber: `LN-${Math.floor(1000 + Math.random() * 9000)}`,
      loanType: 'Term Loan',
      dueAmount: input.dueAmount,
      dueDate: input.dueDate,
      daysOverdue: Math.max(
        0,
        Math.floor((Date.now() - new Date(input.dueDate).getTime()) / (1000 * 3600 * 24))
      ),
      totalOutstanding: input.dueAmount * 3,
      assignedStaffId: input.assignedStaffId || 'usr-staff-1',
      assignedStaffName:
        input.assignedStaffId === 'usr-staff-2' ? 'Ananya Deshmukh' : 'Karthik Raman',
      priority: input.priority,
      status: 'ASSIGNED',
      collectedAmount: 0,
      recoveryStage: 'EARLY',
      remarks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    collectionTasksStore = [newTask, ...collectionTasksStore];
    return newTask;
  },

  async escalateTask(
    taskId: string,
    stage: 'MID' | 'LEGAL' | 'SETTLEMENT',
    notes: string
  ): Promise<CollectionTask> {
    const idx = collectionTasksStore.findIndex((t) => t.id === taskId);
    if (idx === -1) throw new Error('Task not found');

    const task = collectionTasksStore[idx];
    collectionTasksStore[idx] = {
      ...task,
      status: 'ESCALATED',
      recoveryStage: stage,
      priority: 'CRITICAL',
      remarks: [
        {
          id: `rem-esc-${Date.now()}`,
          taskId,
          staffId: 'usr-admin-1',
          staffName: 'Recovery Department',
          interactionType: 'LEGAL_NOTICE',
          outcome: `Escalated to ${stage} recovery pipeline.`,
          notes,
          createdAt: new Date().toISOString(),
        },
        ...task.remarks,
      ],
      updatedAt: new Date().toISOString(),
    };
    return collectionTasksStore[idx];
  },

  async getCollectionMetrics() {
    const totalDue = collectionTasksStore.reduce((acc, t) => acc + t.dueAmount, 0);
    const totalCollected = collectionTasksStore.reduce((acc, t) => acc + t.collectedAmount, 0);
    const overdueTasks = collectionTasksStore.filter(
      (t) => t.status === 'OVERDUE' || t.status === 'ESCALATED' || t.daysOverdue > 0
    );
    const todayTasks = collectionTasksStore.filter((t) => t.status !== 'COLLECTED');

    return {
      totalDue,
      totalCollected,
      collectionEfficiency: Math.round((totalCollected / (totalDue || 1)) * 100),
      activeTasksCount: todayTasks.length,
      overdueTasksCount: overdueTasks.length,
      escalatedCount: collectionTasksStore.filter((t) => t.status === 'ESCALATED').length,
    };
  },
};
