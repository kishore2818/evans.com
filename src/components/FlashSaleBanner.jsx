"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Timer, ArrowRight, X, Flame, Copy, Check, Gift, Tag, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';

// Stable fallback timestamp to avoid recreating Date on every render
const FALLBACK_END_MS = Date.now() + 48 * 3600 * 1000;

export default function FlashSaleBanner() {
  const { storeSettings, fetchStoreSettings } = useStore();
  const [isVisible, setIsVisible] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    fetchStoreSettings();
  }, [fetchStoreSettings]);

  const flashSale = storeSettings?.flashSale || null;
  const isActive = Boolean(flashSale && flashSale.isActive === true);
  const discount = flashSale?.discountPercentage !== undefined ? flashSale.discountPercentage : 25;
  const bannerText = flashSale?.bannerText || '✦ LIMITED TIME FLASH SALE: Up to 40% OFF Signature Botanicals + Free Luxe Pouch';
  const endDateStr = flashSale?.endDate || null;

  // Compute stable target timestamp
  const targetTimestamp = useMemo(() => {
    if (endDateStr) {
      const parsed = new Date(endDateStr).getTime();
      if (!isNaN(parsed)) return parsed;
    }
    return FALLBACK_END_MS;
  }, [endDateStr]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, targetTimestamp - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetTimestamp]);

  const handleCopyCode = (e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText('LUXE25');
    setCopied(true);
    toast.success('Coupon LUXE25 copied! Apply at checkout ♥');
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isVisible || !isActive) return null;

  return (
    <>
      {/* ── TOP FLASH SALE BAR (Responsive: Ultra-sleek mobile ticker + Luxury desktop header) ── */}
      <div className="relative bg-gradient-to-r from-purple-950 via-[#3c154a] to-purple-950 text-white py-1.5 sm:py-2 px-3 sm:px-4 shadow-sm z-30 overflow-hidden border-b border-gold-500/30">
        {/* Subtle glowing ambient accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-400/15 via-transparent to-transparent pointer-events-none" />

        {/* ══ MOBILE VIEW (Single neat compact row, no wrapping) ══ */}
        <div className="flex sm:hidden items-center justify-between gap-1.5 relative z-10 w-full">
          <button
            onClick={() => setShowOfferModal(true)}
            className="flex items-center space-x-1.5 text-left flex-1 min-w-0"
          >
            <span className="flex-shrink-0 flex items-center px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-300 font-black text-[9px] uppercase tracking-wider border border-gold-400/30">
              <Flame size={10} className="mr-0.5 text-gold-400 animate-pulse" />
              {discount}% OFF
            </span>

            {/* Mobile Compact Timer */}
            <div className="flex items-center space-x-1 font-mono text-[10px] font-bold text-gold-300">
              <Timer size={11} className="text-gold-400 flex-shrink-0" />
              <span>
                {timeLeft.days > 0 ? `${timeLeft.days}d ` : ''}
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

            <span className="text-[10px] text-cream-200 underline font-semibold ml-auto truncate flex items-center">
              <span>Offers</span>
              <ChevronRight size={12} className="text-gold-300 ml-0.5" />
            </span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
            className="text-white/60 hover:text-white p-1 ml-1 flex-shrink-0"
            aria-label="Dismiss banner"
          >
            <X size={12} />
          </button>
        </div>

        {/* ══ DESKTOP VIEW ══ */}
        <div className="hidden sm:flex max-w-7xl mx-auto items-center justify-between text-xs gap-3 relative z-10">
          <div className="flex items-center space-x-2.5">
            <span className="flex items-center px-2.5 py-0.5 rounded-full bg-gold-400/20 text-gold-300 font-black text-[10px] uppercase tracking-wider border border-gold-400/30">
              <Flame size={12} className="mr-1 text-gold-400 animate-pulse" />
              {discount}% OFF Flash Sale
            </span>
            <p className="font-medium text-xs text-cream-100 truncate max-w-lg">
              {bannerText}
            </p>
          </div>

          {/* Desktop Ticking Countdown Timer & CTA */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="flex items-center space-x-1 font-mono text-xs font-bold text-gold-300">
              <Timer size={13} className="mr-1 text-gold-400" />
              {timeLeft.days > 0 && (
                <>
                  <div className="bg-black/35 px-1.5 py-0.5 rounded border border-white/10">{timeLeft.days}d</div>
                  <span>:</span>
                </>
              )}
              <div className="bg-black/35 px-1.5 py-0.5 rounded border border-white/10">{String(timeLeft.hours).padStart(2, '0')}h</div>
              <span>:</span>
              <div className="bg-black/35 px-1.5 py-0.5 rounded border border-white/10">{String(timeLeft.minutes).padStart(2, '0')}m</div>
              <span>:</span>
              <div className="bg-black/35 px-1.5 py-0.5 rounded border border-white/10">{String(timeLeft.seconds).padStart(2, '0')}s</div>
            </div>

            <button
              onClick={() => setShowOfferModal(true)}
              className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-[10px] uppercase tracking-wider border border-white/20 transition-all"
            >
              Offer Details
            </button>

            <Link
              href="/products"
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-gold-400 hover:bg-gold-300 text-purple-950 font-bold text-[10px] uppercase tracking-widest transition-transform hover:scale-105 shadow-sm"
            >
              <span>Shop Deals</span>
              <ArrowRight size={11} />
            </Link>

            <button
              onClick={() => setIsVisible(false)}
              className="text-white/60 hover:text-white transition-colors p-1 ml-1"
              title="Dismiss banner"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── LUXURY FLASH OFFER POPUP / BOTTOM SHEET MODAL ── */}
      <AnimatePresence>
        {showOfferModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOfferModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative w-full max-w-lg bg-gradient-to-b from-[#2d0f3a] via-[#3a144b] to-[#250a30] text-white rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-gold-500/30 overflow-hidden z-10"
            >
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-gold-400/15 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

              {/* Close button */}
              <button
                onClick={() => setShowOfferModal(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all"
              >
                <X size={16} />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/40 text-[10px] font-black uppercase tracking-widest mb-3">
                  <Flame size={12} className="text-gold-400 animate-pulse" />
                  <span>Exclusive Flash Campaign</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Unlock Up to {discount}% OFF
                </h3>
                <p className="text-xs text-purple-200/80 mt-1 max-w-xs mx-auto">
                  Handcrafted botanical elixirs, cold-pressed soaps, and active serums on limited-time promotional pricing.
                </p>
              </div>

              {/* Countdown Ticker Box */}
              <div className="bg-black/35 rounded-2xl p-4 border border-white/10 mb-6 text-center">
                <span className="text-[10px] font-bold text-gold-400 uppercase tracking-widest block mb-2">
                  Campaign Ends In
                </span>
                <div className="flex justify-center items-center space-x-2 font-mono font-bold text-gold-300 text-lg">
                  {timeLeft.days > 0 && (
                    <div className="flex flex-col items-center">
                      <div className="bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/15 min-w-[42px] text-center">
                        {timeLeft.days}
                      </div>
                      <span className="text-[9px] font-sans font-medium text-gray-400 mt-1">Days</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center">
                    <div className="bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/15 min-w-[42px] text-center">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <span className="text-[9px] font-sans font-medium text-gray-400 mt-1">Hours</span>
                  </div>
                  <span className="text-gold-400 font-bold -mt-3">:</span>
                  <div className="flex flex-col items-center">
                    <div className="bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/15 min-w-[42px] text-center">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <span className="text-[9px] font-sans font-medium text-gray-400 mt-1">Mins</span>
                  </div>
                  <span className="text-gold-400 font-bold -mt-3">:</span>
                  <div className="flex flex-col items-center">
                    <div className="bg-white/10 px-2.5 py-1.5 rounded-xl border border-white/15 min-w-[42px] text-center">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <span className="text-[9px] font-sans font-medium text-gray-400 mt-1">Secs</span>
                  </div>
                </div>
              </div>

              {/* Promo Voucher Code */}
              <div className="mb-6 p-3.5 rounded-2xl bg-white/5 border border-dashed border-gold-400/50 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gold-400/20 text-gold-400 flex items-center justify-center flex-shrink-0">
                    <Tag size={18} />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Promo Coupon Code</span>
                    <span className="font-mono text-sm font-black text-gold-300">LUXE25</span>
                  </div>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-2 rounded-xl bg-gold-400 hover:bg-gold-300 text-purple-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-sm"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Perks Checklist */}
              <div className="space-y-2 mb-6 text-xs text-purple-100/90">
                <div className="flex items-center space-x-2">
                  <Gift size={14} className="text-gold-400 flex-shrink-0" />
                  <span>Free Deluxe Botanical Pouch on all orders above ₹1,999</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles size={14} className="text-gold-400 flex-shrink-0" />
                  <span>Complimentary express priority courier dispatch</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <Link
                  href="/products"
                  onClick={() => setShowOfferModal(false)}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-amber-300 text-purple-950 font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg hover:scale-[1.01] transition-transform"
                >
                  <span>Explore Flash Deals</span>
                  <ArrowRight size={14} />
                </Link>
                <button
                  onClick={() => setShowOfferModal(false)}
                  className="w-full py-2.5 text-xs text-white/50 hover:text-white font-medium transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
