export interface CategoryStyle {
  bg: string;
  text: string;
}

export const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  'Skincare': { bg: 'bg-[#faebe6]', text: 'text-[#b85d43]' },
  'Tech': { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  'Food & Beverage': { bg: 'bg-[#fee2e2]', text: 'text-[#991b1b]' },
  'Home': { bg: 'bg-[#e0f2fe]', text: 'text-[#075985]' },
  'Lifestyle': { bg: 'bg-[#f3e8ff]', text: 'text-[#6b21a8]' },
  'Accessories': { bg: 'bg-[#fef9c3]', text: 'text-[#854d0e]' },
  'Smart Gadgets': { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'Mobile Accessories': { bg: 'bg-blue-50', text: 'text-blue-700' },
  'Electronics': { bg: 'bg-purple-50', text: 'text-purple-700' },
  'Fashion & Lifestyle': { bg: 'bg-amber-50', text: 'text-amber-700' },
  'Pet Supplies': { bg: 'bg-[#ecfdf5]', text: 'text-[#065f46]' },
  'Home & Garden': { bg: 'bg-[#f0fdfa]', text: 'text-[#115e59]' },
  'Beauty & Personal Care': { bg: 'bg-[#fff1f2]', text: 'text-[#9f1239]' },
};

export const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  bg: 'bg-stone-100',
  text: 'text-stone-700',
};

export function getCategoryStyle(category?: string): CategoryStyle {
  if (!category) return DEFAULT_CATEGORY_STYLE;
  return CATEGORY_STYLES[category] || DEFAULT_CATEGORY_STYLE;
}

