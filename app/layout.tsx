import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AffiliHub - প্রিমিয়াম অ্যাফিলিয়েট প্রোডাক্ট শোকেস ও মেসেঞ্জার ডিরেক্ট শেয়ার",
  description: "প্রোডাক্ট লিংক মেসেঞ্জারে শেয়ার করলেই দেখতে পাবেন আকর্ষণীয় ছবি ও প্রিভিউ। ওয়েবসাইটে রয়েছে কাস্টমার-অ্যাডমিন লাইভ ইনবক্স ও ইমেজ চ্যাটিং সুবিধা।",
  openGraph: {
    title: "AffiliHub - প্রিমিয়াম অ্যাফিলিয়েট প্রোডাক্ট শোকেস ও মেসেঞ্জার ডিরেক্ট শেয়ার",
    description: "প্রোডাক্ট লিংক মেসেঞ্জারে শেয়ার করলেই দেখতে পাবেন আকর্ষণীয় ছবি ও প্রিভিউ। ওয়েবসাইটে রয়েছে কাস্টমার-অ্যাডমিন লাইভ ইনবক্স ও ইমেজ চ্যাটিং সুবিধা।",
    url: "https://affilihub.com",
    siteName: "AffiliHub",
    images: [
      {
        url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "AffiliHub Products Showcase"
      }
    ],
    locale: "bn_BD",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AffiliHub - প্রিমিয়াম অ্যাফিলিয়েট প্রোডাক্ট শোকেস",
    description: "প্রোডাক্ট লিংক মেসেঞ্জারে শেয়ার করলেই দেখতে পাবেন আকর্ষণীয় ছবি ও প্রিভিউ।",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1200&h=630&q=80"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
