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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeproducts.online';

  if (!product) {
    return {
      metadataBase: new URL(siteUrl),
      title: 'Free Amazon Review Perk | FreeProducts.online',
      description: 'Verified Amazon Review Product available on FreeProducts.online.',
      alternates: {
        canonical: `${siteUrl}/products`,
      },
    };
  }

  const pageUrl = `${siteUrl}/p/${product.id}`;
  const imageUrl = product.image;

  return {
    metadataBase: new URL(siteUrl),
    title: `${product.title} - Free Amazon Review Perk | FreeProducts.online`,
    description: `Test this ${product.title} from verified Amazon store ${product.store || 'Amazon'}. Est. Retail: $${product.originalPrice}. Claim 100% Free on FreeProducts.online!`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${product.title} - 100% Free Amazon Review Perk`,
      description: `Test this ${product.title} for FREE! Est. Retail: $${product.originalPrice}. Verified seller ${product.store || 'Amazon'}.`,
      url: pageUrl,
      siteName: 'FreeProducts.online Amazon Review Club',
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
      creator: '@onlinefreeproducts',
    },
  };
}

export default async function ProductPageRoute({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeproducts.online';
  const pageUrl = `${siteUrl}/p/${id}`;

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
          price: '0.00',
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
      <ClientProductView productId={id} />
    </>
  );
}
