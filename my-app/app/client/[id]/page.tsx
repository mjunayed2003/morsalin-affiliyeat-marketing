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
      title: 'Shared Product | FreeProducts.online',
      description: 'Verified Amazon review product shared directly with you.'
    };
  }

  return {
    title: `${product.title} - Free Amazon Review Perk | FreeProducts.online`,
    description: `Test this ${product.title} for FREE! (Est. Retail: $${product.originalPrice.toLocaleString()}). Tap to view product details and request review instructions.`,
    openGraph: {
      title: `${product.title} - 100% Free Amazon Review Perk`,
      description: `Test ${product.title} for free! 100% free with Prime shipping.`,
      url: `https://freeproducts.online/p/${product.id}`,
      siteName: 'FreeProducts.online',
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
