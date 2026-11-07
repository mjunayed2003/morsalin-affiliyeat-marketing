import type { Metadata } from 'next';
import { ClientProductView } from './ClientProductView';
import { Product } from '../../types';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');
    const res = await fetch(`${apiUrl}/products/${id}?_t=${Date.now()}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) return data;
    }
  } catch (err) {}
  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeproducts.online';

  if (!product) {
    return {
      metadataBase: new URL(siteUrl),
      title: 'Amazon Product Deal | FreeProducts.online',
      description: 'Curated Amazon deal and customer reviews on FreeProducts.online.',
      alternates: {
        canonical: `${siteUrl}/products`,
      },
    };
  }

  const pageUrl = `${siteUrl}/p/${product.id}`;
  const imageUrl = product.image;

  return {
    metadataBase: new URL(siteUrl),
    title: `${product.title} - Amazon Deals & Reviews | FreeProducts.online`,
    description: `Explore ${product.title} from verified Amazon seller ${product.store || 'Amazon'}. Verified retail: $${product.originalPrice}. Read community reviews and discover current deals.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${product.title} - Curated Amazon Product Deal`,
      description: `Explore ${product.title} from verified seller ${product.store || 'Amazon'}. Verified retail: $${product.originalPrice}. Read community reviews and deal details.`,
      url: pageUrl,
      siteName: 'FreeProducts.online',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        },
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: 'FreeProducts.online Product Deals and Reviews',
        },
        {
          url: `${siteUrl}/logo.jpeg`,
          width: 1085,
          height: 362,
          alt: 'FreeProducts.online Official Brand Logo',
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} - Amazon Deals & Reviews`,
      description: `Explore this curated deal on ${product.title} from ${product.store || 'Amazon'}. Verified retail: $${product.originalPrice}.`,
      images: [imageUrl],
      creator: '@onlinefreeproducts',
    },
  };
}

export default async function ProductPageRoute({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeproducts.online';
  const pageUrl = `${siteUrl}/p/${id}`;

  const productPrice = product?.price ? String(product.price) : (product?.originalPrice ? String(product.originalPrice) : '0.00');

  const productJsonLd = product
    ? {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.title,
        image: [product.image, ...(product.gallery || [])],
        description: product.description,
        sku: product.id,
        brand: {
          '@type': 'Brand',
          name: product.store || 'Amazon Partner',
        },
        offers: {
          '@type': 'Offer',
          url: pageUrl,
          priceCurrency: 'USD',
          price: productPrice,
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'FreeProducts.online',
          },
        },
      }
    : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ClientProductView productId={id} initialProduct={product || undefined} />
    </>
  );
}
