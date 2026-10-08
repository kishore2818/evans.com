'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, Search, X, Sparkles, Droplets, RefreshCw, SortDesc } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { ProductsGridSkeleton } from '@/components/ProductCardSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { skinTypeOptions, skinConcernOptions } from '@/data/products';

const ProductsClient = ({ initialProducts = [] }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get("category") || "All";
  
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkinType, setSelectedSkinType] = useState("All");
  const [selectedSkinConcern, setSelectedSkinConcern] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState(initialProducts);
  const [isHydrated, setIsHydrated] = useState(false);

  // On mount: set products directly from SSR data
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
    }
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

  const clearAllFilters = () => {
    setActiveCategory("All");
    setSelectedSkinType("All");
    setSelectedSkinConcern("All");
    setSearchQuery("");
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    router.push(`/products`, { scroll: false });
  };

  const activeFiltersCount = (activeCategory !== "All" ? 1 : 0) +
    (selectedSkinType !== "All" ? 1 : 0) +
    (selectedSkinConcern !== "All" ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0);

  const filteredProducts = useMemo(() => {
    const base = products.filter(p => {
      const matchesCategory = activeCategory === "All" || p.category === activeCategory;
      const matchesSearch = !searchQuery.trim() ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSkinType = selectedSkinType === "All" ||
        !p.skinTypes || p.skinTypes.includes("All Skin Types") || p.skinTypes.includes(selectedSkinType);

      const matchesSkinConcern = selectedSkinConcern === "All" ||
        !p.skinConcerns || p.skinConcerns.includes(selectedSkinConcern);

      return matchesCategory && matchesSearch && matchesSkinType && matchesSkinConcern;
    });

    // Sort
    switch (sortBy) {
      case 'price-asc':
        return [...base].sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-desc':
        return [...base].sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'rating':
        return [...base].sort((a, b) => (b.rating || b.ratings?.average || 0) - (a.rating || a.ratings?.average || 0));
      case 'bestselling':
        return [...base].sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
      case 'newest':
      default:
        return [...base].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
  }, [products, activeCategory, searchQuery, selectedSkinType, selectedSkinConcern, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        // Cap stagger so 20+ product grids don't take forever to animate
        staggerChildren: Math.min(0.08, 1.2 / Math.max(filteredProducts.length, 1))
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low → High' },
    { value: 'price-desc', label: 'Price: High → Low' },
    { value: 'rating', label: 'Best Rated' },
    { value: 'bestselling', label: 'Best Selling' },
  ];

  return (
    <div className="px-3.5 sm:px-6 md:px-12 pt-1 sm:pt-4 md:pt-6 pb-12 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-end mb-4 sm:mb-6 md:mb-10"
      >
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-600 block mb-0.5 sm:mb-1">
            Botanical Formulations
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-purple-950">Apothecary Collection</h1>
          <p className="text-xs text-gray-400 mt-0.5 sm:mt-1 font-medium">
            Showing <strong className="text-purple-900">{filteredProducts.length}</strong>{' '}
            of <strong className="text-purple-900">{products.length}</strong> formulations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <div className="relative hidden sm:block">
            <SortDesc size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-8 pr-3 py-2 rounded-full text-xs font-semibold bg-white border border-beige-200 text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer shadow-sm appearance-none"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowFilters(v => !v)}
            aria-label="Toggle filters"
            className={`flex items-center justify-center sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full text-xs font-bold transition-all shadow-sm border flex-shrink-0 whitespace-nowrap ${
              showFilters || activeFiltersCount > 0
                ? 'bg-purple-900 text-gold-300 border-purple-900'
                : 'bg-white text-purple-900 border-beige-200 hover:bg-purple-50'
            }`}
          >
            <Filter size={14} />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 sm:ml-0 w-4 h-4 rounded-full bg-gold-400 text-purple-950 flex items-center justify-center font-black text-[9px]">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="relative mb-6"
      >
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search size={18} className="text-purple-400" />
        </div>
        <input 
          type="text" 
          placeholder="Search by botanical, skin benefit, or ingredient..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-beige-200 text-sm rounded-full py-3.5 pl-11 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-purple-900"
          >
            <X size={16} />
          </button>
        )}
      </motion.div>

      {/* Category Pills — full names, horizontally scrollable */}
      <div
        className="flex overflow-x-auto no-scrollbar gap-2 pb-2 mb-4"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <button 
          onClick={() => handleCategoryChange("All")}
          className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm
            ${activeCategory === "All" 
              ? 'bg-purple-900 text-white shadow-purple-950/20' 
              : 'bg-white text-gray-700 border border-beige-200 hover:border-purple-300'}`}
        >
          All Categories
        </button>
        {[...new Set(products.map(p => p.category))].filter(Boolean).map((catName) => (
          <button 
            key={catName}
            onClick={() => handleCategoryChange(catName)}
            className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm
              ${activeCategory === catName 
                ? 'bg-purple-900 text-white shadow-purple-950/20' 
                : 'bg-white text-gray-700 border border-beige-200 hover:border-purple-300'}`}
          >
            {catName}
          </button>
        ))}
      </div>

      {/* ── Collapsible Beauty Filters Panel (Skin Type + Skin Concern) ── */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-8"
          >
            <div className="p-5 rounded-3xl bg-cream-50/90 border border-purple-100 shadow-sm space-y-4">
              {/* Skin Types Filter */}
              <div>
                <div className="flex items-center space-x-1.5 mb-2.5 text-xs font-bold text-purple-950">
                  <Sparkles size={14} className="text-gold-500" />
                  <span>Filter by Skin Type</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["All", ...skinTypeOptions].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedSkinType(type)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        selectedSkinType === type
                          ? 'bg-purple-900 text-white font-bold shadow-sm'
                          : 'bg-white text-gray-600 border border-beige-200 hover:border-purple-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Concerns Filter */}
              <div className="pt-2 border-t border-beige-200/60">
                <div className="flex items-center space-x-1.5 mb-2.5 text-xs font-bold text-purple-950">
                  <Droplets size={14} className="text-purple-600" />
                  <span>Filter by Skin Concern</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["All", ...skinConcernOptions].map((concern) => (
                    <button
                      key={concern}
                      onClick={() => setSelectedSkinConcern(concern)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        selectedSkinConcern === concern
                          ? 'bg-purple-900 text-white font-bold shadow-sm'
                          : 'bg-white text-gray-600 border border-beige-200 hover:border-purple-300'
                      }`}
                    >
                      {concern}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear filters row */}
              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">
                  Showing <strong className="text-purple-950">{filteredProducts.length}</strong> formulations
                </span>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-purple-700 hover:text-purple-950 font-bold flex items-center space-x-1"
                  >
                    <RefreshCw size={12} />
                    <span>Reset All Filters</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Chips */}
      {activeFiltersCount > 0 && !showFilters && (
        <div className="flex items-center gap-2 mb-6 flex-wrap text-xs">
          <span className="text-gray-400 font-medium">Active:</span>
          {activeCategory !== "All" && (
            <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 font-bold flex items-center space-x-1">
              <span>{activeCategory}</span>
              <button onClick={() => handleCategoryChange("All")}><X size={12} /></button>
            </span>
          )}
          {selectedSkinType !== "All" && (
            <span className="px-2.5 py-1 rounded-full bg-gold-100 text-gold-900 font-bold flex items-center space-x-1">
              <span>Type: {selectedSkinType}</span>
              <button onClick={() => setSelectedSkinType("All")}><X size={12} /></button>
            </span>
          )}
          {selectedSkinConcern !== "All" && (
            <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 font-bold flex items-center space-x-1">
              <span>Concern: {selectedSkinConcern}</span>
              <button onClick={() => setSelectedSkinConcern("All")}><X size={12} /></button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-xs text-purple-700 underline font-semibold ml-1"
          >
            Clear
          </button>
        </div>
      )}

      {/* Product Grid */}
      {!isHydrated ? (
        <ProductsGridSkeleton count={6} />
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${activeCategory}-${selectedSkinType}-${selectedSkinConcern}-${searchQuery}-${sortBy}`} 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6"
        >
          {filteredProducts.length > 0 ? filteredProducts.map((product, idx) => (
            <motion.div key={product.id || product._id} variants={itemVariants}>
              <ProductCard product={product} priority={idx < 4} />
            </motion.div>
          )) : (
            <div className="col-span-full py-16 text-center text-gray-500 font-serif space-y-3">
              <p className="text-base font-bold text-purple-950">No matching botanical formulations found.</p>
              <p className="text-xs text-gray-400">Try adjusting your skin type, concern, or search keyword.</p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2 rounded-full bg-purple-900 text-white font-bold text-xs uppercase tracking-wider shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ProductsClient;
