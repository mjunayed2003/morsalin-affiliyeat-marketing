import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FreeProducts.online - Curated Amazon Deals & Reviews',
    short_name: 'FreeProducts',
    description: 'Discover curated Amazon deals, discounts, and verified customer reviews with FreeProducts.online.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1b3b2b',
    icons: [
      {
        src: '/browser-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  };
}
