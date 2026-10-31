import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientPageRoute({ params }: PageProps) {
  const { id } = await params;
  redirect(`/p/${id}`);
}
