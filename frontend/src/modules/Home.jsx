import API_BASE_URL from '@/config/api';
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Leaf, Droplet } from 'lucide-react';
import { Link } from '@/router-shim';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/skeletons/ProductSkeleton';
import CategorySkeleton from '../components/skeletons/CategorySkeleton';
import * as Icons from 'lucide-react';

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
        setBestSellers(sorted.slice(0, 4));

        // Compute unique categories
        const unq = [...new Set(formattedData.map(p => p.category))];
        setDynamicCategories(unq.slice(0, 5)); // Just take top 5 for the home map
      } catch (error) {
        console.error("Failed to load products for home page");
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="pb-8">
      {/* Hero Section */}
      <div className="relative py-12 md:py-16 px-6 md:px-16 bg-purple-900 text-white rounded-b-[2.5rem] md:rounded-[3rem] md:mx-6 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay">
          <img 
            src="/images/hero_background_1775973263788.png" 
            alt="Leaves" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 md:flex md:flex-col md:items-center md:text-center">
          {/* Mobile Logo & Title */}
          <div className="flex justify-between items-center mb-10 md:hidden">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shadow-2xl">
                <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="font-serif text-2xl font-bold tracking-tight text-white leading-tight whitespace-nowrap">
                Evans Luxe Beauty
              </h1>
            </div>
          </div>

          {/* Desktop Logo Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden md:flex flex-col items-center mb-8"
          >
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl mb-4">
              <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold-300/50 to-transparent"></div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-[280px] md:max-w-2xl"
          >
            <p className="text-gold-300 text-[10px] md:text-sm font-semibold tracking-[0.3em] uppercase mb-4 md:mb-5">Botanical Manifesto</p>
            <h2 className="font-serif text-3xl sm:text-5xl md:text-7xl leading-[1.1] mb-6 md:mb-8 text-white">Radiant Skin,<br className="md:hidden"/>Naturally.</h2>
            <Link to="/products" className="inline-flex items-center space-x-2 bg-gold-400 text-purple-900 px-6 py-3 rounded-full font-semibold text-sm hover:bg-gold-300 transition-colors">
              <span>Shop Collection</span>
              <ArrowRight size={16} />
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
          {dynamicCategories.length > 0 ? dynamicCategories.map((catName, idx) => {
            const Icon = Leaf; // Fallback to leaf since categories are dynamic now
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="flex-shrink-0"
              >
                <Link to={`/products?category=${catName}`} className="flex flex-col items-center group">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2rem] bg-white shadow- luxury flex items-center justify-center text-purple-700 bg-opacity-80 backdrop-blur-md border border-purple-50 group-hover:bg-purple-900 group-hover:text-white transition-all duration-500">
                    <Icon size={32} strokeWidth={1.2} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 mt-3 group-hover:text-purple-900 transition-colors uppercase tracking-wider">{catName}</span>
                </Link>
              </motion.div>
            )
          }) : (
            [...Array(5)].map((_, i) => <CategorySkeleton key={i} />)
          )}
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
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-200/20 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
            <h4 className="font-serif font-bold text-purple-900 text-2xl md:text-3xl mb-2">100% Organic Botanical Care</h4>
            <p className="text-sm md:text-base text-purple-800/70 max-w-md">Cruelty-free, chemical-free, and sustainably sourced for your most radiant self.</p>
          </div>
          <div className="flex space-x-6 md:space-x-10 relative z-10">
             <div className="flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-2">
                 <ShieldCheck size={32} className="text-purple-600" />
               </div>
               <span className="text-[10px] font-bold uppercase tracking-widest text-purple-900/60">Verified</span>
             </div>
             <div className="flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm mb-2">
                 <Leaf size={32} className="text-purple-600" />
               </div>
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
        
        <div className="flex overflow-x-auto no-scrollbar space-x-6 pb-6 -mx-6 px-6 md:grid md:grid-cols-3 md:gap-10 md:space-x-0 md:mx-0">
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
              className="flex-shrink-0 w-[300px] md:w-full bg-white p-10 rounded-[3rem] shadow-card border border-beige-100 flex flex-col justify-between hover:shadow-luxury transition-all duration-500"
            >
              <div>
                <div className="flex text-gold-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Icons.Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-700 italic text-sm md:text-base leading-relaxed mb-8">"{item.text}"</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-900 rounded-2xl flex items-center justify-center text-gold-300 font-bold text-lg shadow-sm">
                  {item.name[0]}
                </div>
                <div>
                  <h5 className="text-sm font-bold text-gray-900 whitespace-nowrap truncate">{item.name}</h5>
                  <p className="text-[10px] text-purple-600 uppercase tracking-widest font-bold">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Best Sellers Status */}
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
          <Link to="/products?category=All" className="group flex items-center space-x-1 text-purple-700 text-sm font-bold hover:text-purple-900 transition-colors">
            <span>View All</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
          {bestSellers.length > 0 ? bestSellers.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          )) : (
            [...Array(4)].map((_, i) => <ProductSkeleton key={i} />)
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
