import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

const siteUrl = "https://freeproducts.online";
const siteName = "FreeProducts.online";
const defaultTitle = "FreeProducts.online - Curated Amazon Deals & Verified Product Reviews";
const defaultDescription = "Discover top-rated Amazon products, exclusive promotional deals, and honest customer reviews. Join our verified reviewer community today.";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1b3b2b" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1329" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  applicationName: siteName,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FreeProducts",
  },
  formatDetection: {
    telephone: false,
  },
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  keywords: [
    "amazon deals",
    "curated amazon products",
    "product reviews",
    "amazon discounts",
    "verified reviewer community",
    "electronics deals",
    "home goods deals",
    "honest product reviews",
    "freeproducts.online"
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
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "FreeProducts.online - Curated Amazon Deals and Product Reviews",
        type: "image/jpeg",
      },
      {
        url: `${siteUrl}/logo.jpeg`,
        width: 1085,
        height: 362,
        alt: "FreeProducts.online Official Brand Logo",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [`${siteUrl}/og-image.jpg`],
    creator: "@onlinefreeproducts",
  },
  icons: {
    icon: [
      { url: '/browser-icon.png', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/browser-icon.png', type: 'image/png', sizes: '180x180' },
    ],
    shortcut: '/browser-icon.png',
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
      "alternateName": [
        "Free Products",
        "Free Products Online",
        "FreeProduct",
        "Amazon Deals & Reviews",
        "FreeProducts"
      ],
      "description": "Curated Amazon Deals & Community Reviews. Discover verified product discounts and authentic shopper insights.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://freeproducts.online/products?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://freeproducts.online/#organization",
      "name": "FreeProducts.online",
      "alternateName": "Free Products Online",
      "url": "https://freeproducts.online",
      "logo": "https://freeproducts.online/logo.jpeg",
      "image": "https://freeproducts.online/og-image.jpg",
      "sameAs": [
        "https://www.facebook.com/share/1dAcJt9QhV/",
        "https://www.instagram.com/onlinefreeproducts",
        "https://t.me/+8801603383215"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+8801340376081",
        "contactType": "customer service",
        "areaServed": "US",
        "availableLanguage": ["English", "Bengali"]
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://freeproducts.online/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do curated deals work on FreeProducts.online?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We curate top-rated Amazon deals and promotions from verified sellers to help shoppers discover high-quality products at exceptional discounts, paired with genuine community reviews."
          }
        },
        {
          "@type": "Question",
          "name": "How do I participate in product evaluations?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Browse our curated catalog, view the product details on Amazon, and share your feedback with our community. Verified reviewers share insights to help other shoppers make informed buying decisions."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need an active Amazon account?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Deals link directly to official Amazon product pages where you can purchase directly with Amazon customer protections and Prime shipping."
          }
        },
        {
          "@type": "Question",
          "name": "Are deals updated regularly?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our team updates featured deals and promotional offers daily to provide the most current pricing and discounts."
          }
        }
      ]
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
        <link rel="icon" type="image/png" href="/browser-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/browser-icon.png" />
        <link rel="shortcut icon" href="/browser-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FreeProducts" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Analytics & Firebase Measurement (G-6C6CX24JR9) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-6C6CX24JR9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-6C6CX24JR9', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
