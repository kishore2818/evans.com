'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText, Truck, RefreshCw, Mail, Phone, ChevronRight } from 'lucide-react';

export default function PolicyModal({ isOpen, onClose, initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms of Service', icon: FileText },
    { id: 'shipping', label: 'Shipping Policy', icon: Truck },
    { id: 'returns', label: 'Returns & Refunds', icon: RefreshCw },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-purple-950/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl border border-purple-100 flex flex-col max-h-[88vh] overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-950 text-white flex items-center justify-between border-b border-purple-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gold-400/20 border border-gold-300/40 flex items-center justify-center text-gold-300">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold tracking-tight">Evans Luxe Beauty</h3>
                <p className="text-[11px] text-purple-200">Customer Trust & Legal Policies</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="flex border-b border-gray-100 bg-purple-50/50 overflow-x-auto no-scrollbar px-4 pt-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-bold text-xs whitespace-nowrap transition-all ${
                    isActive
                      ? 'border-purple-900 text-purple-950 bg-white rounded-t-xl shadow-sm'
                      : 'border-transparent text-gray-500 hover:text-purple-900'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-purple-700' : 'text-gray-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-gray-700 text-sm leading-relaxed">
            {activeTab === 'privacy' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-serif text-lg font-bold text-purple-950 mb-1">Privacy Policy</h4>
                  <p className="text-xs text-gray-400">Last updated: October 2026</p>
                </div>
                <p>
                  At <strong>Evans Luxe Beauty</strong> (operating as evansluxebeauty), we are committed to honoring and safeguarding your personal privacy. This Privacy Policy details how we collect, utilize, and protect your information when you visit or make a purchase from our store.
                </p>

                <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100/70 space-y-2">
                  <h5 className="font-bold text-purple-950 text-xs uppercase tracking-wider">1. Information We Collect</h5>
                  <p className="text-xs text-gray-600">
                    When you place an order, we collect details necessary to process your transaction: your name, billing address, shipping address, payment information (encrypted via PCI-DSS compliant gateways), email address, and phone number.
                  </p>
                </div>

                <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100/70 space-y-2">
                  <h5 className="font-bold text-purple-950 text-xs uppercase tracking-wider">2. How We Use Your Information</h5>
                  <p className="text-xs text-gray-600">
                    We use your order information to fulfill orders, arrange shipping, send order confirmations and tracking updates, screen orders for fraud, and provide customer support. With your explicit consent, we may send you offers and new collection announcements.
                  </p>
                </div>

                <div className="bg-purple-50/60 rounded-2xl p-4 border border-purple-100/70 space-y-2">
                  <h5 className="font-bold text-purple-950 text-xs uppercase tracking-wider">3. 100% Data Security Guarantee</h5>
                  <p className="text-xs text-gray-600">
                    We never sell, rent, or lease your personal information to third parties. All payment transactions are encrypted using industry-standard 256-bit SSL encryption.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'terms' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-serif text-lg font-bold text-purple-950 mb-1">Terms of Service</h4>
                  <p className="text-xs text-gray-400">Standard Consumer Agreement</p>
                </div>
                <p>
                  By accessing or purchasing from <strong>Evans Luxe Beauty</strong>, you agree to be bound by these terms. Our botanical skincare and artisan beauty products are formulated using organic, pure plant ingredients and cold-pressed elixirs.
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-cream-50 rounded-xl border border-beige-200">
                    <p className="font-bold text-xs text-purple-900">Product Authenticity</p>
                    <p className="text-xs text-gray-600 mt-1">All items listed on Evans Luxe Beauty are 100% genuine and made under strict Ayurvedic and dermatological quality standards.</p>
                  </div>
                  <div className="p-3 bg-cream-50 rounded-xl border border-beige-200">
                    <p className="font-bold text-xs text-purple-900">Pricing and Availability</p>
                    <p className="text-xs text-gray-600 mt-1">Prices for our products are subject to change without prior notice. We reserve the right to limit sales quantities on promotional flash sale campaigns.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-serif text-lg font-bold text-purple-950 mb-1">Shipping & Delivery Policy</h4>
                  <p className="text-xs text-gray-400">Fast & Reliable Pan-India Delivery</p>
                </div>
                <p>
                  We partner with top-tier courier partners (BlueDart, Delhivery, DTDC, Xpressbees) to ensure your beauty parcels reach you in pristine condition.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <p className="text-purple-900 font-bold text-xs flex items-center space-x-1.5">
                      <span>🚚 Delivery Timelines</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Metro cities: 2 to 3 business days.<br/>Rest of India: 4 to 6 business days.</p>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-emerald-900 font-bold text-xs flex items-center space-x-1.5">
                      <span>🎉 Free Shipping</span>
                    </p>
                    <p className="text-xs text-gray-600 mt-1">Free delivery on all orders above ₹999. A nominal fee of ₹150 applies on orders below ₹999.</p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs text-gray-600">
                  <strong>Tracking Your Order:</strong> As soon as your order is dispatched, you will receive an SMS and email notification with your live AWB tracking link.
                </div>
              </div>
            )}

            {activeTab === 'returns' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-serif text-lg font-bold text-purple-950 mb-1">Returns, Refunds & Cancellations</h4>
                  <p className="text-xs text-gray-400">7-Day Easy Customer Guarantee</p>
                </div>
                <p>
                  Your complete satisfaction with <strong>Evans Luxe Beauty</strong> is our utmost priority. Because our products are personal care and botanical cosmetics, we follow hygienic return guidelines.
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100">
                    <h5 className="font-bold text-rose-950 text-xs">Damaged, Defective or Incorrect Items</h5>
                    <p className="text-xs text-gray-600 mt-1">
                      If you receive a damaged or incorrect product, contact us within 7 days of delivery with an unboxing photo or video. We will promptly dispatch a free replacement or issue a 100% full refund.
                    </p>
                  </div>

                  <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-100">
                    <h5 className="font-bold text-purple-950 text-xs">Refund Processing</h5>
                    <p className="text-xs text-gray-600 mt-1">
                      Refunds are processed within 24–48 hours of verification and credited directly back to your original source of payment (UPI, Card, Net Banking).
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Contact Callout */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Phone size={13} className="text-purple-700" />
                <span>+91 89037 77150</span>
              </span>
              <span className="flex items-center space-x-1">
                <Mail size={13} className="text-purple-700" />
                <span>evansluxebeauty@gmail.com</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-purple-900 text-white font-bold hover:bg-purple-950 transition-colors"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
