"use client";

import API_BASE_URL from '@/config/api';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Droplet, Star, ChevronDown, Package } from 'lucide-react';
import { Link } from '@/router-shim';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/skeletons/ProductSkeleton';
import CategorySkeleton from '../components/skeletons/CategorySkeleton';
import CategoryIcon from '../components/CategoryIcon';
import * as Icons from 'lucide-react';

/* ── Stagger container animation variants ── */
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const CATEGORY_GRADIENTS = [
  'from-purple-900 to-purple-700',
  'from-gold-600 to-gold-400',
  'from-rose-800 to-rose-600',
  'from-emerald-800 to-emerald-600',
  'from-amber-700 to-amber-500',
];

const Home = () => {
  const [products, setProducts] = React.useState([]);
  const [bestSellers, setBestSellers] = React.useState([]);
  const [dynamicCategories, setDynamicCategories] = React.useState([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const data = await response.json();
        
        const formattedData = data.map(p => ({
          ...p,
          id: p._id,
          image: p.images && p.images.length > 0 ? p.images[0] : '/images/placeholder.png',
          rating: p.ratings?.average || 5,
          reviews: p.ratings?.count || 0
        }));
        setProducts(formattedData);
        
        // Compute best sellers (top rated/most reviewed)
        const sorted = [...formattedData].sort((a, b) => b.reviews - a.reviews);
        setBestSellers(sorted.slice(0, 8));

        // Compute unique categories with fallback to standard categories
        const defaultCats = ['Serum', 'Soaps', 'Face Wash', 'Sunscreen', 'Lip Balm', 'Cream', 'Hair Oil', 'Shampoo'];
        const unq = [...new Set([...formattedData.map(p => p.category).filter(Boolean), ...defaultCats])];
        setDynamicCategories(unq.slice(0, 8));
      } catch (error) {
        console.error("Failed to load products for home page", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="pb-8 overflow-x-hidden">
      {/* ══════════════════════════════════════════
          HERO SECTION — Compact Luxury Golden Crown Banner
      ══════════════════════════════════════════ */}
      <div className="relative py-8 md:py-12 px-6 md:px-16 bg-gradient-to-br from-[#1a0a22] via-[#3e1d4a] to-[#5A2A6C] text-white rounded-b-[2rem] md:rounded-[3rem] md:mx-6 overflow-hidden shadow-2xl">
        
        {/* Background Image Layer */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img 
            src="/images/hero_background_1775973263788.png" 
            alt="Botanical Leaves" 
            className="w-full h-full object-cover scale-105"
          />
        </div>

        {/* Ambient Glowing Orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', filter: 'blur(50px)' }}
          />
          <motion.div
            animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #8540b0 0%, transparent 70%)', filter: 'blur(40px)' }}
          />
        </div>

        {/* Floating Botanical Micro-Icons */}
        <div className="absolute inset-0 pointer-events-none hidden md:block">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-10 left-12 text-gold-300/40"
          >
            <Sparkles size={28} />
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-12 right-16 text-gold-400/30"
          >
            <Leaf size={34} />
          </motion.div>
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
          
          {/* 👑 CENTERED GOLDEN RING LOGO & BRAND TITLE */}
          <motion.div 
            initial={{ opacity: 0, y: -15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center mb-5"
          >
            {/* Glowing Golden Ring Circular Logo */}
            <motion.div 
              whileHover={{ scale: 1.08, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-22 md:h-22 rounded-full p-1 shadow-gold mb-2.5 group cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #edc757, #D4AF37)' }}
            >
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-purple-950 bg-purple-950 relative">
                <img 
                  src="/images/logo.jpg" 
                  alt="Evans Luxe Beauty Logo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 bg-gold-400 text-purple-950 p-1 rounded-full shadow-md">
                <Sparkles size={10} strokeWidth={2.5} />
              </div>
            </motion.div>

            {/* Brand Title directly below logo */}
            <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 drop-shadow-md leading-tight">
              Evans Luxe Beauty
            </h1>
            
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-gold-300/90 mt-1">
              Organic Botanical Skincare
            </p>

            {/* Luxury Symmetrical Divider */}
            <div className="flex items-center space-x-3 mt-2.5">
              <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-gold-400/70 to-gold-300" />
              <Sparkles size={11} className="text-gold-400 animate-pulse" />
              <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent via-gold-400/70 to-gold-300" />
            </div>
          </motion.div>

          {/* Headline & Manifesto */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center"
          >
            <motion.h2 
              variants={fadeUp}
              className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.08] mb-4 text-white"
            >
              Radiant Skin,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-200">
                Naturally.
              </span>
            </motion.h2>

            <motion.p 
              variants={fadeUp}
              className="text-white/80 text-xs sm:text-sm md:text-base mb-6 leading-relaxed max-w-lg italic font-light"
            >
              100% organic botanical care — cruelty-free, chemical-free, and sustainably sourced for your most radiant self.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-row gap-3 justify-center">
              <Link 
                to="/products" 
                className="group inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 text-purple-950 px-6 py-3 rounded-full font-extrabold text-xs uppercase tracking-wider shadow-gold hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Shop Collection</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/products" 
                className="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white/90 border border-white/20 hover:bg-white/10 hover:text-white transition-all duration-300"
              >
                Explore Range
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              variants={fadeUp}
              className="flex items-center justify-center space-x-5 sm:space-x-8 mt-8 pt-5 border-t border-white/10 text-white/70"
            >
              <div className="flex items-center space-x-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                <ShieldCheck size={14} className="text-gold-400" />
                <span>100% Organic</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                <Leaf size={14} className="text-gold-400" />
                <span>Cruelty-Free</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                <Package size={14} className="text-gold-400" />
                <span>Free Shipping ₹999+</span>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          SHOP BY CATEGORY
      ══════════════════════════════════════════ */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 mt-14 md:mt-24"
      >
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500 mb-2">Browse Our Range</p>
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-purple-900">Shop by Category</h3>
          <div className="h-1 w-16 bg-gradient-to-r from-gold-400 to-amber-300 rounded-full mx-auto mt-3" />
        </div>

        <div className="flex overflow-x-auto no-scrollbar space-x-5 sm:space-x-8 pt-6 pb-8 -mx-6 px-6 md:justify-center items-start snap-x touch-pan-x">
          {dynamicCategories.length > 0 ? dynamicCategories.map((catName, idx) => {
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.84, y: 14 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-10px" }}
                whileHover={{ y: -8, scale: 1.07 }}
                whileTap={{ y: -8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18, delay: idx * 0.04 }}
                className="flex-shrink-0 snap-center"
              >
                <Link to={`/products?category=${encodeURIComponent(catName)}`} className="flex flex-col items-center group cursor-pointer select-none">
                  {/* Modern Luxury Gold Aura Ring Badge */}
                  <div className="relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 p-[2.5px] rounded-full bg-gradient-to-tr from-gold-500 via-amber-200 to-gold-400 shadow-[0_6px_20px_-4px_rgba(212,175,55,0.28)] group-hover:shadow-[0_12px_30px_-2px_rgba(212,175,55,0.55)] group-active:shadow-[0_12px_30px_-2px_rgba(212,175,55,0.55)] transition-all duration-300">
                    <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF5EC] to-[#F3E8D7] border border-white/80 flex items-center justify-center p-3 relative overflow-hidden group-hover:bg-white group-active:bg-white transition-colors duration-300">
                      {/* Subtle Ambient Gold Sheen on Hover & Mobile Tap */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-gold-400/25 via-transparent to-white/40 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 rounded-full" />
                      <CategoryIcon category={catName} className="w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 relative z-10 transition-transform duration-300 group-hover:scale-110 group-active:scale-110 group-hover:-rotate-1 group-active:-rotate-1" />
                    </div>
                  </div>
                  {/* Category Name: Clean 2-line Wrapping */}
                  <span className="text-[10px] sm:text-[11px] md:text-xs font-bold text-purple-950 mt-3 group-hover:text-gold-600 group-active:text-gold-600 transition-colors uppercase tracking-wider text-center w-22 sm:w-26 md:w-28 leading-snug line-clamp-2 min-h-[2.4rem] flex items-center justify-center">
                    {catName}
                  </span>
                </Link>
              </motion.div>
            )
          }) : (
            [...Array(6)].map((_, i) => <CategorySkeleton key={i} />)
          )}
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
        className="px-6 md:px-16 mt-14 md:mt-24"
      >
        <div className="bg-gradient-to-br from-[#3e1d4a] via-[#5A2A6C] to-[#8540b0] rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-14 flex flex-col md:flex-row items-center justify-between text-white shadow-2xl relative overflow-hidden">
          {/* Ambient light blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0 max-w-lg">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] bg-gold-400/20 text-gold-300 mb-4 border border-gold-400/30">
              <Sparkles size={12} />
              <span>Our Promise</span>
            </span>
            <h4 className="font-serif font-bold text-white text-3xl md:text-4xl mb-3 leading-tight">100% Organic Botanical Care</h4>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">Cruelty-free, chemical-free, and sustainably sourced for your most radiant, healthier skin.</p>
          </div>

          <div className="flex space-x-6 md:space-x-10 relative z-10">
             <div className="flex flex-col items-center">
               <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md mb-2">
                 <ShieldCheck size={30} className="text-gold-300" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-gold-300">Verified</span>
             </div>
             <div className="flex flex-col items-center">
               <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md mb-2">
                 <Leaf size={30} className="text-gold-300" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-gold-300">Organic</span>
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
        className="px-6 md:px-16 mt-16 md:mt-24 mb-12"
      >
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500 mb-1">Customer Favorites</p>
            <h3 className="font-serif text-3xl font-bold text-purple-900">Our Best Sellers</h3>
            <div className="h-1 w-12 bg-gold-400 rounded-full mt-2" />
          </div>
          <Link to="/products?category=All" className="group flex items-center space-x-2 text-purple-700 text-sm font-bold hover:text-purple-900 transition-colors">
            <span>View All</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {bestSellers.length > 0 ? bestSellers.map((product, idx) => (
            <motion.div
              key={product.id}
              className={`${idx >= 4 ? 'hidden md:block' : 'block'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          )) : (
            [...Array(8)].map((_, i) => (
              <div key={i} className={`${i >= 4 ? 'hidden md:block' : 'block'}`}>
                <ProductSkeleton />
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <div className="px-6 md:px-16 mt-20 mb-12">
        <div className="text-center mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500 mb-2">Community</p>
          <h3 className="font-serif text-3xl md:text-5xl font-bold text-purple-900 mb-4">Loved by You</h3>
          <p className="text-gray-500 text-sm md:text-lg max-w-xl mx-auto italic">"Inspired by nature, perfected by science. Join our botanical community."</p>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar space-x-6 pb-6 -mx-6 px-6 md:grid md:grid-cols-3 md:gap-8 md:space-x-0 md:mx-0">
          {[
            { name: "Sarah J.", text: "The Lavender Serenity soap has completely transformed my evening routine. The scent is heavenly.", role: "Verified Buyer" },
            { name: "Priya K.", text: "This Vitamin C Serum is a game-changer! My skin has never looked more radiant and smooth.", role: "Verified Buyer" },
            { name: "Michael R.", text: "Finally, a sunscreen that doesn't leave a white cast. The Mineral Bloom is now my daily staple.", role: "Verified Buyer" }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="flex-shrink-0 w-[300px] md:w-full bg-white p-8 md:p-10 rounded-[2.5rem] shadow-luxury border border-purple-50 flex flex-col justify-between hover:shadow-gold transition-all duration-500 relative"
            >
              <div>
                <div className="flex text-gold-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star key={i} size={16} fill="#D4AF37" className="text-gold-400" />
                  ))}
                </div>
                <p className="text-gray-700 italic text-sm md:text-base leading-relaxed mb-8">"{item.text}"</p>
              </div>
              <div className="flex items-center space-x-4 pt-4 border-t border-purple-50">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-900 to-purple-700 rounded-2xl flex items-center justify-center text-gold-300 font-serif font-bold text-lg shadow-sm">
                  {item.name[0]}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-purple-900 whitespace-nowrap truncate">{item.name}</h5>
                  <p className="text-[10px] text-purple-600 uppercase tracking-widest font-bold">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;

