import type { Metadata } from 'next';
import { ClientPageClient } from './ClientPageClient';
import { INITIAL_PRODUCTS } from '../../data/initialProducts';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: 'Shared Item - PersonalDesk',
      description: 'Exclusive product shared directly with you.'
    };
  }

  return {
    title: `${product.title} - Special Client Offer`,
    description: `Deal Price: ৳${product.price.toLocaleString()} (Regular: ৳${product.originalPrice.toLocaleString()}). Tap to view full product photo and order directly via private chat.`,
    openGraph: {
      title: `${product.title} - ৳${product.price.toLocaleString()}`,
      description: `Special Client Offer: ৳${product.price.toLocaleString()} • Cash on Delivery Available`,
      url: `https://affilihub.com/client/${product.id}`,
      siteName: 'PersonalDesk',
      images: [
        {
          url: product.image,
          width: 1200,
          height: 630,
          alt: product.title
        }
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: `Special Client Offer: ৳${product.price.toLocaleString()}`,
      images: [product.image]
    }
  };
}

export default async function ClientPageRoute({ params }: PageProps) {
  const { id } = await params;
  return <ClientPageClient productId={id} />;
}
