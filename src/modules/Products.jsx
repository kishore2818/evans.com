import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from '@/router-shim';
import { Filter, Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/skeletons/ProductSkeleton';
import { motion } from 'framer-motion';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        const data = await response.json();
        // Map database fields to frontend structure expectations
        const formattedData = data.map(p => ({
          ...p,
          id: p._id,
          image: p.images && p.images.length > 0 ? p.images[0] : '/images/mineral_sunscreen_1775973350994.png',
          rating: p.ratings?.average || 5,
          reviews: p.ratings?.count || 0
        }));
        setProducts(formattedData);
      } catch (error) {
        console.error("Failed to load products");
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
    <div className="px-6 md:px-12 pt-12 md:pt-16 pb-12">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-center mb-6 md:mb-10"
      >
        <h1 className="font-serif text-3xl font-bold">Collection</h1>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-900 border border-beige-200 hover:bg-purple-50 transition-colors">
          <Filter size={20} />
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

      {/* Category Pills */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex overflow-x-auto no-scrollbar space-x-2 -mx-6 px-6 mb-8"
      >
        <button 
          onClick={() => handleCategoryChange("All")}
          className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm
            ${activeCategory === "All" 
              ? 'bg-purple-900 text-white' 
              : 'bg-white text-gray-600 border border-beige-200 hover:border-purple-300'}`}
        >
          All
        </button>
        {[...new Set(products.map(p => p.category))].map((catName) => (
          <button 
            key={catName}
            onClick={() => handleCategoryChange(catName)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm
              ${activeCategory === catName 
                ? 'bg-purple-900 text-white' 
                : 'bg-white text-gray-600 border border-beige-200 hover:border-purple-300'}`}
          >
            {catName}
          </button>
        ))}
      </motion.div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {[...Array(10)].map((_, i) => <ProductSkeleton key={i} />)}
        </div>
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

export default Products;
