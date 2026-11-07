import type { Metadata } from 'next';

const siteUrl = 'https://freeproducts.online';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Curated Amazon Products & Deals Catalog | FreeProducts.online',
  description: 'Browse our curated catalog of top-rated Amazon products, exclusive deals, and verified community reviews across Tech, Home & Garden, Pet Care, and more.',
  keywords: [
    'amazon deals catalog',
    'curated amazon products',
    'amazon product reviews',
    'verified seller deals',
    'freeproducts catalog'
  ],
  alternates: {
    canonical: `${siteUrl}/products`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/products`,
    siteName: 'FreeProducts.online',
    title: 'Curated Amazon Products & Deals Catalog | FreeProducts.online',
    description: 'Explore top-rated Amazon products, promotional discounts, and verified customer reviews.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'FreeProducts.online Catalog',
      },
      {
        url: `${siteUrl}/logo.jpeg`,
        width: 1085,
        height: 362,
        alt: 'FreeProducts.online Official Brand Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curated Amazon Products & Deals Catalog | FreeProducts.online',
    description: 'Explore top-rated Amazon products, promotional discounts, and verified customer reviews.',
    images: [`${siteUrl}/og-image.jpg`],
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
