import { Product, ChatMessage, Review } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: "rev-doorbell-1",
    productId: "prod-long-yue-doorbell",
    userId: "user-sarah-jenkins",
    userName: "Sarah Jenkins",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Jenkins&backgroundColor=1b3b2b",
    rating: 5,
    title: "Super easy potty training alert! Puppy learned in 3 days",
    comment: "The brass chime is loud and clear enough to hear across both floors of our home without being jarring or obnoxious. Our golden retriever puppy learned to tap it with his nose in just 3 days! The bamboo base is solidly built and the adhesive mount holds tightly.",
    createdAt: "2026-10-12T14:20:00Z",
    verifiedReviewer: true,
  },
  {
    id: "rev-doorbell-2",
    productId: "prod-long-yue-doorbell",
    userId: "user-michael-brown",
    userName: "Michael Brown",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Michael%20Brown&backgroundColor=0d5bff",
    rating: 5,
    title: "Sticks firmly on sliding patio door, solid brass construction",
    comment: "Very well constructed bell. The adhesive tape is heavy duty and sticks firmly to our glass patio door. It has a beautiful chime tone that sounds like a boutique shop alert. Highly recommend this for any dog owner!",
    createdAt: "2026-10-15T09:45:00Z",
    verifiedReviewer: true,
  },
  {
    id: "rev-lickoon-1",
    productId: "prod-lickoon-repellent",
    userId: "user-emily-watson",
    userName: "Emily Watson",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Emily%20Watson&backgroundColor=9f1239",
    rating: 5,
    title: "Fresh peppermint scent and 100% effective against garage mice",
    comment: "Placed 4 pouches around the corners of our two-car garage and inside the mower storage. Smells clean and natural like pure peppermint, and we have not seen any rodent droppings since putting them out. Plus safe around our kids!",
    createdAt: "2026-10-14T11:30:00Z",
    verifiedReviewer: true,
  },
  {
    id: "rev-lickoon-2",
    productId: "prod-lickoon-repellent",
    userId: "user-sarah-jenkins",
    userName: "Sarah Jenkins",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah%20Jenkins&backgroundColor=1b3b2b",
    rating: 5,
    title: "Great humane deterrent for car engine bay & storage shed",
    comment: "Used in our RV and shed storage. Lasts a long time and the pouches do not leak. Great natural alternative to harsh chemicals or dangerous traps.",
    createdAt: "2026-10-16T18:10:00Z",
    verifiedReviewer: true,
  },
  {
    id: "rev-hair-1",
    productId: "prod-imps-hair-fibers",
    userId: "user-michael-brown",
    userName: "Michael Brown",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=Michael%20Brown&backgroundColor=0d5bff",
    rating: 5,
    title: "Undetectable fuller appearance, works seamlessly with applicator",
    comment: "The micro-keratin powder flows evenly and electrostatically binds to fine hair strands. Gives natural looking thickness for crown thinning without any sticky residue. Withstands breezy weather with ease.",
    createdAt: "2026-10-17T16:05:00Z",
    verifiedReviewer: true,
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-long-yue-doorbell",
    title: "ZGLONG Bamboo Dog Doorbell for Potty Training",
    category: "Pet Supplies",
    subCategory: "Dog Training & Behavior",
    description: "Solid natural bamboo base with high-resonance polished brass bell. Designed for effortless potty training and outdoor alert habits for puppies and adult dogs. Features ultra-strong adhesive mounting suitable for any door or wall without drilling.",
    price: 0,
    originalPrice: 19,
    commission: "$5 (26%)",
    commissionAmount: 5,
    image: "https://m.media-amazon.com/images/I/61Y1g3-+3gL._AC_SL1500_.jpg",
    gallery: [
      "https://m.media-amazon.com/images/I/61Y1g3-+3gL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71ts7Vl0jJL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71kIuL-LnuL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71STP1dHz7L._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71B5-SfDmYL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71ZFBU3fimL._AC_SL1500_.jpg"
    ],
    affiliateCode: "AFF-LONGYUE-BELL",
    features: [
      "Natural Bamboo Base & Solid Brass Bell",
      "Loud & Pleasant Tone Heard Across The Home",
      "No Drilling Required - Strong Self-Adhesive Mount",
      "Proven Step-by-Step Dog Potty Communication Habit",
      "Durable, Rust-Resistant & 100% Pet-Safe Design"
    ],
    rating: 4.8,
    reviewsCount: 194,
    badge: "Amazon Choice",
    inStock: true,
    createdAt: "2026-10-08T08:00:00Z",
    store: "LONG YUE",
    amazonUrl: "https://www.amazon.com/dp/B0GXTXF8T4?tag=bwbh00-20&linkCode=ogi&th=1&psc=1"
  },
  {
    id: "prod-lickoon-repellent",
    title: "Lickoon Mouse Repellent 24 Pouches",
    category: "Home & Garden",
    subCategory: "Pest & Rodent Control",
    description: "Botanical rodent deterrent powered by pure peppermint and natural essential oils. 24 pouches emit a long-lasting scent that naturally repels mice, rats, spiders, roaches, and squirrels while remaining safe around family and household pets.",
    price: 0,
    originalPrice: 26,
    commission: "$6 (23%)",
    commissionAmount: 6,
    image: "https://m.media-amazon.com/images/I/81uqeUGo0kL._AC_SL1500_.jpg",
    gallery: [
      "https://m.media-amazon.com/images/I/81uqeUGo0kL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71LfqQdu32L._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71vA0hW4+vL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71QuTetzO5L._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71bQTQt3FYL._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/71vG5cljpML._AC_SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81UlY4p+WQL._AC_SL1500_.jpg"
    ],
    affiliateCode: "AFF-LICKOON-PEST",
    features: [
      "24 Long-Lasting Fresh Scented Pouches",
      "100% Natural Peppermint Essential Oil Blend",
      "Non-Toxic & Safe for Children and Household Pets",
      "Multi-Area Protection: Garage, Car Engine, RV, Attic & Kitchen",
      "Deters Mice, Rats, Spiders, Roaches, Ants & Squirrels"
    ],
    rating: 4.7,
    reviewsCount: 312,
    badge: "Best Seller",
    inStock: true,
    createdAt: "2026-10-08T09:00:00Z",
    store: "Lickoon",
    amazonUrl: "https://www.amazon.com/dp/B0H756JY7F?tag=bwbh00-20&linkCode=ogi&th=1&psc=1"
  },
  {
    id: "prod-imps-hair-fibers",
    title: "IMPS Hair Building Fibers Powder (12.55g)",
    category: "Beauty & Personal Care",
    subCategory: "Hair Styling & Care",
    description: "Premium micro-keratin hair building fibers powder formulated specifically for the SteadyFlow Electric Applicator. Instantly bonds to thinning strands to provide seamless, undetectable coverage with wind and sweat resistance.",
    price: 0,
    originalPrice: 29,
    commission: "$8 (28%)",
    commissionAmount: 8,
    image: "https://m.media-amazon.com/images/I/61+wzMfLTdL.jpg",
    gallery: [
      "https://m.media-amazon.com/images/I/61+wzMfLTdL.jpg",
      "https://m.media-amazon.com/images/I/519JneU6jAL.jpg",
      "https://m.media-amazon.com/images/I/61k4j-rrf0L.jpg",
      "https://m.media-amazon.com/images/I/316YNQnGppL.jpg"
    ],
    affiliateCode: "AFF-IMPS-FIBER",
    features: [
      "Tailored for SteadyFlow Electric Hair Applicator",
      "12.55g High-Density Micro-Keratin Protein Fibers",
      "Instant Fuller Appearance for Crown & Parting Lines",
      "Wind, Humidity & Sweat Resistant Hold",
      "Gentle on Scalp & Easily Removed with Standard Shampoo"
    ],
    rating: 4.9,
    reviewsCount: 428,
    badge: "Hot Deal",
    inStock: true,
    createdAt: "2026-10-08T10:00:00Z",
    store: "Imps Hair Creates",
    amazonUrl: "https://www.amazon.com/dp/B0HFZYY4FD?tag=bwbh00-20&linkCode=ogi&th=1&psc=1"
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [];

