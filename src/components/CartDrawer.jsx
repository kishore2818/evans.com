"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Sparkles,
  Truck,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function CartDrawer() {
  const router = useRouter();
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, storeSettings } = useStore();

  const threshold = storeSettings?.freeShippingThreshold || 2000;
  
  const subtotal = cart.reduce((acc, item) => {
    const price = item.discountPercentage > 0
      ? item.price - (item.price * (item.discountPercentage / 100))
      : item.price;
    return acc + price * item.quantity;
  }, 0);

  const amountToFreeShipping = Math.max(0, threshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / threshold) * 100));

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

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
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full rounded-l-[2rem] border-l border-beige-200 overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-beige-100 flex items-center justify-between bg-cream-50/70">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-900 text-gold-400 flex items-center justify-center font-bold text-xs shadow-sm">
                    {totalItems}
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-bold text-purple-900 tracking-tight">Your Beauty Bag</h2>
                    <p className="text-[11px] text-gray-500 font-medium">Evans Botanical Apothecary</p>
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
              <div className="px-6 py-3.5 bg-purple-50/80 border-b border-purple-100">
                <div className="flex items-center justify-between text-xs font-semibold text-purple-900 mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <Truck size={14} className="text-purple-700" />
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
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 divide-y divide-beige-100">
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
                  cart.map((item) => {
                    const cartId = item.cartItemId || item.id;
                    const itemPrice = item.discountPercentage > 0
                      ? item.price - (item.price * (item.discountPercentage / 100))
                      : item.price;
                    const originalPrice = item.price;

                    return (
                      <div key={cartId} className="pt-4 first:pt-0 flex space-x-3.5 group">
                        {/* Image */}
                        <div className="relative w-18 h-18 rounded-2xl bg-beige-50 border border-beige-100 overflow-hidden flex-shrink-0 w-[72px] h-[72px]">
                          <Image
                            src={item.image || item.images?.[0] || '/images/placeholder.png'}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized
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
                                ₹{itemPrice.toLocaleString('en-IN')}
                              </span>
                              {item.discountPercentage > 0 && (
                                <span className="text-[10px] text-gray-400 line-through">
                                  ₹{originalPrice.toLocaleString('en-IN')}
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
                              Sub: ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer / Summary */}
              {cart.length > 0 && (
                <div className="px-6 py-5 bg-cream-50/80 border-t border-beige-200 space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-sm font-bold text-purple-950">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold text-emerald-700">
                      {amountToFreeShipping === 0 ? 'FREE' : `₹${storeSettings?.shippingFee || 150}`}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-beige-200/80 flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-purple-950">Total Est.</span>
                    <span className="font-serif text-base font-bold text-purple-900">
                      ₹{(subtotal + (amountToFreeShipping === 0 ? 0 : (storeSettings?.shippingFee || 150))).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 px-6 rounded-full bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-lg transition-all hover:scale-[1.01]"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={14} />
                    </button>

                    <button
                      onClick={handleViewCart}
                      className="w-full py-2.5 px-6 rounded-full bg-white border border-purple-200 text-purple-900 hover:bg-purple-50 font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      View Full Bag & Coupons
                    </button>
                  </div>

                  <div className="flex items-center justify-center space-x-1.5 text-[10px] text-gray-400 pt-1">
                    <ShieldCheck size={12} className="text-emerald-600" />
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
