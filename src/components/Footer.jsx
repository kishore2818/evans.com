'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Mail,
  Send,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Heart,
  ChevronRight,
  ExternalLink,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function Footer({ onOpenPolicy }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsSubscribed(true);
    toast.success('🎉 Welcome to Evans Luxe Beauty Club! Use code WELCOME10 for 10% OFF');
    setEmail('');
  };

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: '100% Genuine & Pure',
      desc: 'Direct botanical formulations, no middlemen',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: Truck,
      title: 'Free Pan-India Delivery',
      desc: 'Complimentary shipping on orders above ₹999',
      color: 'text-gold-600',
      bg: 'bg-gold-50'
    },
    {
      icon: RotateCcw,
      title: '7-Day Easy Returns',
      desc: 'Hassle-free replacement guarantee',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      icon: CreditCard,
      title: '100% Secure Checkout',
      desc: 'Prepaid UPI, Cards & NetBanking (100% Safe)',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  const categories = [
    { name: 'Artisan Soaps', path: '/products?category=Soaps' },
    { name: 'Gentle Face Wash', path: '/products?category=Face%20Wash' },
    { name: 'Radiance Serums', path: '/products?category=Serums' },
    { name: 'Nourishing Creams', path: '/products?category=Creams' },
    { name: 'Hair Care & Oils', path: '/products?category=Hair%20Care' },
    { name: 'Exfoliating Scrubs', path: '/products?category=Scrubs' },
    { name: 'Flash Deals & Offers', path: '/products?sale=true' },
  ];

  const customerCare = [
    { name: 'Track My Order', path: '/profile/orders' },
    { name: 'Contact & Store Info', path: '/contact' },
    { name: 'Shipping & Delivery', policy: 'shipping' },
    { name: 'Returns & Refund Policy', policy: 'returns' },
    { name: 'Privacy Policy', policy: 'privacy' },
    { name: 'Terms of Service', policy: 'terms' },
  ];

  const quickLinks = [
    { name: 'About Evans Luxe Beauty', path: '/' },
    { name: 'Clean Beauty Standards', path: '/products' },
    { name: 'Botanical Ingredients', path: '/products' },
    { name: 'My Account & Orders', path: '/profile' },
    { name: 'My Saved Wishlist', path: '/profile/wishlist' },
  ];

  return (
    <footer className="w-full bg-white border-t border-purple-100/80 relative overflow-hidden text-gray-700">
      {/* ── 1. PURPLLE-STYLE TRUST BADGES BAR ── */}
      <div className="bg-gradient-to-r from-purple-50/80 via-white to-purple-50/80 border-b border-purple-100/60 py-8 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="flex items-center space-x-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-purple-100/70 shadow-[0_2px_12px_rgba(90,42,108,0.05)] hover:shadow-md transition-shadow"
              >
                <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${badge.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <Icon size={22} className={badge.color} strokeWidth={2.2} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-purple-950 truncate leading-snug">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-2 leading-tight mt-0.5">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. MAIN FOOTER CONTENT GRID ── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-12 pb-32 sm:pb-20 md:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-gray-100">
          
          {/* Brand Info & Newsletter (2 Columns on Desktop) */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center space-x-3 group">
              <div className="relative w-10 h-10 p-[2px] rounded-full bg-gradient-to-tr from-gold-500 via-amber-200 to-gold-400 shadow-[0_0_12px_rgba(212,175,55,0.4)] shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden border border-purple-950/30 relative">
                  <Image src="/images/logo.jpg" alt="Evans Luxe Beauty" fill sizes="40px" className="object-cover" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-xl font-bold tracking-tight text-purple-900 group-hover:text-purple-700 transition-colors">
                  Evans Luxe Beauty
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold-600 mt-0.5">
                  evansluxebeauty
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
              Discover the purest botanical skincare formulated with raw organic essences, cold-pressed French oils, and pure Ayurvedic science. Handcrafted for your skin's timeless radiance.
            </p>

            {/* Newsletter Subscription */}
            <div className="bg-purple-50/70 p-4 sm:p-5 rounded-3xl border border-purple-100/80 max-w-sm space-y-2.5">
              <div className="flex items-center space-x-1.5 text-purple-950 font-bold text-xs">
                <Sparkles size={14} className="text-gold-500" />
                <span>Join Evans Luxe Beauty Club</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Get insider beauty secrets & exclusive flash discount codes.
              </p>

              {isSubscribed ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-2xl flex items-center space-x-2">
                  <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                  <span>Welcome! Use code <strong>WELCOME10</strong> for 10% OFF</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 min-w-0 text-xs px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 shadow-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 whitespace-nowrap px-4 py-2.5 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5"
                  >
                    <span>Join</span>
                    <Send size={11} className="flex-shrink-0" />
                  </button>
                </form>
              )}
            </div>

            {/* Store Address & Contact snippet */}
            <div className="space-y-1.5 text-xs text-gray-500 pt-1">
              <p className="flex items-center space-x-2">
                <MapPin size={13} className="text-purple-700 flex-shrink-0" />
                <span>NRT Nagar, Theni, Tamil Nadu 625531</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone size={13} className="text-purple-700 flex-shrink-0" />
                <span>+91 89037 77150 • Mon–Sat 9AM–8PM</span>
              </p>
            </div>
          </div>

          {/* Column 2: Shop by Category */}
          <div className="space-y-3.5">
            <h4 className="font-serif font-bold text-sm text-purple-950 tracking-wider uppercase border-b border-purple-100 pb-2">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.path}
                    className="text-gray-600 hover:text-purple-900 font-medium flex items-center space-x-1 group transition-colors"
                  >
                    <ChevronRight size={12} className="text-purple-300 group-hover:text-gold-500 group-hover:translate-x-0.5 transition-all" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="space-y-3.5">
            <h4 className="font-serif font-bold text-sm text-purple-950 tracking-wider uppercase border-b border-purple-100 pb-2">
              Help & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              {customerCare.map((item, idx) => (
                <li key={idx}>
                  {item.policy ? (
                    <button
                      onClick={() => onOpenPolicy ? onOpenPolicy(item.policy) : null}
                      className="text-gray-600 hover:text-purple-900 font-medium flex items-center space-x-1 group transition-colors text-left"
                    >
                      <ChevronRight size={12} className="text-purple-300 group-hover:text-gold-500 group-hover:translate-x-0.5 transition-all" />
                      <span>{item.name}</span>
                    </button>
                  ) : (
                    <Link
                      href={item.path}
                      className="text-gray-600 hover:text-purple-900 font-medium flex items-center space-x-1 group transition-colors"
                    >
                      <ChevronRight size={12} className="text-purple-300 group-hover:text-gold-500 group-hover:translate-x-0.5 transition-all" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Links & Trust */}
          <div className="space-y-3.5">
            <h4 className="font-serif font-bold text-sm text-purple-950 tracking-wider uppercase border-b border-purple-100 pb-2">
              Evans Luxe Beauty
            </h4>
            <ul className="space-y-2 text-xs">
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.path}
                    className="text-gray-600 hover:text-purple-900 font-medium flex items-center space-x-1 group transition-colors"
                  >
                    <ChevronRight size={12} className="text-purple-300 group-hover:text-gold-500 group-hover:translate-x-0.5 transition-all" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200 text-gold-700 text-[10px] font-bold">
                <Award size={13} className="text-gold-500" />
                <span>Govt. Certified Ayurvedic</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── 3. BOTTOM BAR (PAYMENT METHODS, SOCIAL & COPYRIGHT) ── */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500">
          
          {/* Payment Badges */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left w-full sm:w-auto">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">100% Secure Payments:</span>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-[10px] font-extrabold text-purple-900">
              <span className="px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 whitespace-nowrap flex-shrink-0">UPI</span>
              <span className="px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 whitespace-nowrap flex-shrink-0">Google Pay</span>
              <span className="px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 whitespace-nowrap flex-shrink-0">PhonePe</span>
              <span className="px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 whitespace-nowrap flex-shrink-0">Paytm</span>
              <span className="px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 whitespace-nowrap flex-shrink-0">Visa / MC</span>
              <span className="px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 whitespace-nowrap flex-shrink-0">NetBanking</span>
            </div>
          </div>

          {/* Copyright Note */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 text-center">
            <p className="text-[11px] text-gray-500">
              © {new Date().getFullYear()} <strong>Evans Luxe Beauty</strong> (evansluxebeauty). All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
