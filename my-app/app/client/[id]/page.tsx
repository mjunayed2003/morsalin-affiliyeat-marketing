import type { Metadata } from 'next';
import { ClientProductView } from '@/app/p/[id]/ClientProductView';
import { INITIAL_PRODUCTS } from '@/app/data/initialProducts';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: 'Shared Item - ByteDesk',
      description: 'Exclusive product shared directly with you.'
    };
  }

  return {
    title: `${product.title} - $${product.price.toLocaleString()} | ByteDesk`,
    description: `Price: $${product.price.toLocaleString()} (Regular: $${product.originalPrice.toLocaleString()}). Tap to view full product photo and order directly via chat.`,
    openGraph: {
      title: `${product.title} - $${product.price.toLocaleString()}`,
      description: `Special Offer: $${product.price.toLocaleString()} • Cash on Delivery & Live Chat Available`,
      url: `https://affilihub.com/p/${product.id}`,
      siteName: 'ByteDesk Store',
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
      description: `Special Offer: $${product.price.toLocaleString()}`,
      images: [product.image]
    }
  };
}

export default async function ClientPageRoute({ params }: PageProps) {
  const { id } = await params;
  return <ClientProductView productId={id} />;
}
