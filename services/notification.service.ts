import apiClient from '@/lib/axios';
import { NotificationItem } from '@/types/notification';
import { mockNotifications } from './mock-data/notifications';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';

let inMemoryNotifications = [...mockNotifications];

export const notificationService = {
  async getNotifications(): Promise<NotificationItem[]> {
    if (!USE_MOCK) {
      const response = await apiClient.get<{ success: boolean; data: NotificationItem[] }>('/notifications');
      return response.data.data;
    }
    return inMemoryNotifications;
  },

  async markAsRead(id: string): Promise<void> {
    if (!USE_MOCK) {
      await apiClient.patch(`/notifications/${id}/read`);
      return;
    }

    const item = inMemoryNotifications.find((n) => n.id === id);
    if (item) item.isRead = true;
  },

  async markAllAsRead(): Promise<void> {
    if (!USE_MOCK) {
      await apiClient.post('/notifications/read-all');
      return;
    }

    inMemoryNotifications = inMemoryNotifications.map((n) => ({ ...n, isRead: true }));
  },
};
