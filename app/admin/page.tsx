import type { Metadata } from 'next';
import { AdminPageClient } from './AdminPageClient';

export const metadata: Metadata = {
  title: 'Owner Studio - PersonalDesk Management',
  description: 'Manage client items, upload custom product photos, and handle client inquiries.'
};

export default function AdminRoute() {
  return <AdminPageClient />;
}
