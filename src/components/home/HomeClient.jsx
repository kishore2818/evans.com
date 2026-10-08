'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Leaf, 
  Droplet, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Tag,
  Percent,
  Award,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import CategoryIcon from '@/components/CategoryIcon';
import toast from 'react-hot-toast';

/* ── Category Color Palettes for attractive colorful cards ── */
const CATEGORY_STYLES = {
  'Soaps': {
    bg: 'bg-gradient-to-br from-purple-100 via-purple-50 to-white',
    border: 'border-purple-200/80',
    ring: 'ring-purple-300',
    pill: 'bg-purple-100 text-purple-800',
    shadow: 'shadow-[0_8px_20px_rgba(156,0,173,0.12)]'
  },
  'Face Wash': {
    bg: 'bg-gradient-to-br from-rose-100 via-rose-50 to-white',
    border: 'border-rose-200/80',
    ring: 'ring-rose-300',
    pill: 'bg-rose-100 text-rose-800',
    shadow: 'shadow-[0_8px_20px_rgba(244,63,94,0.12)]'
  },
  'Serums': {
    bg: 'bg-gradient-to-br from-amber-100 via-amber-50 to-white',
    border: 'border-amber-200/80',
    ring: 'ring-amber-300',
    pill: 'bg-amber-100 text-amber-800',
    shadow: 'shadow-[0_8px_20px_rgba(245,158,11,0.15)]'
  },
  'Creams': {
    bg: 'bg-gradient-to-br from-yellow-100 via-amber-50/60 to-white',
    border: 'border-yellow-200/80',
    ring: 'ring-yellow-300',
    pill: 'bg-yellow-100 text-yellow-800',
    shadow: 'shadow-[0_8px_20px_rgba(202,138,4,0.12)]'
  },
  'Hair Care': {
    bg: 'bg-gradient-to-br from-emerald-100 via-emerald-50 to-white',
    border: 'border-emerald-200/80',
    ring: 'ring-emerald-300',
    pill: 'bg-emerald-100 text-emerald-800',
    shadow: 'shadow-[0_8px_20px_rgba(16,185,129,0.12)]'
  },
  'Scrubs': {
    bg: 'bg-gradient-to-br from-orange-100 via-orange-50 to-white',
    border: 'border-orange-200/80',
    ring: 'ring-orange-300',
    pill: 'bg-orange-100 text-orange-800',
    shadow: 'shadow-[0_8px_20px_rgba(249,115,22,0.12)]'
  },
  'Gels': {
    bg: 'bg-gradient-to-br from-teal-100 via-teal-50 to-white',
    border: 'border-teal-200/80',
    ring: 'ring-teal-300',
    pill: 'bg-teal-100 text-teal-800',
    shadow: 'shadow-[0_8px_20px_rgba(20,184,166,0.12)]'
  },
  'default': {
    bg: 'bg-gradient-to-br from-purple-100 via-purple-50 to-white',
    border: 'border-purple-200',
    ring: 'ring-purple-300',
    pill: 'bg-purple-100 text-purple-900',
    shadow: 'shadow-md'
  }
};

