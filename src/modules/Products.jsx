"use client";

import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from '@/router-shim';
import { Filter, Search, X, Sparkles, Droplets, Check, RefreshCw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/skeletons/ProductSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { products as defaultMockProducts, skinTypeOptions, skinConcernOptions } from '../data/products';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkinType, setSelectedSkinType] = useState("All");
  const [selectedSkinConcern, setSelectedSkinConcern] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState(defaultMockProducts);
  const [loading, setLoading] = useState(true);

  // Fetch real data from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const formattedData = data.map(p => ({
              ...p,
              id: p._id,
              image: p.images && p.images.length > 0 ? p.images[0] : (p.image || '/images/mineral_sunscreen_1775973350994.png'),
              rating: p.ratings?.average || p.rating || 5,
              reviews: p.ratings?.count || p.reviews?.length || p.reviews || 0
            }));
            setProducts(formattedData);
          }
        }
      } catch (error) {
        console.warn("Using local product catalog");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Synchronize state when URL parameter changes
  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  const handleCategoryChange = (catName) => {
    setActiveCategory(catName);
    setSearchParams({ category: catName });
  };

  const clearAllFilters = () => {
    setActiveCategory("All");
    setSelectedSkinType("All");
    setSelectedSkinConcern("All");
    setSearchQuery("");
    setSearchParams({ category: "All" });
  };

  const activeFiltersCount = (activeCategory !== "All" ? 1 : 0) +
    (selectedSkinType !== "All" ? 1 : 0) +
    (selectedSkinConcern !== "All" ? 1 : 0) +
    (searchQuery.trim() !== "" ? 1 : 0);

  const filteredProducts = products.filter(p => {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="px-4 sm:px-6 md:px-12 pt-8 md:pt-14 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-end mb-6 md:mb-8"
      >
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold-600 block mb-1">
            Botanical Formulations
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-purple-950">Apothecary Collection</h1>
        </div>

        <button
          onClick={() => setShowFilters(v => !v)}
          aria-label="Toggle filters"
          className={`flex items-center justify-center sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs font-bold transition-all shadow-sm border flex-shrink-0 whitespace-nowrap ${
            showFilters || activeFiltersCount > 0
              ? 'bg-purple-900 text-gold-300 border-purple-900'
              : 'bg-white text-purple-900 border-beige-200 hover:bg-purple-50'
          }`}
        >
          <Filter size={15} />
          <span className="hidden sm:inline">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 sm:ml-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gold-400 text-purple-950 flex items-center justify-center font-black text-[9px] sm:text-[10px]">
              {activeFiltersCount}
            </span>
          )}
        </button>
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

      {/* Categories Horizontal Carousel */}
      <div className="flex overflow-x-auto no-scrollbar space-x-2 -mx-4 px-4 sm:mx-0 sm:px-0 mb-4 pb-2">
        <button 
          onClick={() => handleCategoryChange("All")}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm
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
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm
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

      {/* Active Filter Chips indicator */}
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
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${activeCategory}-${selectedSkinType}-${selectedSkinConcern}-${searchQuery}`} 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6"
        >
          {filteredProducts.length > 0 ? filteredProducts.map((product) => (
            <motion.div key={product.id || product._id} variants={itemVariants}>
              <ProductCard product={product} />
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

export default Products;
