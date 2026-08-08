'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Droplet, Star, ChevronDown, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';

/* ── Stagger container helpers ── */
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 36, skewY: 2 },
  visible: { opacity: 1, y: 0, skewY: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const fadeIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Category icon map ── */
const CATEGORY_GRADIENTS = [
  'from-purple-900 to-purple-600',
  'from-gold-600 to-gold-400',
  'from-rose-700 to-rose-500',
  'from-emerald-700 to-emerald-500',
  'from-blue-800 to-blue-600',
];

const HomeClient = ({ initialProducts = [] }) => {
  const products = initialProducts;
  const heroRef = useRef(null);
  const { scrollY } = useScroll();

  /* ── Parallax transforms ── */
  const heroBgY = useTransform(scrollY, [0, 700], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const heroTextY = useTransform(scrollY, [0, 400], [0, -60]);

  const bestSellers = [...products]
    .sort((a, b) => (b.ratings?.count || b.reviewsCount || 0) - (a.ratings?.count || a.reviewsCount || 0))
    .slice(0, 6);

  const dynamicCategories = [...new Set(products.map(p => p.category))].filter(Boolean).slice(0, 5);

  /* Testimonials */
  const testimonials = [
    { name: "Sarah J.", role: "Verified Buyer", rating: 5, text: "The Lavender Serenity soap has completely transformed my evening routine. The scent is absolutely heavenly — I'm obsessed." },
    { name: "Priya K.", role: "Verified Buyer", rating: 5, text: "This Vitamin C Serum is a game-changer! My skin has never looked more radiant and smooth. Worth every rupee." },
    { name: "Michael R.", role: "Verified Buyer", rating: 5, text: "Finally, a sunscreen that doesn't leave a white cast. The Mineral Bloom SPF has become my non-negotiable daily staple." },
  ];

  return (
    <div className="pb-8 overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO SECTION — Cinematic, full-height
      ══════════════════════════════════════════ */}
      <div
        ref={heroRef}
        className="relative min-h-[88vh] md:min-h-[92vh] flex flex-col overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1a0a22 0%, #3e1d4a 45%, #5A2A6C 100%)' }}
      >
        {/* Parallax background image */}
        <motion.div
          className="absolute inset-0"
          style={{ y: heroBgY, scale: 1.12 }}
        >
          <Image
            src="/images/hero_background_1775973263788.png"
            alt="Botanical background"
            fill
            sizes="100vw"
            className="object-cover opacity-20 mix-blend-luminosity"
            priority
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(90,42,108,0.6) 0%, transparent 70%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(26,10,34,0.8) 0%, transparent 50%)' }} />
        </motion.div>

        {/* Floating ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', filter: 'blur(60px)' }}
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
            className="absolute top-[30%] right-[8%] w-56 h-56 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #8540b0 0%, transparent 70%)', filter: 'blur(50px)' }}
          />
          <motion.div
            animate={{ x: [0, 15, 0], y: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
            className="absolute bottom-[20%] left-[15%] w-40 h-40 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', filter: 'blur(40px)' }}
          />
        </div>

        {/* Floating botanical elements */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          <motion.div
            animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[18%] left-[12%] text-gold-300/50"
          >
            <Sparkles size={44} />
          </motion.div>
          <motion.div
            animate={{ y: [0, 14, 0], rotate: [0, -6, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute bottom-[28%] right-[12%] text-gold-400/40"
          >
            <Leaf size={52} />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="absolute top-[45%] right-[22%] text-white/20"
          >
            <Droplet size={34} />
          </motion.div>
        </div>

        {/* ── Hero Content ── */}
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="relative z-10 flex flex-col justify-center flex-1 px-6 md:px-16 py-12 md:py-0"
        >
          {/* Mobile logo row */}
          <div className="flex justify-between items-center mb-12 md:hidden">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-gold"
                style={{ border: '2px solid rgba(212,175,55,0.4)' }}>
                <Image src="/images/logo.jpg" alt="Logo" fill sizes="48px" className="object-cover" priority />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-white leading-none">Evans Luxe</h1>
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold-400">Beauty</span>
              </div>
            </div>
          </div>

          {/* Desktop centered logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:flex flex-col items-center mb-10"
          >
            <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 shadow-gold"
              style={{ border: '2px solid rgba(212,175,55,0.45)' }}>
              <Image src="/images/logo.jpg" alt="Logo" fill sizes="80px" className="object-cover" priority />
            </div>
            {/* Decorative line */}
            <div className="flex items-center space-x-4">
              <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4))' }} />
              <Sparkles size={12} className="text-gold-400/60" />
              <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, rgba(212,175,55,0.4))' }} />
            </div>
          </motion.div>

          {/* Main headline */}
          <motion.div
            className="max-w-[320px] md:max-w-3xl md:text-center md:mx-auto"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Eyebrow */}
            <motion.div variants={fadeUp} className="flex items-center space-x-2 mb-5 md:justify-center">
              <div className="h-px w-8 bg-gold-400/60" />
              <span className="text-gold-300 text-[10px] md:text-xs font-bold tracking-[0.35em] uppercase">
                Botanical Manifesto
              </span>
              <div className="h-px w-8 bg-gold-400/60" />
            </motion.div>

            {/* Headline */}
            <motion.h2
              variants={fadeUp}
              className="font-serif leading-[1.05] mb-8 text-white"
              style={{ fontSize: 'clamp(38px, 9vw, 82px)' }}
            >
              Radiant Skin,
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #edc757, #D4AF37, #c49b1a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Naturally.
              </span>
            </motion.h2>

            {/* Sub-copy */}
            <motion.p
              variants={fadeUp}
              className="text-white/60 text-sm md:text-base mb-8 leading-relaxed max-w-xs md:max-w-sm md:mx-auto"
            >
              100% organic botanical care — cruelty-free, sustainably sourced, crafted for your most radiant self.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 md:justify-center">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center space-x-2.5 px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider shadow-gold-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-gold min-h-[52px]"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #edc757)', color: '#1a0a22' }}
              >
                <span>Shop Collection</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wider text-white/80 hover:text-white transition-all min-h-[52px]"
                style={{ border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)' }}
              >
                Explore Botanicals
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Trust badges row ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex items-center space-x-6 mt-12 md:justify-center"
          >
            {[
              { icon: ShieldCheck, label: 'Verified Organic' },
              { icon: Leaf, label: 'Cruelty-Free' },
              { icon: Package, label: 'Free Shipping ₹999+' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center space-x-1.5 text-white/50">
                <Icon size={13} />
                <span className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center space-y-1"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={22} className="text-white/30" />
          </motion.div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════
          CATEGORIES SECTION
      ══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="px-6 mt-16 md:mt-24"
      >
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500 mb-2">Browse</p>
          <h3 className="font-serif text-2xl md:text-4xl font-bold text-purple-900">Shop by Category</h3>
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-4 pb-4 md:justify-center md:flex-wrap">
          {dynamicCategories.map((catName, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.04 }}
              className="flex-shrink-0"
            >
              <Link
                href={`/products?category=${catName}`}
                className="flex flex-col items-center group w-[100px] md:w-[120px]"
              >
                <div
                  className={`w-[76px] h-[76px] md:w-[88px] md:h-[88px] rounded-[1.6rem] bg-gradient-to-br ${CATEGORY_GRADIENTS[idx % CATEGORY_GRADIENTS.length]} flex items-center justify-center shadow-luxury group-hover:shadow-luxury-lg transition-all duration-500 mb-3 relative overflow-hidden`}
                >
                  {/* Shine on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)' }} />
                  <Leaf size={30} strokeWidth={1.4} className="text-white/90 relative z-10" />
                </div>
                <span className="text-[11px] font-bold text-gray-600 group-hover:text-purple-900 transition-colors uppercase tracking-wider text-center leading-tight">
                  {catName}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════
          PROMO BANNER
      ══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="px-6 md:px-16 mt-16 md:mt-24"
      >
        <div
          className="relative rounded-[2.5rem] md:rounded-[3rem] overflow-hidden p-8 md:p-14"
          style={{ background: 'linear-gradient(135deg, #3e1d4a 0%, #5A2A6C 60%, #8540b0 100%)' }}
        >
          {/* Ambient orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', filter: 'blur(60px)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-20 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #8540b0 0%, transparent 70%)', filter: 'blur(50px)', transform: 'translate(-30%, 30%)' }} />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="text-center md:text-left max-w-lg">
              <div className="inline-flex items-center space-x-2 mb-4 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}>
                <Sparkles size={12} className="text-gold-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-300">Our Promise</span>
              </div>
              <h4 className="font-serif font-bold text-white text-2xl md:text-4xl mb-3 leading-tight">
                100% Organic<br />Botanical Care
              </h4>
              <p className="text-white/60 text-sm md:text-base leading-relaxed mb-6">
                Cruelty-free, chemical-free, and sustainably sourced — for your most radiant, healthiest self.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider text-purple-900 hover:-translate-y-1 transition-all shadow-gold min-h-0"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #edc757)' }}
              >
                <span>Explore Range</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Badges */}
            <div className="flex flex-row md:flex-col gap-4 flex-shrink-0">
              {[
                { icon: ShieldCheck, label: 'Verified', sub: 'Lab Tested' },
                { icon: Leaf, label: 'Organic', sub: '100% Natural' },
                { icon: Droplet, label: 'Pure', sub: 'Chemical-Free' },
              ].map(({ icon: Icon, label, sub }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.2)' }}>
                    <Icon size={20} className="text-gold-300" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-none">{label}</p>
                    <p className="text-white/50 text-[10px] mt-0.5">{sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════
          BEST SELLERS
      ══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 md:px-16 mt-20 mb-8"
      >
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500 mb-1">Top Picks</p>
            <h3 className="font-serif text-2xl md:text-4xl font-bold text-purple-900">
              Our Best Sellers
            </h3>
            <div className="mt-2 h-1 w-16 rounded-full"
              style={{ background: 'linear-gradient(90deg, #D4AF37, #edc757)' }} />
          </div>
          <Link
            href="/products?category=All"
            className="group flex items-center space-x-1.5 text-purple-700 text-sm font-bold hover:text-purple-900 transition-colors min-h-0 min-w-0"
          >
            <span>View All</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {bestSellers.length > 0 ? (
            bestSellers.map((product, idx) => (
              <motion.div
                key={product._id || product.id}
                className={`${idx >= 4 ? 'hidden md:block' : 'block'}`}
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))
          ) : (
            /* Empty state while loading */
            [...Array(6)].map((_, i) => (
              <div key={i} className={`${i >= 4 ? 'hidden md:block' : 'block'}`}>
                <div className="rounded-[2rem] bg-beige-100 aspect-square animate-shimmer mb-3" />
                <div className="h-3 w-3/4 bg-beige-100 rounded-full animate-shimmer mb-2" />
                <div className="h-3 w-1/2 bg-beige-100 rounded-full animate-shimmer" />
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <div className="px-6 md:px-16 mt-20 mb-8">
        <div className="text-center mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500 mb-2">Community</p>
          <h3 className="font-serif text-3xl md:text-5xl font-bold text-purple-900 mb-3">Loved by You</h3>
          <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto italic">
            "Inspired by nature, perfected by science."
          </p>
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-5 pb-4 md:grid md:grid-cols-3 md:gap-7 md:overflow-visible">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
              className="flex-shrink-0 w-[300px] md:w-full relative group"
            >
              <div
                className="h-full p-7 rounded-[2.5rem] flex flex-col justify-between"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(90,42,108,0.08)',
                  boxShadow: '0 4px 24px rgba(90,42,108,0.10)',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                {/* Decorative quote mark */}
                <span className="absolute top-5 right-7 font-serif text-7xl leading-none text-purple-100 pointer-events-none select-none">
                  "
                </span>

                {/* Stars */}
                <div className="flex space-x-0.5 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#D4AF37" className="text-gold-400" />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-gray-700 text-sm leading-relaxed italic flex-1 mb-6 relative z-10">
                  "{item.text}"
                </p>

                {/* Author */}
                <div className="flex items-center space-x-3 pt-4 border-t border-beige-100">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-gold-300 font-serif text-lg font-bold flex-shrink-0 shadow-luxury"
                    style={{ background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)' }}
                  >
                    {item.name[0]}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-gray-900 leading-none mb-0.5">{item.name}</h5>
                    <p className="text-[9px] text-purple-600 uppercase tracking-widest font-bold">{item.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BOTTOM CTA STRIP
      ══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-6 md:px-16 mt-12 mb-4"
      >
        <div
          className="rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, #fdf9ec 0%, #F5F1EA 100%)', border: '1px solid rgba(212,175,55,0.2)' }}
        >
          <div className="text-center md:text-left">
            <h4 className="font-serif text-xl md:text-2xl font-bold text-purple-900 mb-1">
              Free shipping on orders over ₹999
            </h4>
            <p className="text-gray-500 text-sm">Pan-India delivery, tracked and packed with love.</p>
          </div>
          <Link
            href="/products"
            className="flex-shrink-0 inline-flex items-center space-x-2 px-7 py-3.5 rounded-full font-black text-sm uppercase tracking-wider text-gold-300 shadow-luxury hover:-translate-y-1 transition-all min-h-0"
            style={{ background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)' }}
          >
            <span>Start Shopping</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </motion.div>

    </div>
  );
};

export default HomeClient;
