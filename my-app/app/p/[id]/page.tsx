import type { Metadata } from 'next';
import { ClientProductView } from './ClientProductView';
import { INITIAL_PRODUCTS } from '../../data/initialProducts';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string) {
  try {
    const res = await fetch(`http://localhost:3001/api/products/${id}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) return data;
    }
  } catch (err) {}
  return INITIAL_PRODUCTS.find((p) => p.id === id);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product - Review Perk | ProductPerks',
      description: 'Verified Amazon Review Product'
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://productperks.com';
  const pageUrl = `${siteUrl}/p/${product.id}`;
  const imageUrl = product.image;

  return {
    metadataBase: new URL(siteUrl),
    title: `${product.title} - Free Amazon Review Perk | ProductPerks`,
    description: `Test this ${product.title} from verified Amazon store ${product.store || 'Amazon'}. Est. Retail: $${product.originalPrice}. 100% Free rebate!`,
    openGraph: {
      title: `${product.title} - 100% Free Amazon Review Perk`,
      description: `Test this ${product.title} for FREE! Est. Retail: $${product.originalPrice}. Verified seller ${product.store || 'Amazon'}.`,
      url: pageUrl,
      siteName: 'ProductPerks Amazon Review Club',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} - Free Amazon Review Perk`,
      description: `Claim this free review item from ${product.store || 'Amazon'}. Est. Retail: $${product.originalPrice}.`,
      images: [imageUrl],
    },
  };
}

export default async function ProductPageRoute({ params }: PageProps) {
  const { id } = await params;
  return <ClientProductView productId={id} />;
}
