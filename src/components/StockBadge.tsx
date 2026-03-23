import React from 'react';

interface StockBadgeProps {
  stock?: number;
}

export default function StockBadge({ stock }: StockBadgeProps) {
  if (stock === undefined) return null;

  if (stock === 0) {
    return (
      <span className="inline-block px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-600 font-almarai">
        نفذت الكمية
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="inline-block px-2 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-600 font-almarai">
        كمية محدودة
      </span>
    );
  }

  return (
    <span className="inline-block px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-600 font-almarai">
      متوفر
    </span>
  );
}
