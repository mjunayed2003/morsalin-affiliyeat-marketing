import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-101",
    title: "T900 Ultra Series 9 Smart Watch with HD Bluetooth Calling",
    description: "2.09-inch HD Infinite Display, Wireless Fast Magnetic Charging, Real-time Heart Rate & SpO2 Monitoring, 50+ Sports Modes with IP68 Water Resistance.",
    category: "Smart Gadgets",
    price: 25,
    originalPrice: 35,
    commission: "$8 (22%)",
    commissionAmount: 8,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-T900-ULTRA",
    features: [
      "2.09\" HD IPS Curved Display",
      "Wireless Fast Magnetic Charger",
      "Bluetooth HD Calling & App Notifications",
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
    description: "Deep Bass 9D Stereo Surround Sound, Touch Sensor Controls, LED Digital Power Display case, CVC8.0 Noise Cancelling & Emergency Phone Charging.",
    category: "Smart Gadgets",
    price: 14,
    originalPrice: 20,
    commission: "$4 (20%)",
    commissionAmount: 4,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-M10-TWS",
    features: [
      "2000mAh Power Bank Battery Case",
      "Hi-Fi 9D Dynamic Bass Drivers",
      "Dual LED Battery Percentage Indicator",
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
    description: "Ultra-slim Snap & Charge MagSafe compatible power bank with sturdy folding metal stand and dual USB-C rapid bidirectional charging ports.",
    category: "Mobile Accessories",
    price: 35,
    originalPrice: 48,
    commission: "$9 (20%)",
    commissionAmount: 9,
    image: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-MAG-10K",
    features: [
      "Strong N52 Magnetic Grip Alignment",
      "20W PD Super Fast Power Delivery",
      "Built-in Folding Ergonomic Kickstand",
      "Smart Overheat & Surge Protection"
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
    description: "Top-grain cowhide leather with RFID blocking security shielding, 8 quick-access card slots, dual cash compartments, and coin zipper pouch.",
    category: "Fashion & Lifestyle",
    price: 19,
    originalPrice: 28,
    commission: "$5 (18%)",
    commissionAmount: 5,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-LEATHER-WLT",
    features: [
      "100% Top-Grain Cowhide Leather",
      "RFID Shielding Protection",
      "Compact Slim Pocket Silhouette",
      "Includes Premium Wooden Gift Box"
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
    description: "Hands-free personal cooling wearable neck fan with 3 speed levels, ultra-quiet brushless silent motor, and up to 14 hours continuous runtime.",
    category: "Lifestyle",
    price: 22,
    originalPrice: 32,
    commission: "$6 (19%)",
    commissionAmount: 6,
    image: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-NECK-FAN",
    features: [
      "Bladeless Safe Anti-Twist Air Vents",
      "4000mAh Long-lasting Dual Battery",
      "Ultra-quiet Whisper Silent Engine",
      "Lightweight Ergonomic Silicone Band"
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
    description: "Native 4K 60FPS crystal-clear video recording, 6-axis EIS anti-shake stabilization, front & rear dual LCD displays, and 30M waterproof diving housing.",
    category: "Electronics",
    price: 59,
    originalPrice: 85,
    commission: "$15 (25%)",
    commissionAmount: 15,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-ACTION-CAM",
    features: [
      "4K 60FPS Ultra HD Video Recording",
      "6-Axis Electronic Image Stabilization",
      "30m Deep Underwater Waterproof Case",
      "WiFi Live Smartphone Companion App"
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
    text: "Hello and welcome to AffiliHub! You can ask questions about any product, check delivery details, or send product photos directly here in the chat.",
    timestamp: "10:00 AM",
    read: true
  }
];
