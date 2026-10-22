import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

const siteUrl = "https://freeproducts.online";
const siteName = "FreeProducts.online";
const defaultTitle = "Free Products Online - Get 100% Free Amazon Products to Test & Keep";
const defaultDescription = "Looking for free products? Join FreeProducts.online! Test brand-new items from verified Amazon sellers, share authentic reviews, and keep every item with zero cost. 100% free with Prime shipping in the USA.";

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
    "free product",
    "free products",
    "free products online",
    "freeproducts.online",
    "free amazon products",
    "amazon product testing",
    "amazon review club",
    "test amazon products for free",
    "free items for review",
    "amazon rebate club usa",
    "verified amazon reviewer",
    "free stuff",
    "free product testing usa",
    "get free products",
    "keep free products"
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
        alt: "FreeProducts.online Logo & Social Preview Banner - 100% Free Amazon Products",
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
        "Free Amazon Products Club",
        "FreeProducts"
      ],
      "description": "Amazon Product Reviews & Free Testing Club USA. Get 100% free products to test and keep forever.",
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
          "name": "Are these Amazon products really 100% free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Verified partner Amazon stores sponsor these units to gather authentic feedback from real shoppers. There are no hidden fees or subscriptions — every approved product is yours to keep forever."
          }
        },
        {
          "@type": "Question",
          "name": "How do I order and submit my Amazon review?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Browse any item on FreeProducts.online, click 'Get It Free' or live chat directly with our admin. You will receive the official Amazon link to place your order with Prime, test the item at home, and publish your helpful, honest review on Amazon."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need an active Amazon account?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. This program is designed for active US shoppers with an Amazon account in good standing so you can receive fast Prime delivery and post verified customer reviews."
          }
        },
        {
          "@type": "Question",
          "name": "Do I ever have to return the products?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Never! Every single item you test through FreeProducts.online is 100% yours to keep permanently."
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
