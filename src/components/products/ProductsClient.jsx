'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, Search } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { ProductsGridSkeleton } from '@/components/ProductCardSkeleton';
import { motion } from 'framer-motion';

const CACHE_KEY = 'evans_products_cache';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCachedProducts() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp < CACHE_TTL) return data;
  } catch {}
  return null;
}

function setCachedProducts(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {}
}

const ProductsClient = ({ initialProducts = [] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category") || "All";
  
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState(initialProducts);
  const [isHydrated, setIsHydrated] = useState(false);

  // On mount: set products directly from SSR data to avoid stale cache issues
  useEffect(() => {
    setProducts(initialProducts);
    setIsHydrated(true);
  }, [initialProducts]);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  const handleCategoryChange = (catName) => {
    setActiveCategory(catName);
    const params = new URLSearchParams(searchParams);
    if (catName === "All") {
      params.delete("category");
    } else {
      params.set("category", catName);
    }
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="px-4 md:px-12 pt-4 md:pt-6 pb-12">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-center mb-6 md:mb-10"
      >
        <h1 className="font-serif text-3xl font-bold">Collection</h1>
        <button className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-900 border border-beige-200 hover:bg-purple-50 transition-colors min-h-[40px] min-w-[40px] md:min-h-[48px] md:min-w-[48px] active:scale-90">
          <Filter size={18} className="md:w-5 md:h-5" />
        </button>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative mb-6"
      >
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search botanicals..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-beige-200 text-sm rounded-full py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all shadow-sm"
        />
      </motion.div>

      {/* Category Pills — full names, horizontally scrollable */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex overflow-x-auto no-scrollbar gap-2 pb-2 mb-8"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <button 
          onClick={() => handleCategoryChange("All")}
          className={`flex-shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm min-h-[44px] flex items-center
            ${activeCategory === "All" 
              ? 'bg-purple-900 text-white shadow-purple-200' 
              : 'bg-white text-gray-600 border border-beige-200 hover:border-purple-300 hover:text-purple-700'}`}
        >
          All
        </button>
        {[...new Set(products.map(p => p.category))].filter(Boolean).map((catName) => (
          <button 
            key={catName}
            onClick={() => handleCategoryChange(catName)}
            className={`flex-shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm min-h-[44px] flex items-center
              ${activeCategory === catName 
                ? 'bg-purple-900 text-white shadow-purple-200' 
                : 'bg-white text-gray-600 border border-beige-200 hover:border-purple-300 hover:text-purple-700'}`}
          >
            {catName}
          </button>
        ))}
      </motion.div>

      {/* Product Grid */}
      {!isHydrated ? (
        <ProductsGridSkeleton count={6} />
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeCategory + searchQuery} 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
        >
          {filteredProducts.length > 0 ? filteredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          )) : (
            <div className="col-span-full py-12 text-center text-gray-500 font-serif">
              No products found matching your criteria.
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProductsClient;
