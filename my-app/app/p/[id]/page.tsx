import type { Metadata } from 'next';
import { ClientProductView } from './ClientProductView';
import { INITIAL_PRODUCTS } from '../../data/initialProducts';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = INITIAL_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    return {
      title: 'Product - Private Client View',
      description: 'Private product share link.'
    };
  }

  return {
    title: `${product.title} - $${product.price.toLocaleString()} | ProductPerks`,
    description: `Price: $${product.price.toLocaleString()} (Regular: $${product.originalPrice.toLocaleString()}). Tap to view full product details and chat live with admin.`,
    openGraph: {
      title: `${product.title} - $${product.price.toLocaleString()}`,
      description: `Price: $${product.price.toLocaleString()} • Live 1-on-1 Chat with Admin & Direct Order`,
      url: `https://productperks.com/p/${product.id}`,
      siteName: 'ProductPerks',
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
      description: `Price: $${product.price.toLocaleString()}`,
      images: [product.image]
    }
  };
}

export default async function ProductPageRoute({ params }: PageProps) {
  const { id } = await params;
  return <ClientProductView productId={id} />;
}
