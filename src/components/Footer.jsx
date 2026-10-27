'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  ExternalLink,
  Award,
  CheckCircle2
} from 'lucide-react';

export default function Footer({ onOpenPolicy }) {
  const pathname = usePathname();
  const isCheckout = pathname === '/checkout';

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
      title: '100% Pure & Organic',
      desc: 'Direct botanical extracts',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      icon: Truck,
      title: 'Free Delivery ₹999+',
      desc: 'Fast express shipping',
      color: 'text-gold-600',
      bg: 'bg-gold-50'
    },
    {
      icon: RotateCcw,
      title: '7-Day Easy Returns',
      desc: 'Hassle-free replacement',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      icon: CreditCard,
      title: '100% Safe Checkout',
      desc: 'Prepaid UPI & Cards',
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

  // Minimal distraction-free footer for Checkout
  if (isCheckout) {
    return (
      <footer className="w-full bg-white border-t border-purple-100/80 relative overflow-hidden text-gray-700 mt-2">
        {/* Trust Badges */}
        <div className="bg-gradient-to-r from-purple-50/80 via-white to-purple-50/80 border-b border-purple-100/60 py-4 sm:py-6 px-3.5 sm:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-center text-center sm:text-left p-2.5 sm:p-3 rounded-2xl bg-white/95 border border-purple-100/70 shadow-xs"
                >
                  <div className={`w-8 h-8 rounded-xl ${badge.bg} flex items-center justify-center flex-shrink-0 shadow-sm mb-1.5 sm:mb-0 sm:mr-3`}>
                    <Icon size={16} className={badge.color} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0 w-full">
                    <h4 className="font-serif font-bold text-[10.5px] sm:text-xs text-purple-950 leading-tight">
                      {badge.title}
                    </h4>
                    <p className="text-[8.5px] sm:text-[9.5px] text-gray-500 leading-tight mt-0.5">
                      {badge.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimal Checkout Security Bar */}
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-gray-500">
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[9.5px] font-extrabold text-purple-900">
            <span className="font-bold text-gray-400 uppercase tracking-wider mr-1 text-[9px]">100% Encrypted:</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200">UPI</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200">Google Pay</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200">Cards</span>
            <span className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200">NetBanking</span>
          </div>
          <p className="text-[10px] text-gray-500 text-center">
            © {new Date().getFullYear()} <strong>Evans Luxe Beauty</strong> • Bank-Grade 256-Bit SSL
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-white border-t border-purple-100/80 relative overflow-hidden text-gray-700">
      {/* ── 1. PURPLLE-STYLE TRUST BADGES BAR ── */}
      <div className="bg-gradient-to-r from-purple-50/80 via-white to-purple-50/80 border-b border-purple-100/60 py-5 sm:py-8 px-3.5 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-6">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left p-3 sm:p-4 rounded-2xl bg-white/95 border border-purple-100/70 shadow-[0_2px_10px_rgba(62,29,74,0.04)] hover:shadow-md transition-all duration-300 group"
              >
                <div className={`w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl ${badge.bg} flex items-center justify-center flex-shrink-0 shadow-sm mb-2 sm:mb-0 sm:mr-3.5 group-hover:scale-105 transition-transform`}>
                  <Icon size={16} className={`${badge.color} sm:hidden`} strokeWidth={2.2} />
                  <Icon size={20} className={`${badge.color} hidden sm:block`} strokeWidth={2.2} />
                </div>
                <div className="min-w-0 w-full">
                  <h4 className="font-serif font-bold text-[11px] sm:text-xs md:text-sm text-purple-950 leading-tight">
                    {badge.title}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] md:text-[11px] text-gray-500 leading-tight mt-1">
                    {badge.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. MAIN FOOTER CONTENT GRID ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12 pb-24 sm:pb-20 md:pb-10">
        
        {/* DESKTOP GRID (Hidden on mobile) */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-gray-100">
          
          {/* Brand Info & Newsletter */}
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
              Discover the purest botanical skincare formulated with raw organic essences, cold-pressed French oils, and pure Ayurvedic science.
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
                    className="flex-1 min-w-0 text-xs px-3.5 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 shadow-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 whitespace-nowrap px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1.5"
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

          {/* Column 2: Categories */}
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

          {/* Column 3: Help & Policies */}
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

          {/* Column 4: Evans Luxe Beauty */}
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

        {/* ── MOBILE ACCORDION FOOTER (Official E-commerce Style like Purplle/Nykaa) ── */}
        <div className="md:hidden pb-8 border-b border-gray-100 space-y-4">
          
          {/* Brand Quick Card */}
          <div className="flex items-center justify-between pb-3 border-b border-purple-50">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="relative w-8 h-8 p-[1.5px] rounded-full bg-gradient-to-tr from-gold-500 via-amber-200 to-gold-400 shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <Image src="/images/logo.jpg" alt="Logo" fill sizes="32px" className="object-cover" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-serif text-sm font-bold text-purple-950">Evans Luxe Beauty</span>
                <span className="text-[7.5px] font-bold uppercase tracking-widest text-gold-600 mt-0.5">evansluxebeauty</span>
              </div>
            </Link>
            <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full bg-gold-50 border border-gold-200 text-gold-800 text-[8.5px] font-bold">
              <Award size={11} className="text-gold-600" />
              <span>Certified</span>
            </div>
          </div>

          {/* Newsletter Compact on Mobile */}
          <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-100/70 space-y-2">
            <div className="flex items-center space-x-1.5 text-purple-950 font-bold text-xs">
              <Sparkles size={12} className="text-gold-500" />
              <span>Evans Luxe Beauty Club</span>
            </div>
            {isSubscribed ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold p-2.5 rounded-xl flex items-center space-x-1.5">
                <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                <span>Use code <strong>WELCOME10</strong> for 10% OFF</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-1.5">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-0 text-xs px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-purple-600 shadow-xs"
                  required
                />
                <button
                  type="submit"
                  className="shrink-0 flex-shrink-0 whitespace-nowrap px-3.5 py-2 bg-purple-900 text-white font-bold text-[11px] rounded-xl active:scale-95 transition-all"
                >
                  Join
                </button>
              </form>
            )}
          </div>

          {/* Collapsible Accordions to Avoid Repetition with Header/Bottom Nav */}
          <div className="space-y-1.5 pt-1">
            
            {/* 1. Categories Accordion */}
            <div className="border border-purple-100/70 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => toggleSection('categories')}
                className="w-full flex items-center justify-between p-3 text-xs font-bold text-purple-950 hover:bg-purple-50/40 transition-colors"
              >
                <span>Shop Categories</span>
                <ChevronDown
                  size={15}
                  className={`text-purple-400 transition-transform duration-200 ${
                    openSections['categories'] ? 'rotate-180 text-purple-800' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openSections['categories'] && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3 pb-3 pt-1 space-y-2 text-xs border-t border-purple-50 bg-purple-50/20"
                  >
                    {categories.map((item, idx) => (
                      <li key={idx}>
                        <Link
                          href={item.path}
                          className="text-gray-600 hover:text-purple-900 flex items-center space-x-1.5"
                        >
                          <ChevronRight size={11} className="text-purple-400" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Customer Care & Policies Accordion */}
            <div className="border border-purple-100/70 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => toggleSection('help')}
                className="w-full flex items-center justify-between p-3 text-xs font-bold text-purple-950 hover:bg-purple-50/40 transition-colors"
              >
                <span>Help & Policies</span>
                <ChevronDown
                  size={15}
                  className={`text-purple-400 transition-transform duration-200 ${
                    openSections['help'] ? 'rotate-180 text-purple-800' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openSections['help'] && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3 pb-3 pt-1 space-y-2 text-xs border-t border-purple-50 bg-purple-50/20"
                  >
                    {customerCare.map((item, idx) => (
                      <li key={idx}>
                        {item.policy ? (
                          <button
                            onClick={() => onOpenPolicy ? onOpenPolicy(item.policy) : null}
                            className="text-gray-600 hover:text-purple-900 flex items-center space-x-1.5 text-left w-full"
                          >
                            <ChevronRight size={11} className="text-purple-400" />
                            <span>{item.name}</span>
                          </button>
                        ) : (
                          <Link
                            href={item.path}
                            className="text-gray-600 hover:text-purple-900 flex items-center space-x-1.5"
                          >
                            <ChevronRight size={11} className="text-purple-400" />
                            <span>{item.name}</span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* 3. Evans Luxe Beauty About Accordion */}
            <div className="border border-purple-100/70 rounded-xl overflow-hidden bg-white">
              <button
                onClick={() => toggleSection('about')}
                className="w-full flex items-center justify-between p-3 text-xs font-bold text-purple-950 hover:bg-purple-50/40 transition-colors"
              >
                <span>About Evans Luxe Beauty</span>
                <ChevronDown
                  size={15}
                  className={`text-purple-400 transition-transform duration-200 ${
                    openSections['about'] ? 'rotate-180 text-purple-800' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openSections['about'] && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-3 pb-3 pt-1 space-y-2 text-xs border-t border-purple-50 bg-purple-50/20"
                  >
                    {quickLinks.map((item, idx) => (
                      <li key={idx}>
                        <Link
                          href={item.path}
                          className="text-gray-600 hover:text-purple-900 flex items-center space-x-1.5"
                        >
                          <ChevronRight size={11} className="text-purple-400" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Contact snippet */}
          <div className="pt-2 text-[11px] text-gray-500 space-y-1">
            <p className="flex items-center space-x-1.5">
              <MapPin size={12} className="text-purple-700 flex-shrink-0" />
              <span>NRT Nagar, Theni, Tamil Nadu 625531</span>
            </p>
            <p className="flex items-center space-x-1.5">
              <Phone size={12} className="text-purple-700 flex-shrink-0" />
              <span>+91 89037 77150</span>
            </p>
          </div>
        </div>

        {/* ── 3. BOTTOM BAR (PAYMENT METHODS, SOCIAL & COPYRIGHT) ── */}
        <div className="pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-xs text-gray-500">
          
          {/* Payment Badges */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left w-full sm:w-auto">
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">100% Secure Payments:</span>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 text-[9.5px] sm:text-[10px] font-extrabold text-purple-900">
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-purple-50 border border-purple-200 whitespace-nowrap shrink-0">UPI</span>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-purple-50 border border-purple-200 whitespace-nowrap shrink-0">Google Pay</span>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-purple-50 border border-purple-200 whitespace-nowrap shrink-0">PhonePe</span>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-purple-50 border border-purple-200 whitespace-nowrap shrink-0">Paytm</span>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-purple-50 border border-purple-200 whitespace-nowrap shrink-0">Visa / MC</span>
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-purple-50 border border-purple-200 whitespace-nowrap shrink-0">NetBanking</span>
            </div>
          </div>

          {/* Copyright Note */}
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 text-center">
            <p className="text-[10px] sm:text-[11px] text-gray-500">
              © {new Date().getFullYear()} <strong>Evans Luxe Beauty</strong> (evansluxebeauty). All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
