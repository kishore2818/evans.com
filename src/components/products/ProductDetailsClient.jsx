'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import toast from 'react-hot-toast';
import {
  ChevronLeft,
  Star,
  Share2,
  Plus,
  Minus,
  ShoppingBag,
  MessageSquare,
  Send,
  Loader2,
  Heart,
  Leaf,
  Shield,
  Package,
  CheckCircle2,
  ZoomIn,
} from 'lucide-react';

const TABS = ['Description', 'Benefits', 'Reviews'];

const ProductDetailsClient = ({ initialProduct, hasPurchased: initialHasPurchased }) => {
  const router = useRouter();
  const pathname = usePathname();
  const addToCart = useStore((state) => state.addToCart);
  const { addReview, myOrders, fetchMyOrders } = useStore();
  const { user, token } = useAuthStore();

  const [product] = useState(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('Description');
  const localWishlist = useStore((state) => state.localWishlist);
  const toggleLocalWishlist = useStore((state) => state.toggleLocalWishlist);
  const productId = product._id || product.id;
  const isWishlisted = localWishlist.some((p) => (p._id || p.id) === productId);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token && myOrders.length === 0) fetchMyOrders();
  }, [token, fetchMyOrders, myOrders.length]);

  useEffect(() => {
    if (myOrders && myOrders.length > 0 && product) {
      const hasDelivered = myOrders.some(order =>
        order.orderStatus === 'delivered' &&
        order.items.some(item => (item.product === product.id || item.product === product._id))
      );
      setCanReview(hasDelivered);
    }
  }, [myOrders, product]);

  const handleAddToCart = () => {
    const cartItem = { ...product, image: product.images[0] };
    addToCart(cartItem, quantity);
    toast.success(`${quantity} × ${product.name} added!`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on Evans Luxe`,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing', error);
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewData.comment.length < 5) {
      toast.error('Please write a more detailed review.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addReview(product.id, reviewData);
      toast.success('Review published successfully!');
      setShowReviewForm(false);
      router.refresh();
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = () => {
    if (!token) {
      toast.error('Please login to checkout');
      router.push(`/auth?from=${pathname}`);
      return;
    }
    const cartItem = { ...product, image: product.images[0] };
    addToCart(cartItem, quantity);
    router.push('/cart');
  };



  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewData.comment.length < 5) { toast.error('Write a more detailed review.'); return; }
    setIsSubmitting(true);
    try {
      await addReview(product.id, reviewData);
      toast.success('Review published!');
      setShowReviewForm(false);
      router.refresh();
    } catch (error) {
      toast.error(error.message || 'Failed to submit');
    } finally {
      setIsSubmitting(false);
    }
  };

  const discountedPrice = product.discountPercentage > 0
    ? product.price - (product.price * (product.discountPercentage / 100))
    : product.price;

  const savingsAmount = product.discountPercentage > 0
    ? product.price - discountedPrice
    : 0;

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] pb-28 md:pb-12 md:mt-4 md:rounded-[2.5rem] md:overflow-hidden relative max-w-6xl lg:mx-auto md:shadow-luxury">

      {/* ── Mobile floating action bar ── */}
      <div className="md:hidden absolute top-0 w-full z-20 flex justify-between items-center p-5 pt-8"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 100%)' }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-md min-h-0 min-w-0"
          style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)' }}
        >
          <ChevronLeft size={22} className="text-purple-900" />
        </motion.button>
        <div className="flex space-x-2.5">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => { toggleLocalWishlist(product); toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist ♥'); }}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-md min-h-0 min-w-0"
            style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)' }}
          >
            <Heart size={18} fill={isWishlisted ? '#ef4444' : 'transparent'} stroke={isWishlisted ? '#ef4444' : '#5A2A6C'} strokeWidth={2} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="w-10 h-10 rounded-full flex items-center justify-center shadow-md min-h-0 min-w-0"
            style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)' }}
          >
            <Share2 size={18} className="text-purple-900" />
          </motion.button>
        </div>
      </div>

      <div className="lg:flex lg:min-h-full">

        {/* ══ LEFT: Image Gallery ══ */}
        <div className="w-full lg:w-[52%] lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] lg:overflow-y-auto">
          {/* Main Image */}
          <div
            className="relative w-full bg-beige-50 cursor-zoom-in overflow-hidden"
            style={{ height: '52vh', minHeight: '320px' }}
            onClick={() => setImageZoomed(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIndex}
                src={product.images[activeImageIndex]}
                alt={product.name}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full object-cover"
                style={{ willChange: 'transform' }}
              />
            </AnimatePresence>

            {/* Zoom hint */}
            <div className="absolute bottom-4 right-4 flex items-center space-x-1.5 text-white/70 text-[10px] font-bold uppercase tracking-wider">
              <ZoomIn size={14} />
              <span className="hidden md:inline">Tap to zoom</span>
            </div>

            {/* Desktop share + wishlist */}
            <div className="hidden lg:flex absolute top-5 right-5 space-x-2.5 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); toggleLocalWishlist(product); toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist ♥'); }}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all min-h-0 min-w-0"
                style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)' }}
              >
                <Heart size={17} fill={isWishlisted ? '#ef4444' : 'transparent'} stroke={isWishlisted ? '#ef4444' : '#5A2A6C'} strokeWidth={2} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleShare(); }}
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all min-h-0 min-w-0"
                style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)' }}
              >
                <Share2 size={17} className="text-purple-900" />
              </button>
            </div>

            {/* Best seller badge */}
            {product.isBestSeller && (
              <div
                className="absolute top-5 left-5 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md"
                style={{ background: 'rgba(62,29,74,0.92)', color: '#D4AF37', backdropFilter: 'blur(8px)' }}
              >
                ✦ Best Seller
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 px-4 md:px-6 py-4 overflow-x-auto no-scrollbar">
              {product.images.map((img, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setActiveImageIndex(idx)}
                  className="relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 min-h-0 min-w-0"
                  style={{
                    borderColor: activeImageIndex === idx ? '#D4AF37' : 'transparent',
                    boxShadow: activeImageIndex === idx ? '0 0 0 1px #D4AF37, 0 4px 12px rgba(212,175,55,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {activeImageIndex === idx && (
                    <div className="absolute inset-0 rounded-xl" style={{ background: 'rgba(212,175,55,0.08)' }} />
                  )}
                </motion.button>
              ))}
            </div>
          )}

          {/* Back button — desktop */}
          <button
            onClick={() => router.back()}
            className="hidden lg:flex items-center space-x-2 text-purple-500 hover:text-purple-900 font-bold px-6 py-4 transition-all hover:-translate-x-1 min-h-0 text-xs uppercase tracking-widest"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
            <span>Botanical Collection</span>
          </button>
        </div>

        {/* ══ RIGHT: Product Info ══ */}
        <div className="px-6 lg:px-10 pt-8 lg:pt-10 bg-white relative -mt-8 lg:mt-0 rounded-t-[2.5rem] lg:rounded-none lg:w-[48%] flex flex-col">

          {/* ── Name + Meta ── */}
          <div className="mb-6">
            {product.category && (
              <span className="inline-block text-[9px] font-black uppercase tracking-[0.3em] text-purple-600 bg-purple-50 px-3 py-1 rounded-full mb-3">
                {product.category}
              </span>
            )}
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-purple-900 leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating + sales row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full"
                style={{ background: '#fdf9ec', border: '1px solid rgba(212,175,55,0.25)' }}>
                <div className="flex space-x-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={11} fill={i <= Math.round(product.rating || 0) ? '#D4AF37' : 'transparent'}
                      className={i <= Math.round(product.rating || 0) ? 'text-gold-400' : 'text-gray-200'} />
                  ))}
                </div>
                <span className="text-xs font-black text-gold-700">{product.rating || 0}</span>
              </div>
              <span className="text-xs font-bold text-gray-400">({product.reviewsCount || 0} reviews)</span>
              {(product.soldCount || 0) > 0 && (
                <span className="text-[10px] font-black text-purple-900 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {product.soldCount} sold
                </span>
              )}
            </div>
          </div>

          {/* ── Price Block ── */}
          <div className="mb-6 p-4 rounded-2xl" style={{ background: '#fdfcfb', border: '1px solid rgba(62,29,74,0.07)' }}>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-sans text-3xl font-black text-purple-900">
                ₹{discountedPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-base text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Save ₹{savingsAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </>
              )}
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1.5">
              Inclusive of all taxes · Free shipping above ₹999
            </p>
          </div>

          {/* ── Tabs: Description / Benefits / Reviews ── */}
          <div className="mb-6">
            {/* Tab bar */}
            <div className="flex space-x-1 p-1 rounded-2xl mb-5" style={{ background: '#f5f0f9' }}>
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 min-h-0 relative`}
                  style={activeTab === tab ? {
                    background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)',
                    color: '#D4AF37',
                    boxShadow: '0 4px 12px rgba(62,29,74,0.25)',
                  } : { color: '#9ca3af' }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'Description' && (
                <motion.div
                  key="desc"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 text-sm leading-relaxed font-medium">
                    {product.description}
                  </p>
                  {/* Trust icons */}
                  <div className="flex flex-wrap gap-3 mt-5">
                    {[
                      { icon: Leaf, label: 'Organic' },
                      { icon: Shield, label: 'Cruelty-Free' },
                      { icon: Package, label: 'Eco Packaging' },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center space-x-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-3 py-2 rounded-full">
                        <Icon size={13} />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'Benefits' && (
                <motion.div
                  key="benefits"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  {product.benefits && product.benefits.length > 0 ? (
                    <ul className="space-y-3">
                      {product.benefits.map((benefit, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.07 }}
                          className="flex items-start space-x-3 text-sm text-gray-700 font-medium"
                        >
                          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: 'linear-gradient(135deg, #D4AF37, #edc757)' }}>
                            <CheckCircle2 size={11} className="text-purple-900" strokeWidth={3} />
                          </div>
                          <span>{benefit}</span>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-sm italic">No benefits listed yet.</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'Reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 max-h-60 overflow-y-auto no-scrollbar"
                >
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, idx) => (
                      <div key={idx} className="p-4 rounded-2xl" style={{ background: '#fdfcfb', border: '1px solid rgba(62,29,74,0.06)' }}>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-gold-300 font-serif font-bold text-sm flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)' }}>
                            {review.name?.[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-purple-900">{review.name}</p>
                            <div className="flex space-x-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={8} fill={i < review.rating ? '#D4AF37' : 'transparent'}
                                  className={i < review.rating ? 'text-gold-400' : 'text-gray-200'} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs leading-relaxed italic">"{review.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare size={24} className="mx-auto text-gray-200 mb-2" />
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">No reviews yet</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Quantity + Stock ── */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-900/50">Quantity</span>
              {product.stock > 0 && product.stock <= 10 && (
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full"
                >
                  Only {product.stock} left!
                </motion.span>
              )}
              {product.stock === 0 && (
                <span className="text-[10px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
            <div className="inline-flex items-center rounded-2xl p-1"
              style={{ background: '#f5f0f9', border: '1px solid rgba(62,29,74,0.08)' }}>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={product.stock === 0}
                className="w-11 h-11 flex items-center justify-center text-purple-700 hover:bg-white rounded-xl transition-all disabled:opacity-30 min-h-0 min-w-0"
              >
                <Minus size={16} strokeWidth={3} />
              </motion.button>
              <span className="w-12 text-center font-black font-sans text-base text-purple-900">{quantity}</span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={product.stock === 0 || quantity >= product.stock}
                className="w-11 h-11 flex items-center justify-center text-purple-700 hover:bg-white rounded-xl transition-all disabled:opacity-30 min-h-0 min-w-0"
              >
                <Plus size={16} strokeWidth={3} />
              </motion.button>
            </div>
          </div>

          {/* ── CTA Buttons ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            {/* Add to Bag */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-[1.2] py-5 rounded-2xl flex justify-center items-center space-x-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed min-h-0"
              style={addedToCart ? {
                background: 'linear-gradient(135deg, #16a34a, #15803d)',
                color: 'white',
                boxShadow: '0 8px 24px rgba(22,163,74,0.35)',
              } : {
                border: '2px solid #3e1d4a',
                color: '#3e1d4a',
                background: 'white',
              }}
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <CheckCircle2 size={18} strokeWidth={2.5} />
                    <span>Added!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="bag"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex items-center space-x-2"
                  >
                    <ShoppingBag size={18} strokeWidth={2.5} />
                    <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Buy Now */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 py-5 rounded-2xl flex justify-center items-center text-xs font-black uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed min-h-0"
              style={{
                background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)',
                color: '#D4AF37',
                boxShadow: '0 8px 24px rgba(62,29,74,0.35)',
              }}
            >
              Buy Now
            </motion.button>
          </div>

          {/* ── Review Form (can review only) ── */}
          {canReview && (
            <div className="mb-8">
              <button
                onClick={() => setShowReviewForm(v => !v)}
                className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all min-h-0"
                style={{ background: '#f5f0f9', color: '#5A2A6C', border: '1px solid rgba(90,42,108,0.12)' }}
              >
                <MessageSquare size={15} />
                <span>{showReviewForm ? 'Cancel' : 'Write a Review'}</span>
              </button>

              <AnimatePresence>
                {showReviewForm && (
                  <motion.form
                    onSubmit={handleReviewSubmit}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-4">
                      {/* Star rating */}
                      <div className="text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3">Rate your experience</p>
                        <div className="flex justify-center space-x-3">
                          {[1,2,3,4,5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewData({...reviewData, rating: star})}
                              className="hover:scale-125 transition-all min-h-0 min-w-0 w-8 h-8"
                            >
                              <Star size={32} fill={star <= reviewData.rating ? '#D4AF37' : 'transparent'}
                                className={star <= reviewData.rating ? 'text-gold-400' : 'text-gray-200'} strokeWidth={1.5} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea
                        required
                        placeholder="Share your experience with this product..."
                        rows={3}
                        value={reviewData.comment}
                        onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                        className="w-full border border-beige-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-50 transition-all font-medium resize-none"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all disabled:opacity-50 min-h-0"
                        style={{ background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)', color: '#D4AF37' }}
                      >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        <span>Publish Review</span>
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ── Zoomed Image Modal ── */}
      <AnimatePresence>
        {imageZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setImageZoomed(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }}
          >
            <motion.img
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              src={product.images[activeImageIndex]}
              alt={product.name}
              className="max-w-full max-h-full object-contain rounded-3xl"
              style={{ maxWidth: '90vw', maxHeight: '90vh' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailsClient;
