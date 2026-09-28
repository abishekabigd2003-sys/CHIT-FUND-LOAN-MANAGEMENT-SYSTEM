import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customer.service';
import { QueryParams } from '@/types/api';
import { CreateCustomerInput, Customer } from '@/types/customer';
import { useToast } from '@/providers/ToastProvider';

export function useCustomers(params?: QueryParams) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customerService.getCustomers(params),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customerService.getCustomerById(id),
    enabled: !!id,
  });
}

export function useCustomerChits(customerId: string) {
  return useQuery({
    queryKey: ['customer-chits', customerId],
    queryFn: () => customerService.getCustomerChits(customerId),
    enabled: !!customerId,
  });
}

export function useCustomerLoans(customerId: string) {
  return useQuery({
    queryKey: ['customer-loans', customerId],
    queryFn: () => customerService.getCustomerLoans(customerId),
    enabled: !!customerId,
  });
}

export function useCustomerPayments(customerId: string) {
  return useQuery({
    queryKey: ['customer-payments', customerId],
    queryFn: () => customerService.getCustomerPayments(customerId),
    enabled: !!customerId,
  });
}

export function useCustomerDocuments(customerId: string) {
  return useQuery({
    queryKey: ['customer-documents', customerId],
    queryFn: () => customerService.getCustomerDocuments(customerId),
    enabled: !!customerId,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (input: CreateCustomerInput) => customerService.createCustomer(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer Registered Successfully', `Customer ${data.firstName} ${data.lastName} added with code ${data.customerCode}`);
    },
    onError: (err: any) => {
      toast.error('Registration Failed', err.message || 'Could not register customer');
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) => customerService.updateCustomer(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customer', data.id] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Customer Updated', 'Profile details updated successfully');
    },
    onError: (err: any) => {
      toast.error('Update Failed', err.message || 'Could not update customer');
    },
  });
}
