'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaBoxOpen } from 'react-icons/fa6';
import { useApp } from '@/app/context/AppContext';
import { ProductForm } from '@/components/admin/ProductForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: PageProps) {
  const { id } = use(params);
  const { getProductById } = useApp();

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-lg mx-auto mt-12">
        <FaBoxOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          The requested product ID does not exist or has been removed from the catalog.
        </p>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 bg-[#1b3b2b] text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
        >
          <FaArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  return <ProductForm initialProduct={product} isEditMode={true} />;
}
