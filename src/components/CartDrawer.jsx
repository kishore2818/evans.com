"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Sparkles,
  Truck,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check
} from 'lucide-react';

import { products as fallbackCatalog } from '@/data/products';
import API_BASE_URL from '@/config/api';

export default function CartDrawer() {
  const router = useRouter();
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, addToCart, storeSettings } = useStore();
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [addingId, setAddingId] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setSuggestedProducts(data);
            return;
          }
        }
      } catch (e) {
        // fallback
      }
      setSuggestedProducts(fallbackCatalog);
    };
    loadSuggestions();
  }, []);

  const threshold = storeSettings?.freeShippingThreshold !== undefined ? Number(storeSettings.freeShippingThreshold) : 2000;
  const fee = storeSettings?.shippingFee !== undefined ? Number(storeSettings.shippingFee) : 150;
  
  const getItemPrice = (item) => {
    const effectiveDiscount = item.flashSale?.isActive && item.flashSale?.discountPercentage
      ? Math.max(item.discountPercentage || 0, item.flashSale.discountPercentage)
      : (item.discountPercentage || 0);
    return effectiveDiscount > 0
      ? item.price * (1 - effectiveDiscount / 100)
      : item.price;
  };

  const subtotal = cart.reduce((acc, item) => {
    return acc + getItemPrice(item) * item.quantity;
  }, 0);

  const rawTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Coupon logic
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      couponDiscount = (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === 'fixed') {
      couponDiscount = appliedCoupon.value;
    }
  }

  const totalSavings = Math.max(0, (rawTotal - subtotal) + couponDiscount);
  const finalSubtotal = Math.max(0, subtotal - couponDiscount);

  const isFreeShipping = fee === 0 || threshold === 0 || (threshold > 0 && finalSubtotal >= threshold);
  const amountToFreeShipping = isFreeShipping ? 0 : Math.max(0, threshold - finalSubtotal);
  const freeShippingProgress = isFreeShipping ? 100 : (threshold > 0 ? Math.min(100, Math.round((finalSubtotal / threshold) * 100)) : 100);
  const currentShippingCharge = isFreeShipping ? 0 : fee;

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filter cross-sells to items NOT currently in cart
  const cartIds = new Set(cart.map(c => String(c.id || c._id)));
  const crossSells = suggestedProducts.filter(p => !cartIds.has(String(p.id || p._id))).slice(0, 6);

  const handleQuickAdd = async (product) => {
    const pId = product.id || product._id;
    setAddingId(pId);
    addToCart(product, 1);
    toast.success(`Added ${product.name} to your bag!`);
    setTimeout(() => setAddingId(null), 400);
  };

  const handleApplyCoupon = (codeToApply) => {
    const targetCode = (codeToApply || couponCode).trim().toUpperCase();
    if (!targetCode) return;
    
    // 1. Dynamic Backend Flash Sale / Pop Tiger Coupon from MongoDB Settings
    const activeFlashCode = (storeSettings?.flashSale?.couponCode || 'TIGER25').trim().toUpperCase();
    if (targetCode === activeFlashCode || targetCode === 'TIGER25' || targetCode === 'LUXE25') {
      const minVal = Number(storeSettings?.flashSale?.minOrderValue) || 0;
      if (minVal > 0 && subtotal < minVal) {
        toast.error(`Minimum order value of ₹${minVal} required for this coupon`);
        return;
      }
      const discPercent = Number(storeSettings?.flashSale?.discountPercentage) || 25;
      const perkText = storeSettings?.flashSale?.giftPerk ? ` + ${storeSettings.flashSale.giftPerk}` : '';
      setAppliedCoupon({
        code: targetCode,
        value: discPercent,
        type: 'percent',
        label: `${discPercent}% OFF ${storeSettings?.flashSale?.badgeText || 'Pop Tiger Offer'}${perkText}`
      });
      toast.success(`Coupon ${targetCode} applied! ${discPercent}% OFF`);
      return;
    }

    if (targetCode === 'WELCOME10') {
      setAppliedCoupon({ code: 'WELCOME10', value: 10, type: 'percent', label: '10% OFF First Order' });
      toast.success('Coupon WELCOME10 applied!');
    } else if (targetCode === 'BEAUTY500') {
      if (subtotal < 1500) {
        toast.error('Minimum order value of ₹1500 required for BEAUTY500');
        return;
      }
      setAppliedCoupon({ code: 'BEAUTY500', value: 500, type: 'fixed', label: '₹500 Flat Savings' });
      toast.success('Coupon BEAUTY500 applied!');
    } else {
      toast.error('Invalid Coupon Code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    router.push('/cart');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="absolute inset-0 bg-purple-950/40 backdrop-blur-sm"
          />

          {/* Slide-out Drawer */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full sm:rounded-l-[2rem] border-l border-beige-200 overflow-hidden"
            >
              {/* Header */}
              <div className="px-5 sm:px-6 py-4 border-b border-beige-100 flex items-center justify-between bg-cream-50/70">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-900 text-gold-400 flex items-center justify-center font-bold text-xs shadow-sm">
                    {totalItems}
                  </div>
                  <div>
                    <h2 className="font-serif text-base sm:text-lg font-bold text-purple-900 tracking-tight">Your Beauty Bag</h2>
                    <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium">Evans Luxe Beauty • evansluxebeauty</p>
                  </div>
                </div>

                <button
                  onClick={closeCart}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-purple-900 hover:border-purple-200 flex items-center justify-center transition-colors shadow-sm"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              <div className="px-5 sm:px-6 py-3 bg-purple-50/80 border-b border-purple-100">
                <div className="flex items-center justify-between text-xs font-semibold text-purple-900 mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <Truck size={14} className="text-purple-700 flex-shrink-0" />
                    <span>
                      {amountToFreeShipping === 0 ? (
                        <span className="text-emerald-700 font-bold flex items-center space-x-1">
                          <span>🎉 You unlocked FREE Luxury Shipping!</span>
                        </span>
                      ) : (
                        <span>Add <strong className="text-purple-950 font-bold">₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> for Free Shipping</span>
                      )}
                    </span>
                  </div>
                  <span className="text-[11px] text-purple-600 font-bold">{freeShippingProgress}%</span>
                </div>

                {/* Progress track */}
                <div className="h-2 w-full bg-purple-200/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${freeShippingProgress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-purple-800 via-purple-600 to-gold-500 rounded-full"
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 divide-y divide-beige-100">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-beige-100 flex items-center justify-center text-purple-900 shadow-inner">
                      <ShoppingBag size={32} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-purple-950">Your bag is empty</h3>
                      <p className="text-xs text-gray-500 mt-1 max-w-xs">Explore our curated botanical serums, soaps, and skincare treatments.</p>
                    </div>
                    <button
                      onClick={() => { closeCart(); router.push('/products'); }}
                      className="px-6 py-2.5 rounded-full bg-purple-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-purple-950 shadow-md transition-all"
                    >
                      Discover Products
                    </button>
                  </div>
                ) : (
                  <>
                    {cart.map((item) => {
                      const cartId = item.cartItemId || item.id;
                      const itemPrice = getItemPrice(item);
                      const originalPrice = item.price;
                      const hasDiscount = itemPrice < originalPrice;

                      return (
                        <div key={cartId} className="pt-4 first:pt-0 flex space-x-3.5 group">
                          {/* Image */}
                          <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-beige-50 border border-beige-100 overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image || item.images?.[0] || '/images/aloevera_gel.jpg'}
                              alt={item.name}
                              fill
                              className="object-cover"
                              unoptimized
                              onError={(e) => { e.target.srcset = '/images/aloevera_gel.jpg'; }}
                            />
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between">
                                <h4 className="font-serif text-xs font-bold text-purple-950 truncate max-w-[170px]">
                                  {item.name}
                                </h4>
                                <button
                                  onClick={() => removeFromCart(cartId)}
                                  className="text-gray-300 hover:text-red-500 transition-colors p-0.5"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>

                              {/* Shade pill if selected */}
                              {item.selectedShade && (
                                <div className="flex items-center space-x-1.5 mt-0.5">
                                  <span
                                    className="w-3 h-3 rounded-full border border-black/10 shadow-sm flex-shrink-0"
                                    style={{ backgroundColor: item.selectedShade.hex || '#E0A899' }}
                                  />
                                  <span className="text-[10px] text-gray-500 font-medium truncate">
                                    Shade: {item.selectedShade.name}
                                  </span>
                                </div>
                              )}

                              {/* Price */}
                              <div className="flex items-center space-x-1.5 mt-1">
                                <span className="text-xs font-bold text-purple-900">
                                  ₹{itemPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                </span>
                                {hasDiscount && (
                                  <span className="text-[10px] text-gray-400 line-through">
                                    ₹{originalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Stepper */}
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="flex items-center border border-gray-200 rounded-full bg-beige-50/80 px-2 py-0.5 space-x-2">
                                <button
                                  onClick={() => {
                                    if (item.quantity > 1) updateQuantity(cartId, item.quantity - 1);
                                    else removeFromCart(cartId);
                                  }}
                                  className="text-gray-500 hover:text-purple-900 p-0.5"
                                >
                                  <Minus size={11} />
                                </button>
                                <span className="text-xs font-bold text-purple-950 w-4 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(cartId, item.quantity + 1)}
                                  className="text-gray-500 hover:text-purple-900 p-0.5"
                                >
                                  <Plus size={11} />
                                </button>
                              </div>
                              <span className="text-[10px] text-gray-400">
                                Sub: ₹{(itemPrice * item.quantity).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* ══ Purplle-style Coupon Applicator ══ */}
                    <div className="pt-4 mt-2 border-t border-purple-100">
                      <div className="flex items-center space-x-1.5 mb-2">
                        <Tag size={13} className="text-purple-700" />
                        <span className="text-xs font-bold text-purple-950">Coupons & Offers</span>
                      </div>

                      {appliedCoupon ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                              <Check size={12} strokeWidth={3} />
                            </div>
                            <div>
                              <p className="font-bold text-emerald-900">{appliedCoupon.code} Applied!</p>
                              <p className="text-[10px] text-emerald-700 font-medium">{appliedCoupon.label}</p>
                            </div>
                          </div>
                          <button
                            onClick={handleRemoveCoupon}
                            className="text-[10px] font-bold text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Enter coupon code (e.g. LUXE25)"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                              className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-1.5 uppercase font-mono tracking-wider focus:outline-none focus:border-purple-600"
                            />
                            <button
                              onClick={() => handleApplyCoupon()}
                              className="px-4 py-1.5 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs rounded-xl transition-all"
                            >
                              Apply
                            </button>
                          </div>
                          {/* Quick Coupon Chip */}
                          <div className="flex items-center space-x-2 flex-wrap gap-y-1.5">
                            {storeSettings?.flashSale?.isActive !== false && (
                              <button
                                onClick={() => handleApplyCoupon(storeSettings?.flashSale?.couponCode || 'TIGER25')}
                                className="bg-gold-50 border border-gold-300 text-purple-950 text-[10px] font-bold px-2.5 py-1 rounded-lg hover:bg-gold-100 flex items-center space-x-1 transition-transform active:scale-95 shadow-xs"
                              >
                                <span>🐯 {storeSettings?.flashSale?.couponCode || 'TIGER25'} ({storeSettings?.flashSale?.discountPercentage || 25}% OFF)</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleApplyCoupon('WELCOME10')}
                              className="bg-purple-50 border border-purple-200 text-purple-900 text-[10px] font-bold px-2.5 py-1 rounded-lg hover:bg-purple-100 transition-transform active:scale-95"
                            >
                              WELCOME10 (10% OFF)
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ══ Purplle-style Cross-Sell / Routine Builder Strip ══ */}
                    {crossSells.length > 0 && (
                      <div className="pt-5 mt-4 border-t border-purple-100">
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center space-x-1.5">
                            <Sparkles size={13} className="text-gold-500" />
                            <h4 className="font-serif text-xs font-bold text-purple-950">Complete Your Ritual</h4>
                          </div>
                          <span className="text-[9px] font-bold text-gold-600 uppercase tracking-wider">Top Add-ons</span>
                        </div>

                        <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                          {crossSells.map((sug) => {
                            const sugPrice = getItemPrice(sug);
                            const sugId = sug.id || sug._id;
                            const isAdding = addingId === sugId;

                            return (
                              <div
                                key={sugId}
                                className="flex-shrink-0 w-36 bg-purple-50/40 rounded-2xl p-2 border border-purple-100/70 flex flex-col justify-between"
                              >
                                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white mb-1.5">
                                  <Image
                                    src={sug.image || sug.images?.[0] || '/images/aloevera_gel.jpg'}
                                    alt={sug.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                    onError={(e) => { e.target.srcset = '/images/aloevera_gel.jpg'; }}
                                  />
                                  {sug.discountPercentage > 0 && (
                                    <span className="absolute top-1 left-1 bg-red-500 text-white font-black text-[8px] px-1.5 py-0.2 rounded-full">
                                      -{sug.discountPercentage}%
                                    </span>
                                  )}
                                </div>

                                <p className="text-[10px] font-bold text-purple-950 truncate mb-1" title={sug.name}>
                                  {sug.name}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                  <span className="text-[11px] font-black text-purple-900">
                                    ₹{sugPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                  </span>

                                  <button
                                    onClick={() => handleQuickAdd(sug)}
                                    disabled={isAdding}
                                    className="px-2.5 py-1 rounded-lg bg-purple-900 hover:bg-purple-950 text-gold-300 font-bold text-[9px] uppercase tracking-wider flex items-center space-x-0.5 shadow-sm active:scale-95 transition-all"
                                  >
                                    <Plus size={10} />
                                    <span>{isAdding ? '✓' : 'Add'}</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer / Summary */}
              {cart.length > 0 && (
                <div className="px-5 sm:px-6 py-4 bg-cream-50/80 border-t border-beige-200 space-y-2.5">
                  {/* Savings callout pill */}
                  {totalSavings > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] font-bold">
                      <span>🎉 Botanical Savings</span>
                      <span className="text-emerald-700 font-black">-₹{totalSavings.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-sm font-bold text-purple-950">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-700">
                      {isFreeShipping ? 'FREE' : `₹${currentShippingCharge}`}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-beige-200/80 flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-purple-950">Total Est.</span>
                    <span className="font-serif text-lg font-bold text-purple-900">
                      ₹{(finalSubtotal + currentShippingCharge).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 px-6 rounded-full bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg transition-all hover:scale-[1.01] active:scale-95"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={14} />
                    </button>

                    <button
                      onClick={handleViewCart}
                      className="w-full py-2 px-6 rounded-full bg-white border border-purple-200 text-purple-900 hover:bg-purple-50 font-bold text-[11px] uppercase tracking-wider transition-all"
                    >
                      View Full Bag
                    </button>
                  </div>

                  <div className="flex items-center justify-center space-x-1.5 text-[9px] text-gray-400 pt-0.5">
                    <ShieldCheck size={12} className="text-emerald-600 flex-shrink-0" />
                    <span>100% Authentic Botanicals • Secure Checkout</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}


