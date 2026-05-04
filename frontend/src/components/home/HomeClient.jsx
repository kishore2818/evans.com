'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Droplet } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import * as Icons from 'lucide-react';

const HomeClient = ({ initialProducts = [] }) => {
  // Use server-side data as initial state, but allow client-side updates if needed
  const [products, setProducts] = React.useState(initialProducts);
  
  // Parallax setup
  const { scrollY } = useScroll();
  const heroBackgroundY = useTransform(scrollY, [0, 1000], [0, 250]);
  const promoElementY = useTransform(scrollY, [500, 1500], [50, -50]);
  
  const bestSellers = [...products]
    .sort((a, b) => (b.ratings?.count || 0) - (a.ratings?.count || 0))
    .slice(0, 6);

  const dynamicCategories = [...new Set(products.map(p => p.category))].slice(0, 5);

  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      boxShadow: [
        "0px 0px 0px 0px rgba(168, 85, 247, 0.4)",
        "0px 0px 20px 5px rgba(168, 85, 247, 0.2)",
        "0px 0px 0px 0px rgba(168, 85, 247, 0.4)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="pb-8">
      {/* Hero Section */}
      <div className="relative py-12 md:py-16 px-6 md:px-16 bg-purple-900 text-white rounded-b-[2.5rem] md:rounded-[3rem] md:mx-6 overflow-hidden shadow-2xl">
        <motion.div 
          className="absolute inset-0 opacity-30 mix-blend-overlay origin-top"
          style={{ y: heroBackgroundY, scale: 1.15 }}
        >
          <Image
            src="/images/hero_background_1775973263788.png"
            alt="Botanical background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </motion.div>

        {/* Floating engaging particles */}
        <motion.div variants={floatingVariants} animate="animate" className="absolute top-[20%] left-[15%] text-gold-300/60 hidden md:block z-0">
          <Sparkles size={40} />
        </motion.div>
        <motion.div variants={floatingVariants} animate="animate" transition={{ delay: 1 }} className="absolute bottom-[30%] right-[10%] text-gold-400/50 hidden md:block z-0">
          <Leaf size={48} />
        </motion.div>
        <motion.div variants={floatingVariants} animate="animate" transition={{ delay: 0.5 }} className="absolute top-[40%] right-[20%] text-white/30 hidden md:block z-0">
          <Droplet size={32} />
        </motion.div>
        
        <div className="relative z-10 md:flex md:flex-col md:items-center md:text-center">
          <div className="flex justify-between items-center mb-10 md:hidden">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 shadow-2xl">
                <Image src="/images/logo.jpg" alt="Logo" fill sizes="48px" className="object-cover" priority />
              </div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-white leading-tight whitespace-nowrap">
                Evans Luxe Beauty
              </h1>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex flex-col items-center mb-8"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl mb-4 relative">
              <Image src="/images/logo.jpg" alt="Logo" fill sizes="80px" className="object-cover" priority />
            </div>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-300/50 to-transparent"></div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-[280px] md:max-w-2xl"
          >
            <p className="text-gold-300 text-[10px] md:text-sm font-semibold tracking-[0.3em] uppercase mb-4 md:mb-5">Botanical Manifesto</p>
            <h2 className="font-serif text-[clamp(28px,8vw,72px)] leading-[1.1] mb-6 md:mb-8 text-white">Radiant Skin,<br className="md:hidden"/>Naturally.</h2>
            <Link 
              href="/products" 
              className="w-full md:w-auto inline-flex items-center justify-center space-x-2 bg-gold-400 text-purple-900 px-8 py-4 md:py-3 rounded-full font-bold text-sm hover:bg-gold-300 transition-colors shadow-luxury min-h-[48px]"
            >
              <span>Shop Collection</span>
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="px-6 mt-12 md:mt-20"
      >
        <h3 className="font-serif text-2xl md:text-3xl font-bold mb-6 text-center">Shop by Category</h3>
        <div className="flex overflow-x-auto no-scrollbar space-x-6 pb-6 -mx-6 px-6 md:justify-center">
          {dynamicCategories.map((catName, idx) => {
            const Icon = Leaf;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="flex-shrink-0"
              >
                <Link href={`/products?category=${catName}`} className="flex flex-col items-center group">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-white shadow- luxury flex items-center justify-center text-purple-700 bg-opacity-80 backdrop-blur-md border border-purple-50 group-hover:bg-purple-900 group-hover:text-white transition-all duration-500">
                    <Icon size={32} strokeWidth={1.2} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 mt-3 group-hover:text-purple-900 transition-colors uppercase tracking-wider">{catName}</span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Promo Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="px-6 md:px-16 mt-12 md:mt-20"
      >
        <div className="bg-gradient-to-br from-purple-50 to-gold-50 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between border border-purple-100/50 shadow-sm relative overflow-hidden">
          <motion.div 
            className="absolute top-0 right-0 w-32 h-32 bg-gold-200/20 rounded-full blur-3xl"
            style={{ y: promoElementY }}
          ></motion.div>
          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
            <h4 className="font-serif font-bold text-purple-900 text-2xl md:text-3xl mb-2">100% Organic Botanical Care</h4>
            <p className="text-sm md:text-base text-purple-800/70 max-w-md">Cruelty-free, chemical-free, and sustainably sourced for your most radiant self.</p>
          </div>
          <div className="flex space-x-6 md:space-x-10 relative z-10">
             <div className="flex flex-col items-center">
               <motion.div variants={pulseVariants} animate="animate" className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-2">
                 <ShieldCheck size={32} className="text-purple-600" />
               </motion.div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-purple-900/60">Verified</span>
             </div>
             <div className="flex flex-col items-center">
               <motion.div variants={pulseVariants} animate="animate" transition={{ delay: 1 }} className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-2">
                 <Leaf size={32} className="text-purple-600" />
               </motion.div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-purple-900/60">Organic</span>
             </div>
          </div>
        </div>
      </motion.div>

      {/* Testimonials */}
      <div className="px-6 md:px-16 mt-20 mb-12">
        <div className="text-center mb-12">
          <h3 className="font-serif text-3xl md:text-5xl font-bold mb-4">Loved by You</h3>
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
              whileHover={{ scale: 1.02, y: -5 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              className="flex-shrink-0 w-[300px] md:w-full bg-white p-8 rounded-[2.5rem] shadow-luxury border border-beige-100 flex flex-col justify-between hover:shadow-2xl transition-all cursor-pointer min-h-[350px] md:min-h-0"
            >
              <div className="text-center">
                <div className="flex justify-center text-gold-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-800 italic text-base md:text-lg leading-relaxed mb-8">"{item.text}"</p>
              </div>
              <div className="flex items-center justify-center space-x-4 border-t border-beige-100 pt-6">
                <div className="w-12 h-12 bg-purple-900 rounded-full flex items-center justify-center text-gold-300 font-bold text-lg shadow-md flex-shrink-0">
                  {item.name[0]}
                </div>
                <div className="text-left overflow-hidden">
                  <h5 className="text-sm font-bold text-gray-900 whitespace-nowrap">{item.name}</h5>
                  <p className="text-[10px] text-purple-600 uppercase tracking-widest font-bold whitespace-nowrap">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="px-6 md:px-16 mt-16 mb-12"
      >
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="font-serif text-3xl font-bold mb-1">Our Best Sellers</h3>
            <p className="text-xs text-gray-500 font-medium">Top picks from the botanical garden</p>
          </div>
          <Link href="/products?category=All" className="group flex items-center space-x-1 text-purple-700 text-sm font-bold hover:text-purple-900 transition-colors">
            <span>View All</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8">
          {bestSellers.map((product, idx) => (
            <motion.div
              key={product.id}
              className={`${idx >= 4 ? 'hidden md:block' : 'block'}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomeClient;
