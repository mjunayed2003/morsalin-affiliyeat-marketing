import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "PersonalDesk - Private Client Showcase & Messenger Direct Share",
  description: "Share custom affiliate products and photos directly with clients on Messenger with rich live image previews and 1-on-1 private chat.",
  openGraph: {
    title: "PersonalDesk - Private Client Showcase & Messenger Direct Share",
    description: "Share custom affiliate products and photos directly with clients on Messenger with rich live image previews.",
    url: "https://affilihub.com",
    siteName: "PersonalDesk",
    images: [
      {
        url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "PersonalDesk Showcase"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "PersonalDesk - Private Client Showcase",
    description: "Share products directly to Messenger with rich live image previews.",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&h=630&q=80"]
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
