'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { LoanType } from '@/types/loan';
import { cn } from '@/lib/utils';

export interface LoanProduct {
  type: LoanType;
  label: string;
  desc: string;
  image: string;
  alt: string;
  badge: string;
}

const LOAN_PRODUCTS: LoanProduct[] = [
  {
    type: 'GOLD',
    label: 'Gold Loan',
    desc: 'Ornament appraisal',
    image: '/images/loans/gold-loan.jpg',
    alt: 'Gold Loan - Luxury pure gold jewellery, coins, and ornament appraisal',
    badge: 'Ornament Purity',
  },
  {
    type: 'BIKE',
    label: 'Bike Loan',
    desc: 'RC hypothecation',
    image: '/images/loans/bike-loan.jpg',
    alt: 'Bike Loan - Premium modern motorcycle vehicle hypothecation',
    badge: 'Two-Wheeler RC',
  },
  {
    type: 'GUARANTOR',
    label: 'Guarantor Loan',
    desc: 'Third-party backer',
    image: '/images/loans/guarantor-loan.jpg',
    alt: 'Guarantor Loan - Professional third-party co-signer guarantee and security',
    badge: 'Corporate Co-Sign',
  },
  {
    type: 'NOMINEE',
    label: 'Nominee Loan',
    desc: 'Registered kin line',
    image: '/images/loans/nominee-loan.jpg',
    alt: 'Nominee Loan - Family financial security and registered kin line protection',
    badge: 'Family Security',
  },
];

interface LoanProductSelectorProps {
  selectedType: LoanType;
  onSelect: (type: LoanType) => void;
  className?: string;
}

export function LoanProductSelector({
  selectedType,
  onSelect,
  className,
}: LoanProductSelectorProps) {
  return (
    <div className={cn('space-y-2.5', className)}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Select Loan Product Type
        </label>
        <span className="text-[11px] text-slate-500 dark:text-slate-400">
          Choose collateral backing class
        </span>
      </div>

      {/* 4 Cards in 1 row on Desktop (lg), 2 on Tablet (sm), 1 on Mobile */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        role="radiogroup"
        aria-label="Select Loan Product Type"
      >
        {LOAN_PRODUCTS.map((product) => {
          const isSelected = selectedType === product.type;

          return (
            <button
              key={product.type}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(product.type)}
              className={cn(
                'group relative flex flex-col w-full text-left rounded-2xl overflow-hidden',
                'bg-[#0b1329] border text-slate-100 transition-all duration-300 ease-out outline-none select-none',
                isSelected
                  ? 'border-brand-500 ring-2 ring-brand-500/30 shadow-sm -translate-y-0.5'
                  : 'border-slate-800/90 hover:border-brand-500/50 hover:shadow-xs'
              )}
            >
              {/* Card Image Banner with Cinematic Gradient Overlay */}
              <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-slate-950">
                <img
                  src={product.image}
                  alt={product.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                />

                {/* Gradient Overlays for Readability & Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329] via-[#0b1329]/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent pointer-events-none opacity-80" />

                {/* Top Left Feature Pill */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="inline-flex items-center text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-slate-200 border border-white/10 shadow-xs">
                    {product.badge}
                  </span>
                </div>

                {/* Top Right Active / Selection Radio Indicator */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  {isSelected ? (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-600 text-white font-bold text-[10px] shadow-[0_0_14px_rgba(113,50,176,0.9)] border border-brand-400 animate-in zoom-in-75 duration-200">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>SELECTED</span>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-white/30 bg-slate-900/60 backdrop-blur-xs group-hover:border-brand-400/70 transition-colors" />
                  )}
                </div>
              </div>

              {/* Bottom Card Content: Typography */}
              <div className="p-4 pt-1 flex flex-col justify-between flex-1 bg-[#0b1329]">
                <div>
                  <h3
                    className={cn(
                      'text-sm sm:text-base font-bold tracking-tight transition-colors duration-200',
                      isSelected ? 'text-brand-300' : 'text-white group-hover:text-brand-300'
                    )}
                  >
                    {product.label}
                  </h3>
                  <p className="text-xs text-slate-400 font-normal mt-0.5 line-clamp-1">
                    {product.desc}
                  </p>
                </div>

                {/* Subtle Bottom Accent Indicator */}
                <div
                  className={cn(
                    'h-0.5 w-full mt-3 rounded-full transition-all duration-300',
                    isSelected
                      ? 'bg-gradient-to-r from-brand-500 via-brand-300 to-brand-500 shadow-[0_0_8px_rgba(170,111,230,0.7)]'
                      : 'bg-transparent group-hover:bg-slate-800'
                  )}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
