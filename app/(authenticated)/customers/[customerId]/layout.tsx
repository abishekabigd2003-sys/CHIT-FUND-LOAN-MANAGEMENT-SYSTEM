'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCustomer } from '@/hooks/useCustomers';
import { CustomerProfileHeader } from '@/components/customers/CustomerProfileHeader';
import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { Users } from 'lucide-react';

export default function CustomerDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const customerId = params?.customerId as string;
  const { data: customer, isLoading, error } = useCustomer(customerId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <EmptyState
        icon={Users}
        title="Customer Not Found"
        description="The requested customer profile could not be located in the database."
        actionLabel="Back to Customers"
        onAction={() => router.push('/customers')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <CustomerProfileHeader customer={customer} />
      <div>{children}</div>
    </div>
  );
}
