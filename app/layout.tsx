import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ProductPerks - Amazon Review Club | Free Products for Reviewers",
  description: "Test brand-name products from verified Amazon stores (LONG YUE, Lickoon, Imps Hair & more). Share honest reviews and keep products 100% free!",
  openGraph: {
    title: "ProductPerks - Amazon Review Club | Free Products for Reviewers",
    description: "Test brand-name products from verified Amazon stores. Share honest reviews and keep products 100% free!",
    url: "https://productperks.com",
    siteName: "ProductPerks",
    images: [
      {
        url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "ProductPerks Amazon Review Club"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "ProductPerks - Amazon Review Club",
    description: "Test products from verified Amazon stores, share honest reviews, and keep them free.",
    images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&h=630&q=80"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
