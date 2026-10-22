import type { Metadata } from 'next';

const siteUrl = 'https://freeproducts.online';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Free Products Catalog - Test & Keep Free Amazon Products',
  description: 'Browse all active free product campaigns. Test top Amazon items from verified sellers in Skincare, Tech, Home & Garden, Pet Care & more. 100% free with US Prime delivery.',
  keywords: [
    'free product',
    'free products catalog',
    'free products list',
    'free amazon items',
    'product testing campaigns',
    'free amazon products usa',
    'amazon review items',
    'freeproducts.online products'
  ],
  alternates: {
    canonical: `${siteUrl}/products`,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `${siteUrl}/products`,
    siteName: 'FreeProducts.online',
    title: 'Free Products Catalog - Test & Keep Free Amazon Products',
    description: 'Browse all active free product campaigns. Test top Amazon items from verified sellers. 100% free with zero fees.',
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
    title: 'Free Products Catalog - Test & Keep Free Amazon Products',
    description: 'Browse all active free product campaigns from verified sellers. 100% free items.',
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
