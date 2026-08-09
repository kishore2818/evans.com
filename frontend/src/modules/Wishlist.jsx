'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, ArrowRight, ShoppingCart, Sparkles, ChevronLeft, Star, Package } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';

/* ── Wishlist Item Card ── */
const WishlistCard = ({ product, onRemove, onAddToCart }) => {
  const [removing, setRemoving] = useState(false);

  const discountedPrice = product.discountPercentage > 0
    ? product.price - (product.price * (product.discountPercentage / 100))
    : product.price;

  const productId = product._id || product.id;
  const isOutOfStock = product.stock === 0;

  const handleRemove = () => {
    setRemoving(true);
    setTimeout(() => onRemove(productId), 300);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: removing ? 0 : 1, scale: removing ? 0.88 : 1, y: removing ? -10 : 0 }}
      exit={{ opacity: 0, scale: 0.88, y: -10, transition: { duration: 0.25 } }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative bg-white rounded-[2rem] overflow-hidden border border-beige-100/60 group"
      style={{ boxShadow: '0 4px 20px rgba(90,42,108,0.09)' }}
    >
      {/* Product Image */}
      <Link href={`/products/${productId}`} className="block relative aspect-square overflow-hidden bg-beige-50">
        <Image
          src={product.images?.[0] || product.image || '/images/placeholder.png'}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          unoptimized
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOutOfStock && (
            <div className="text-[9px] font-black px-2.5 py-1 rounded-full text-white backdrop-blur-md shadow-sm"
              style={{ background: 'rgba(220,38,38,0.9)' }}>
              Out of Stock
            </div>
          )}
          {product.discountPercentage > 0 && (
            <div className="text-[9px] font-black px-2 py-1 rounded-full text-white backdrop-blur-md shadow-sm"
              style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              -{product.discountPercentage}%
            </div>
          )}
        </div>

        {/* Remove button (top right) */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.preventDefault(); handleRemove(); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md z-10 min-h-0 min-w-0 transition-all opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
          title="Remove from wishlist"
        >
          <Trash2 size={13} className="text-red-400" />
        </motion.button>
      </Link>

      {/* Card Body */}
      <div className="p-3.5">
        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center space-x-1 mb-1.5">
            <div className="flex space-x-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={9}
                  fill={i <= Math.round(product.rating || 0) ? '#D4AF37' : 'transparent'}
                  className={i <= Math.round(product.rating || 0) ? 'text-gold-400' : 'text-gray-200'} />
              ))}
            </div>
            <span className="text-[9px] text-gray-400 font-bold">({product.reviewsCount || 0})</span>
          </div>
        )}

        <h3 className="font-serif font-bold text-purple-900 text-[14px] leading-tight line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <span className="font-sans font-extrabold text-sm text-purple-900">
              ₹{discountedPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-[10px] text-gray-400 line-through ml-1">
                ₹{product.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
            )}
          </div>
        </div>

        {/* Add to cart button */}
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onAddToCart(product)}
          disabled={isOutOfStock}
          className="w-full py-2.5 rounded-xl flex items-center justify-center space-x-2 font-black text-[10px] uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed min-h-0"
          style={isOutOfStock ? {
            background: '#f5f0f9',
            color: '#9ca3af',
          } : {
            background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)',
            color: '#D4AF37',
            boxShadow: '0 4px 16px rgba(62,29,74,0.28)',
          }}
        >
          <ShoppingBag size={13} strokeWidth={2.5} />
          <span>{isOutOfStock ? 'Out of Stock' : 'Add to Cart'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

/* ── Main Wishlist Page ── */
const Wishlist = () => {
  const router = useRouter();
  const { token } = useAuthStore();
  const localWishlist = useStore(s => s.localWishlist);
  const removeFromLocalWishlist = useStore(s => s.removeFromLocalWishlist);
  const addToCart = useStore(s => s.addToCart);
  const addAllWishlistToCart = useStore(s => s.addAllWishlistToCart);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleAddAll = () => {
    const inStock = localWishlist.filter(p => (p.stock ?? 1) > 0);
    if (inStock.length === 0) {
      toast.error('All wishlisted items are out of stock');
      return;
    }
    addAllWishlistToCart();
    toast.success(`${inStock.length} item${inStock.length > 1 ? 's' : ''} added to cart!`);
  };

  const isEmpty = localWishlist.length === 0;
  const inStockCount = localWishlist.filter(p => (p.stock ?? 1) > 0).length;

  return (
    <div className="px-4 md:px-12 pt-6 pb-28 md:pb-12 max-w-5xl mx-auto">

      {/* ── Header ── */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-purple-500 hover:text-purple-900 font-semibold mb-6 transition-all hover:-translate-x-1 min-h-0 min-w-0 text-sm"
        >
          <ChevronLeft size={18} />
          <span>Back</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Heart size={22} fill="#ef4444" className="text-red-500" />
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-purple-900">My Wishlist</h1>
            </div>
            <p className="text-gray-400 text-sm font-medium">
              {isEmpty
                ? 'Tap the ♥ on any product to save it here'
                : `${localWishlist.length} saved item${localWishlist.length > 1 ? 's' : ''} · ${inStockCount} available`}
            </p>
          </div>

          {/* Add All to Cart */}
          <AnimatePresence>
            {!isEmpty && inStockCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAddAll}
                className="flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-luxury min-h-0 flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37, #edc757)',
                  color: '#1a0a22',
                  boxShadow: '0 6px 24px rgba(212,175,55,0.4)',
                }}
              >
                <ShoppingCart size={16} />
                <span>Add All to Cart ({inStockCount})</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Gold divider */}
        {!isEmpty && (
          <div className="mt-5 h-px w-full"
            style={{ background: 'linear-gradient(to right, #D4AF37, rgba(212,175,55,0.1))' }} />
        )}
      </div>

      {/* ── Empty State ── */}
      <AnimatePresence>
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            {/* Animated heart */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
              style={{
                background: 'linear-gradient(135deg, #fdf0f0, #fde8e8)',
                border: '1px solid rgba(239,68,68,0.15)',
              }}
            >
              <Heart size={40} className="text-red-300" />
            </motion.div>

            <h2 className="font-serif text-2xl font-bold text-purple-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-8">
              Browse our botanical collection and tap the <span className="text-red-400 font-bold">♥</span> on any product to save it here.
            </p>

            {/* Tip callout */}
            <div className="flex items-start space-x-3 bg-purple-50 border border-purple-100 rounded-2xl px-5 py-4 max-w-sm mb-8 text-left">
              <Sparkles size={16} className="text-gold-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-purple-700 font-medium leading-relaxed">
                <span className="font-bold block mb-0.5">Pro tip</span>
                Tap the heart icon on any product card to save it for later — no login required!
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center space-x-2.5 px-8 py-4 rounded-full font-black text-sm uppercase tracking-wider min-h-0"
              style={{
                background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)',
                color: '#D4AF37',
                boxShadow: '0 8px 28px rgba(62,29,74,0.3)',
              }}
            >
              <span>Discover Products</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Wishlist Grid ── */}
      <AnimatePresence>
        {!isEmpty && (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5"
          >
            <AnimatePresence>
              {localWishlist.map((product) => (
                <WishlistCard
                  key={product._id || product.id}
                  product={product}
                  onRemove={removeFromLocalWishlist}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Continue Shopping ── */}
      {!isEmpty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex justify-center"
        >
          <Link
            href="/products"
            className="group flex items-center space-x-2 text-purple-600 hover:text-purple-900 font-bold text-sm transition-all min-h-0 min-w-0"
          >
            <span>Continue Shopping</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;
