import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-skincare",
    title: "Hydrating Skincare Set",
    category: "Skincare",
    subCategory: "Beauty & Personal Care",
    description: "Deep hydration daily cleanser, revitalizing toner, vitamin C brightening serum, and 24h ultra-nourishing barrier repair cream.",
    price: 0,
    originalPrice: 48,
    commission: "$12 (25%)",
    commissionAmount: 12,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-SKIN-SET",
    features: [
      "Natural Hyaluronic Acid & Vitamin C",
      "Cruelty-free & Dermatologist Tested",
      "Full 4-Step Daily Hydration Routine",
      "Suitable for Sensitive & Dry Skin"
    ],
    rating: 4.9,
    reviewsCount: 324,
    badge: "Featured",
    inStock: true,
    createdAt: "2026-10-01T10:00:00Z"
  },
  {
    id: "prod-earbuds",
    title: "Wireless Earbuds",
    category: "Tech",
    subCategory: "Electronics",
    description: "True wireless earbuds with active noise cancellation, deep punchy bass, crystal-clear quad mic calls, and compact charging case.",
    price: 0,
    originalPrice: 65,
    commission: "$15 (23%)",
    commissionAmount: 15,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-EARBUDS-PRO",
    features: [
      "Active Noise Cancellation (ANC)",
      "36 Hours Total Battery Runtime",
      "IPX6 Sweat & Water Resistance",
      "Touch Controls & Instant Pairing"
    ],
    rating: 4.8,
    reviewsCount: 412,
    badge: "Best Seller",
    inStock: true,
    createdAt: "2026-10-02T11:00:00Z"
  },
  {
    id: "prod-snackbox",
    title: "Protein Snack Box",
    category: "Food & Beverage",
    subCategory: "Food & Beverages",
    description: "Hand-picked assortment of 12 premium high-protein snack bars, crunchy baked crisps, keto bites, and dried superfood fruit mix.",
    price: 0,
    originalPrice: 32,
    commission: "$8 (25%)",
    commissionAmount: 8,
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-PROTEIN-BOX",
    features: [
      "12 Full-Size Healthy Snacks",
      "15g-20g Protein Per Serving",
      "Zero Added Artificial Preservatives",
      "Keto & Vegetarian Friendly"
    ],
    rating: 4.7,
    reviewsCount: 189,
    badge: "New Arrival",
    inStock: true,
    createdAt: "2026-10-03T12:00:00Z"
  },
  {
    id: "prod-cleaning",
    title: "Cleaning Essentials",
    category: "Home",
    subCategory: "Home & Living",
    description: "Plant-powered all-purpose surface spray, streak-free glass cleanser, microfiber detailing cloths, and natural refillable spray bottles.",
    price: 0,
    originalPrice: 28,
    commission: "$6 (21%)",
    commissionAmount: 6,
    image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-CLEAN-KIT",
    features: [
      "100% Non-Toxic Plant Formulated",
      "Refillable Amber Glass Spray Bottles",
      "Safe for Kids, Pets & Food Surfaces",
      "Subtle Natural Lavender Citrus Scent"
    ],
    rating: 4.8,
    reviewsCount: 204,
    badge: "Eco Choice",
    inStock: true,
    createdAt: "2026-10-04T13:00:00Z"
  },
  {
    id: "prod-fitness",
    title: "Fitness Kit",
    category: "Lifestyle",
    subCategory: "Health & Wellness",
    description: "Non-slip eco workout yoga mat, set of 5 resistance loop bands, stainless steel hydration shaker bottle, and portable carry strap.",
    price: 0,
    originalPrice: 45,
    commission: "$10 (22%)",
    commissionAmount: 10,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-FITNESS-KIT",
    features: [
      "High Density 6mm Cushioning Mat",
      "5 Level Latex Resistance Loop Bands",
      "BPA-free Stainless Shaker with Ball",
      "Compact Lightweight Travel Pouch"
    ],
    rating: 4.9,
    reviewsCount: 278,
    badge: "Trending",
    inStock: true,
    createdAt: "2026-10-05T14:00:00Z"
  },
  {
    id: "prod-phonestand",
    title: "Phone Stand",
    category: "Accessories",
    subCategory: "Electronics",
    description: "Ergonomic anodized aluminum desktop phone stand with 270° angle adjustment, anti-slip silicone cushions, and cable management pass-through.",
    price: 0,
    originalPrice: 22,
    commission: "$5 (23%)",
    commissionAmount: 5,
    image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?auto=format&fit=crop&w=800&q=80",
    affiliateCode: "AFF-PHONE-STAND",
    features: [
      "Solid Aircraft Grade Aluminum Alloy",
      "Full 270-degree Dual Axis Tilt",
      "Weighted Base Anti-Slip Silicone Pads",
      "Cable Cutout for Convenient Charging"
    ],
    rating: 4.7,
    reviewsCount: 156,
    badge: "Staff Pick",
    inStock: true,
    createdAt: "2026-10-06T15:00:00Z"
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
