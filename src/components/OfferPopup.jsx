'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Sparkles, Copy, Check, Clock, ArrowRight, Tag, Gift, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import API_BASE_URL from '@/config/api';
import { socket } from '@/config/socket';

export default function OfferPopup() {
  const [offer, setOffer] = useState({
    isActive: true,
    title: 'Evans Luxe Pop Tiger Sale',
    badgeText: 'POP TIGER OFFER',
    bannerText: '✦ FESTIVE GLOW DAYS: Flat 25% OFF on all organic elixirs + Free Rose Bar on ₹999+',
    discountPercentage: 25,
    endDate: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    buttonText: 'Shop Pop Tiger Deals',
    linkUrl: '/products?sale=true',
    couponCode: 'TIGER25',
    minOrderValue: 999,
    giftPerk: 'Free Rose Bar on ₹999+',
    showPopup: true,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 0, seconds: 0 });
  const [isMinimized, setIsMinimized] = useState(false);

  // 1. Fetch initial settings & listen to live socket broadcasts from Admin
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/settings`);
        if (res.ok) {
          const data = await res.json();
          if (data?.flashSale) {
            setOffer(prev => ({
              ...prev,
              ...data.flashSale,
              badgeText: data.flashSale.badgeText || 'POP TIGER OFFER',
              couponCode: data.flashSale.couponCode || 'TIGER25',
              minOrderValue: data.flashSale.minOrderValue || 999,
              giftPerk: data.flashSale.giftPerk || 'Free Rose Bar on ₹999+',
              showPopup: data.flashSale.showPopup !== undefined ? data.flashSale.showPopup : true,
            }));
          }
        }
      } catch (err) {
        // Fallback default offer
      }
    };

    fetchSettings();

    // Socket.io live listeners
    const handleSettingsUpdate = (settings) => {
      if (settings?.flashSale) {
        setOffer(prev => ({
          ...prev,
          ...settings.flashSale,
          badgeText: settings.flashSale.badgeText || 'POP TIGER OFFER',
          couponCode: settings.flashSale.couponCode || 'TIGER25',
          minOrderValue: settings.flashSale.minOrderValue || 999,
          giftPerk: settings.flashSale.giftPerk || 'Free Rose Bar on ₹999+',
          showPopup: settings.flashSale.showPopup !== undefined ? settings.flashSale.showPopup : true,
        }));
      }
    };

    socket.on('settingsUpdated', handleSettingsUpdate);
    socket.on('flashSaleUpdated', (fs) => handleSettingsUpdate({ flashSale: fs }));

    return () => {
      socket.off('settingsUpdated', handleSettingsUpdate);
      socket.off('flashSaleUpdated');
    };
  }, []);

  // 2. Auto-open on initial visit if active and not dismissed in this session
  useEffect(() => {
    if (!offer.isActive || offer.showPopup === false) return;

    const dismissed = typeof window !== 'undefined' ? sessionStorage.getItem('evans_offer_dismissed') : null;
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [offer.isActive, offer.showPopup]);

  // 3. Countdown timer logic
  useEffect(() => {
    if (!offer.endDate) return;

    const updateTimer = () => {
      const target = new Date(offer.endDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [offer.endDate]);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('evans_offer_dismissed', 'true');
    }
  };

  const handleCopyCode = () => {
    const code = offer.couponCode || 'TIGER25';
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(`🎉 Code ${code} copied! Apply at checkout.`);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!offer.isActive) return null;

  return (
    <>
      {/* ── 1. PURPLLE-STYLE POP TIGER FLOATING TRIGGER ── */}
      {offer.showPopup !== false && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 20 }}
          className="fixed bottom-20 left-3 sm:bottom-6 sm:left-6 z-40 select-none"
        >
          {isMinimized ? (
            /* Minimized Mini Pop Tiger Pill */
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsMinimized(false)}
              className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-purple-950 via-purple-900 to-[#5A2A6C] text-white shadow-[0_8px_25px_rgba(62,29,74,0.5)] border-2 border-gold-400/70"
              title="Expand Pop Tiger Offer"
            >
              <span className="text-xl animate-bounce">🐯</span>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-pink-500 border border-white animate-pulse" />
            </motion.button>
          ) : (
            /* Full Pop Tiger Floating Pill */
            <div className="relative group">
              <motion.button
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                aria-label="Open Pop Tiger Offer"
                className="relative flex items-center space-x-2.5 pl-2.5 pr-4 py-2 rounded-full bg-gradient-to-r from-purple-950 via-purple-900 to-[#5A2A6C] text-white shadow-[0_8px_30px_rgba(62,29,74,0.5)] border border-gold-400/60 hover:border-gold-300 transition-all backdrop-blur-md"
              >
                {/* Glowing gold halo ring */}
                <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-gold-400/30 to-purple-500/30 blur-sm group-hover:opacity-100 opacity-60 transition-opacity -z-10 animate-pulse" />

                {/* Pop Tiger Mascot Avatar */}
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-gold-300 to-amber-500 flex items-center justify-center text-lg shadow-inner flex-shrink-0 border border-white/40">
                  <span className="transform -scale-x-100 inline-block drop-shadow-sm select-none">🐯</span>
                  {/* Mini flame badge */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-600 flex items-center justify-center text-[8px] text-white font-black shadow">
                    <Flame size={9} />
                  </span>
                </div>

                {/* Text & Offer details */}
                <div className="flex flex-col text-left leading-none">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] sm:text-xs font-black text-gold-300 tracking-tight">
                      {offer.discountPercentage}% OFF
                    </span>
                    <span className="w-1 h-1 rounded-full bg-pink-400" />
                    <span className="text-[9px] sm:text-[10px] font-extrabold text-white uppercase font-mono tracking-wider">
                      {offer.couponCode || 'TIGER25'}
                    </span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] text-purple-200 uppercase tracking-widest font-bold mt-0.5">
                    {offer.badgeText || 'Pop Tiger Deal'}
                  </span>
                </div>

                <span className="hidden sm:inline-flex px-1.5 py-0.5 rounded-md bg-gold-400/20 text-gold-300 text-[8px] font-black uppercase tracking-wider border border-gold-300/30">
                  Tap
                </span>
              </motion.button>

              {/* Minimize button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-purple-900 text-purple-200 hover:text-white border border-gold-400/50 flex items-center justify-center text-[9px] shadow"
                title="Minimize"
              >
                ×
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* ── 2. PURPLLE-STYLE POP TIGER LUXURY OFFER MODAL ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-purple-950/75 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-md bg-gradient-to-b from-[#2a1133] via-[#3e1d4a] to-[#200b27] text-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.65)] border border-gold-400/40 overflow-hidden z-10"
            >
              {/* Gold & Purple ambient background halos */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={handleClose}
                aria-label="Close Pop Tiger Offer"
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>

              {/* Pop Tiger Festive Banner Header */}
              <div className="flex items-center space-x-2.5 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-gold-300 to-amber-500 flex items-center justify-center text-2xl shadow-md border border-white/30 flex-shrink-0">
                  <span className="transform -scale-x-100">🐯</span>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gold-400/25 border border-gold-300/40 text-gold-300 text-[9px] font-black uppercase tracking-wider">
                      <Sparkles size={10} />
                      <span>{offer.badgeText || 'Pop Tiger Exclusive'}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-pink-500/25 text-pink-300 text-[9px] font-black uppercase tracking-wider border border-pink-400/40">
                      Live Offer
                    </span>
                  </div>
                  <span className="text-[10px] text-purple-200 font-bold tracking-tight">
                    Evans Luxe Beauty Official
                  </span>
                </div>
              </div>

              {/* Offer Title & Subtitle */}
              <div className="text-left space-y-1 mb-4">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {offer.title || 'Evans Luxe Pop Tiger Sale'}
                </h3>
                <p className="text-xs sm:text-[13px] text-purple-200/90 leading-relaxed">
                  {offer.bannerText || `Unlock flat ${offer.discountPercentage}% instant savings on all cold-pressed serums, soaps & beauty rituals.`}
                </p>
              </div>

              {/* Gift Perk Badge */}
              {offer.giftPerk && (
                <div className="flex items-center space-x-2 p-2.5 rounded-xl bg-gold-400/10 border border-gold-300/30 text-gold-200 text-xs font-semibold mb-4">
                  <Gift size={14} className="text-gold-300 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-gold-100">
                    Perk: {offer.giftPerk}
                  </span>
                </div>
              )}

              {/* Countdown Timer Strip */}
              <div className="bg-black/30 rounded-2xl p-3 border border-white/10 mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="flex items-center space-x-1.5 text-gold-300 font-bold uppercase tracking-wider text-[10px]">
                    <Clock size={12} />
                    <span>Tiger Offer Ends In</span>
                  </span>
                  <span className="text-[10px] text-purple-200 font-medium">Limited Stock</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/10 rounded-xl py-2 px-1 border border-white/10">
                    <span className="block font-mono text-lg font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase tracking-wider text-purple-300 font-bold">Hours</span>
                  </div>
                  <div className="bg-white/10 rounded-xl py-2 px-1 border border-white/10">
                    <span className="block font-mono text-lg font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase tracking-wider text-purple-300 font-bold">Mins</span>
                  </div>
                  <div className="bg-white/10 rounded-xl py-2 px-1 border border-white/10">
                    <span className="block font-mono text-lg font-black text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-[8px] uppercase tracking-wider text-purple-300 font-bold">Secs</span>
                  </div>
                </div>
              </div>

              {/* Coupon Code Box */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-gold-400/40 mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gold-400 text-purple-950 flex items-center justify-center font-black flex-shrink-0">
                    <Tag size={15} />
                  </div>
                  <div>
                    <span className="text-[9px] text-gold-300 font-bold uppercase tracking-wider block">Use Coupon Code</span>
                    <span className="font-mono text-base sm:text-lg font-black text-white tracking-widest">
                      {offer.couponCode || 'TIGER25'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-2 rounded-xl bg-gold-400 hover:bg-gold-500 text-purple-950 font-black text-[11px] uppercase tracking-wider flex items-center space-x-1.5 transition-all active:scale-95 shadow-md flex-shrink-0"
                >
                  {copied ? <Check size={13} strokeWidth={3} /> : <Copy size={13} />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              {/* Min Order Notice */}
              {offer.minOrderValue > 0 && (
                <p className="text-[10px] text-purple-300 text-center mb-3">
                  * Applicable on orders above ₹{offer.minOrderValue}. No cash on delivery.
                </p>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  href={offer.linkUrl || '/products?sale=true'}
                  onClick={handleClose}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-purple-950 font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95 text-center"
                >
                  <span>{offer.buttonText || 'Shop Pop Tiger Deals'}</span>
                  <ArrowRight size={14} />
                </Link>

                <button
                  onClick={handleClose}
                  className="w-full text-center text-[11px] text-purple-300 hover:text-white py-1 transition-colors font-medium"
                >
                  No thanks, continue browsing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
