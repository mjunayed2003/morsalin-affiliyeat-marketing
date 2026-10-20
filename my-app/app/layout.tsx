import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

const siteUrl = "https://freeproducts.online";
const siteName = "FreeProducts.online";
const defaultTitle = "FreeProducts.online - Amazon Product Reviews & Free Testing Club USA";
const defaultDescription = "Get 100% free Amazon products to test and review with FreeProducts.online. Join verified USA reviewers, test high-quality items from verified Amazon sellers, and keep every product with zero fees.";

export const viewport: Viewport = {
  themeColor: "#1b3b2b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  keywords: [
    "free products",
    "freeproducts.online",
    "free amazon products",
    "amazon product testing",
    "amazon review perks",
    "amazon review club",
    "free products for reviews",
    "test amazon products for free",
    "amazon rebate club usa",
    "verified amazon reviewer"
  ],
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "FreeProducts.online - Amazon Review & Free Testing Club",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&h=630&q=80"],
    creator: "@onlinefreeproducts",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://freeproducts.online/#website",
      "url": "https://freeproducts.online",
      "name": "FreeProducts.online",
      "description": "Amazon Product Reviews & Free Testing Club USA",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://freeproducts.online/products?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://freeproducts.online/#organization",
      "name": "FreeProducts.online",
      "url": "https://freeproducts.online",
      "logo": "https://freeproducts.online/favicon.ico",
      "sameAs": [
        "https://www.instagram.com/onlinefreeproducts"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+8801340376081",
        "contactType": "customer service",
        "availableLanguage": ["English", "Bengali"]
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
