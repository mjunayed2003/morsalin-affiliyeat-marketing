import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Free Products Online - Amazon Product Reviews & Free Testing Club',
    short_name: 'FreeProducts',
    description: 'Get 100% free Amazon products to test and review with FreeProducts.online.',
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
