import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-101",
    title: "T900 Ultra Series 9 Smart Watch with Bluetooth Calling",
    description: "2.09-inch HD Infinite Display, Wireless Fast Charging, Heart Rate & SpO2 Monitor, 50+ Sports Modes with IP68 Water Resistance.",
    category: "Smart Gadgets",
    price: 1850,
    originalPrice: 2450,
    commission: "৳320 (17%)",
    commissionAmount: 320,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-T900-ULTRA",
    features: [
      "2.09\" HD IPS Display",
      "Wireless Fast Charging Support",
      "Bluetooth HD Calling & Notifications",
      "Custom Watch Faces & Health Sensors"
    ],
    rating: 4.8,
    reviewsCount: 142,
    badge: "Best Seller",
    inStock: true,
    createdAt: "2026-09-15T10:00:00Z"
  },
  {
    id: "prod-102",
    title: "M10 TWS Wireless Earbuds with 2000mAh Power Bank Case",
    description: "Deep Bass 9D Stereo Sound, Touch Control, LED Digital Display case, CVC8.0 Noise Cancelling & Emergency Power Bank function.",
    category: "Smart Gadgets",
    price: 950,
    originalPrice: 1400,
    commission: "৳180 (19%)",
    commissionAmount: 180,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-M10-TWS",
    features: [
      "2000mAh Powerbank Battery Case",
      "Hi-Fi 9D Surround Bass",
      "Dual LED Battery Indicator",
      "IPX7 Waterproof & Sweatproof"
    ],
    rating: 4.6,
    reviewsCount: 289,
    badge: "Hot Deal",
    inStock: true,
    createdAt: "2026-09-18T12:30:00Z"
  },
  {
    id: "prod-103",
    title: "Magnetic 10,000mAh Wireless Fast Power Bank 20W PD",
    description: "Ultra-slim Snap & Charge MagSafe compatible power bank with folding metal stand and dual USB-C rapid charging ports.",
    category: "Mobile Accessories",
    price: 2650,
    originalPrice: 3200,
    commission: "৳450 (17%)",
    commissionAmount: 450,
    image: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-MAG-10K",
    features: [
      "Strong N52 Magnetic Grip",
      "20W PD Super Fast Delivery",
      "Built-in Folding Kickstand",
      "Overheat & Surge Protection"
    ],
    rating: 4.9,
    reviewsCount: 96,
    badge: "Affiliate Pick",
    inStock: true,
    createdAt: "2026-09-20T14:15:00Z"
  },
  {
    id: "prod-104",
    title: "Vintage Handcrafted Genuine Leather Bifold Wallet",
    description: "Top-grain cowhide leather with RFID blocking security lining, 8 card slots, dual cash compartments, and coin zipper pocket.",
    category: "Fashion & Lifestyle",
    price: 1250,
    originalPrice: 1750,
    commission: "৳220 (18%)",
    commissionAmount: 220,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-LEATHER-WLT",
    features: [
      "100% Top Grain Cowhide Leather",
      "RFID Protection Against Scanning",
      "Compact Slim Pocket Profile",
      "Comes with Premium Gift Box"
    ],
    rating: 4.7,
    reviewsCount: 168,
    badge: "Trending",
    inStock: true,
    createdAt: "2026-09-22T09:45:00Z"
  },
  {
    id: "prod-105",
    title: "Rechargeable Bladeless Neck Fan 4000mAh 360° Airflow",
    description: "Hands-free personal cooling neck fan with 3 speed levels, ultra-quiet brushless motor, and up to 14 hours continuous runtime.",
    category: "Lifestyle",
    price: 1450,
    originalPrice: 1950,
    commission: "৳260 (18%)",
    commissionAmount: 260,
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-NECK-FAN",
    features: [
      "Bladeless Safe Air Outlets",
      "4000mAh Long-lasting Battery",
      "Ultra-quiet Silent Engine",
      "Lightweight Ergonomic Design"
    ],
    rating: 4.5,
    reviewsCount: 74,
    badge: "Hot Deal",
    inStock: true,
    createdAt: "2026-09-25T11:20:00Z"
  },
  {
    id: "prod-106",
    title: "4K Ultra HD Dual Lens Action Camera with Waterproof Case",
    description: "Native 4K 60FPS video recording, EIS anti-shake stabilization, front & rear dual screens, and 30M waterproof diving casing.",
    category: "Electronics",
    price: 4950,
    originalPrice: 6500,
    commission: "৳850 (17%)",
    commissionAmount: 850,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-ACTION-CAM",
    features: [
      "4K 60FPS Crisp Video Recording",
      "Electronic Image Stabilization",
      "30m Deep Waterproof Case Included",
      "WiFi Live Smartphone Connection"
    ],
    rating: 4.9,
    reviewsCount: 112,
    badge: "Affiliate Pick",
    inStock: true,
    createdAt: "2026-09-28T16:00:00Z"
  }
];

export const INITIAL_CHAT_MESSAGES = [
  {
    id: "msg-1",
    sender: "admin" as const,
    text: "আসসালামু আলাইকুম! আমাদের শপে স্বাগতম। আপনি যেকোনো প্রোডাক্টের অর্ডার বা অ্যাফিলিয়েট কমিশন সম্পর্কে জানতে এখানে মেসেজ করতে পারেন বা ছবি পাঠাতে পারেন।",
    timestamp: "10:00 AM",
    read: true
  }
];