const HomeClient = ({ initialProducts = [] }) => {
  const products = initialProducts;

  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      image: '/images/evans_hero_banner.jpg',
      tag: '✨ 100% ORGANIC BOTANICAL SKINCARE',
      title: 'Evans Luxe Beauty',
      subtitle: 'Pure Radiance Crafted with French Lavender, Raw Shea & Kashmiri Saffron.',
      ctaText: 'Explore Collection',
      ctaLink: '/products',
      badge: 'Bestseller'
    },
    {
      id: 2,
      image: '/images/evans_deals_banner.jpg',
      tag: '⚡ EVANSLUXEBEAUTY FESTIVAL GLOW • UP TO 40% OFF',
      title: 'Evans Luxe Beauty',
      subtitle: 'Indulge in Cold-Pressed Artisan Soaps, Serums & Luxurious Creams.',
      ctaText: 'Shop Mega Offers',
      ctaLink: '/products?sale=true',
      badge: 'Code: LUXE25'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const bestSellers = [...products]
    .sort((a, b) => (b.ratings?.count || b.reviewsCount || 0) - (a.ratings?.count || a.reviewsCount || 0))
    .slice(0, 8);

  const flashSaleItems = products.filter(p => p.flashSale?.isActive).slice(0, 4);

  const dynamicCategories = [...new Set(products.map(p => p.category))].filter(Boolean);

  /* Customer Testimonials */
  const testimonials = [
    { 
      name: "Sarah J.", 
      role: "Verified Buyer", 
      rating: 5, 
      text: "The Lavender Serenity artisan soap completely calmed my skin. The pure botanical fragrance feels like a French spa in my bath.",
      product: "Lavender Serenity Bar"
    },
    { 
      name: "Priya K.", 
      role: "Verified Buyer", 
      rating: 5, 
      text: "This 24kt Gold Radiance Serum is worth every rupee! My dark spots faded within 3 weeks and my complexion looks lit from within.",
      product: "24kt Gold Radiance Serum"
    },
    { 
      name: "Michael R.", 
      role: "Verified Buyer", 
      rating: 5, 
      text: "Zero white cast, non-sticky and soothing. Evans Luxe Beauty has become our entire family's everyday skincare ritual.",
      product: "Saffron Day Cream"
    },
  ];

  return (
    <div className="pb-12 overflow-x-hidden space-y-7 sm:space-y-12 md:space-y-16">

      {/* ══════════════════════════════════════════
          1. PURPLLE-STYLE HERO CAROUSEL BANNER
      ══════════════════════════════════════════ */}
      <section className="px-2.5 sm:px-6 lg:px-8">
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] min-h-[280px] sm:min-h-[420px] lg:min-h-[480px] rounded-2xl sm:rounded-[3rem] overflow-hidden shadow-2xl border border-purple-100/60 group">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              {/* High-Resolution AI Beauty Background */}
              <Image
                src={heroSlides[currentSlide].image}
                alt={heroSlides[currentSlide].title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover object-center"
              />

              {/* Dark & Purple Gradient Vignette for Crisp Text Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-950/85 via-purple-950/45 to-transparent sm:from-purple-950/90 sm:via-purple-900/40" />

              {/* Text Overlay (Strictly Evans Luxe Beauty) */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-xl sm:max-w-2xl text-white z-10">
                
                {/* Sale / Quality Tag */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-400/20 border border-gold-300/40 backdrop-blur-md text-gold-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest w-fit mb-3"
                >
                  <Sparkles size={12} className="text-gold-300" />
                  <span>{heroSlides[currentSlide].tag}</span>
                </motion.div>

                {/* Hero Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-3"
                >
                  {heroSlides[currentSlide].title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xs sm:text-sm lg:text-base text-purple-100/90 leading-relaxed max-w-lg mb-6 line-clamp-2 sm:line-clamp-none font-medium"
                >
                  {heroSlides[currentSlide].subtitle}
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <Link
                    href={heroSlides[currentSlide].ctaLink}
                    className="px-6 sm:px-8 py-3 rounded-full bg-gradient-to-r from-gold-500 via-amber-400 to-gold-500 text-purple-950 font-black text-xs uppercase tracking-widest shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
                  >
                    <span>{heroSlides[currentSlide].ctaText}</span>
                    <ArrowRight size={14} />
                  </Link>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('LUXE25');
                      toast.success('Coupon code LUXE25 copied! Apply at checkout.');
                    }}
                    className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Use Code: <span className="text-gold-300 font-black">LUXE25</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Arrow Controls */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-all z-20"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all rounded-full ${
                  currentSlide === idx ? 'w-7 h-2 bg-gold-400' : 'w-2 h-2 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. PURPLLE-STYLE CATEGORIES BUBBLE SCROLLER
          (Distinct colorful backgrounds for each card)
      ══════════════════════════════════════════ */}
      <section className="px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-3 sm:mb-6">
          <div>
            <div className="flex items-center space-x-1.5 text-gold-600 font-bold text-[10px] uppercase tracking-[0.25em] mb-1">
              <Sparkles size={12} />
              <span>Curated Botanicals</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-950">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-purple-700 hover:text-purple-950 flex items-center space-x-1 transition-colors"
          >
            <span>All Categories</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* Horizontal Category Cards with Distinct Pastel Colors */}
        <div className="flex overflow-x-auto no-scrollbar space-x-4 sm:space-x-6 pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {dynamicCategories.map((catName, idx) => {
            const style = CATEGORY_STYLES[catName] || CATEGORY_STYLES['default'];
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className="flex-shrink-0"
              >
                <Link
                  href={`/products?category=${encodeURIComponent(catName)}`}
                  className={`flex flex-col items-center justify-between p-4 sm:p-5 w-28 sm:w-36 h-36 sm:h-44 rounded-3xl ${style.bg} border ${style.border} ${style.shadow} transition-all group`}
                >
                  {/* Category Circular Bubble */}
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center p-2.5 border border-white group-hover:scale-110 transition-transform duration-300">
                    <CategoryIcon category={catName} className="w-10 h-10 sm:w-14 sm:h-14 text-purple-800" />
                  </div>

                  {/* Name Pill */}
                  <span className="font-bold text-xs sm:text-sm text-purple-950 text-center leading-tight line-clamp-1 group-hover:text-purple-700 transition-colors">
                    {catName}
                  </span>

                  {/* Micro subtext */}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${style.pill} uppercase tracking-wider`}>
                    Explore
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. FLASH DEALS BANNER STRIP (Purplle-Style)
      ══════════════════════════════════════════ */}
      <section className="px-2.5 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-[2.5rem] bg-gradient-to-r from-purple-900 via-purple-800 to-purple-950 p-4 sm:p-10 text-white overflow-hidden shadow-xl border border-purple-700/50">
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left space-y-2 max-w-lg">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 text-[10px] font-bold uppercase tracking-widest">
                <Percent size={12} />
                <span>Limited-Time Flash Deals</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Evans Luxe Beauty Mega Savings Day
              </h3>
              <p className="text-xs sm:text-sm text-purple-200">
                Unlock an additional 25% instant discount across all organic serums & facial bars.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="px-5 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center">
                <p className="text-[10px] text-gold-300 font-bold uppercase tracking-wider">Use Coupon Code</p>
                <p className="font-mono text-base font-black text-white tracking-widest">LUXE25</p>
              </div>
              <Link
                href="/products?sale=true"
                className="px-6 py-3.5 rounded-2xl bg-gold-400 hover:bg-gold-500 text-purple-950 font-black text-xs uppercase tracking-widest shadow-lg transition-transform active:scale-95 whitespace-nowrap"
              >
                Shop Deals Now →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. BEST SELLERS PRODUCT GRID (Purplle-Style)
      ══════════════════════════════════════════ */}
      <section className="px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-3 sm:mb-8">
          <div>
            <div className="flex items-center space-x-1.5 text-gold-600 font-bold text-[10px] uppercase tracking-[0.25em] mb-1">
              <Star size={12} fill="#D4AF37" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-950">
              Our Bestselling Formulas
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-purple-700 hover:text-purple-950 flex items-center space-x-1"
          >
            <span>View All</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* 2-Column Mobile, 4-Column Desktop Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {bestSellers.length > 0 ? (
            bestSellers.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))
          ) : (
            [...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square rounded-3xl bg-purple-50 animate-pulse" />
            ))
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. TESTIMONIALS & REVIEWS SECTION
      ══════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 max-w-xl mx-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-600 mb-1">Authentic Reflections</p>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-purple-950 mb-2">
            Loved by 10,000+ Customers
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Real experiences from verified users of Evans Luxe Beauty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-purple-100 shadow-[0_4px_20px_rgba(90,42,108,0.06)] flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center space-x-1 text-gold-400 mb-3">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#D4AF37" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-purple-950">{item.name}</h4>
                  <p className="text-[10px] text-emerald-700 font-semibold">{item.role}</p>
                </div>
                <span className="text-[9px] font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                  {item.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomeClient;
