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
  Loader2
} from 'lucide-react';

const ProductDetailsClient = ({ initialProduct, hasPurchased: initialHasPurchased }) => {
  const router = useRouter();
  const pathname = usePathname();
  const addToCart = useStore((state) => state.addToCart);
  const { addReview, myOrders, fetchMyOrders } = useStore();
  const { user, token } = useAuthStore();
  
  const [product] = useState(initialProduct);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token && myOrders.length === 0) {
      fetchMyOrders();
    }
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
    if (!token) {
      toast.error('Please login to add items to cart');
      router.push(`/auth?from=${pathname}`);
      return;
    }
    const cartItem = { ...product, image: product.images[0] };
    addToCart(cartItem, quantity);
    toast.success(`${quantity} ${product.name} added to cart!`);
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

  return (
    <div className="bg-white min-h-[calc(100vh-80px)] pb-24 md:pb-12 md:mt-4 md:rounded-3xl md:shadow-card md:mx-6 md:overflow-hidden relative max-w-6xl lg:mx-auto">
      <div className="md:hidden absolute top-0 w-full z-10 flex justify-between items-center p-6 bg-gradient-to-b from-black/20 to-transparent pt-10">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center text-purple-900 shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex space-x-3">
          <button 
            onClick={handleShare}
            className="w-10 h-10 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center text-purple-900 shadow-sm"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="lg:flex lg:h-full">
        <div className="w-full lg:w-1/2 p-0 lg:p-8 bg-beige-50/30">
          <div className="w-full h-[50vh] md:h-[65vh] md:rounded-[3rem] overflow-hidden relative shadow-luxury group bg-beige-100">
            <img 
              src={product.images[activeImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="hidden lg:flex absolute top-6 right-6 space-x-3 z-10">
              <button 
                onClick={handleShare}
                className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-purple-900 shadow-md hover:bg-white hover:scale-110 transition-all font-bold"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="flex overflow-x-auto no-scrollbar space-x-3 mt-4 px-6 md:px-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    activeImageIndex === idx 
                    ? 'border-gold-400 scale-105 shadow-md' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 lg:px-12 pt-8 lg:pt-16 bg-white relative -mt-6 lg:mt-0 rounded-t-[3.5rem] lg:rounded-none lg:w-1/2 flex flex-col justify-start">
          <button 
            onClick={() => router.back()} 
            className="hidden lg:flex items-center space-x-2 text-purple-600 hover:text-purple-900 font-bold mb-8 transition-all hover:-translate-x-1"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
            <span className="text-xs uppercase tracking-[0.2em]">Botanical Collection</span>
          </button>

          <div className="flex flex-col mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-purple-900 leading-tight mb-2">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-end justify-between gap-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-1 bg-gold-50 px-3 py-1.5 rounded-full text-gold-700 whitespace-nowrap">
                  <Star size={14} className="fill-gold-400 text-gold-400" />
                  <span className="text-sm font-black leading-none">{product.rating || 0}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span className="whitespace-nowrap">{product.reviewsCount || 0} Review(s)</span>
                    <span className="text-gray-200">|</span>
                    <span className="text-[10px] font-black text-purple-900 bg-purple-50 px-2 py-1 rounded-md uppercase tracking-wider whitespace-nowrap">{product.soldCount || 0} Sold</span>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col items-baseline sm:items-end space-x-2 sm:space-x-0 whitespace-nowrap">
                {product.discountPercentage > 0 && (
                  <span className="text-sm text-gray-400 line-through">₹{product.price.toLocaleString('en-IN')}</span>
                )}
                <span className="font-sans text-2xl font-black text-purple-900">
                  ₹{(product.discountPercentage > 0 
                    ? product.price - (product.price * (product.discountPercentage / 100)) 
                    : product.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-900/40 mb-3">Product Essence</h4>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-900/40 mb-3">Key Benefits</h4>
              <ul className="grid grid-cols-1 gap-2.5">
                {product.benefits?.map((benefit, idx) => (
                  <li key={idx} className="flex items-center space-x-3 text-xs text-gray-700 font-bold">
                    <div className="w-1.5 h-1.5 bg-gold-400 rounded-full flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-auto space-y-8">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-900/40 block mb-3">Quantity</span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-beige-50 rounded-2xl p-1 shadow-sm border border-beige-100">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock === 0}
                    className="w-10 h-10 flex items-center justify-center text-purple-700 hover:bg-white hover:shadow-sm rounded-xl transition-all disabled:opacity-30"
                  >
                    <Minus size={18} strokeWidth={3} />
                  </button>
                  <span className="w-10 text-center font-black font-sans text-sm text-purple-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={product.stock === 0 || quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center text-purple-700 hover:bg-white hover:shadow-sm rounded-xl transition-all disabled:opacity-30"
                  >
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
                {product.stock > 0 && product.stock <= 10 && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full whitespace-nowrap">Only {product.stock} left!</span>
                )}
                {product.stock === 0 && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1.5 rounded-full whitespace-nowrap">Out of Stock</span>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row w-full space-y-3 md:space-y-0 md:space-x-4">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-[1.2] border-2 border-purple-900 text-purple-900 font-black py-5 rounded-2xl flex justify-center items-center space-x-3 text-xs uppercase tracking-widest hover:bg-purple-900 hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-purple-900"
              >
                <ShoppingBag size={18} strokeWidth={2.5} />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}</span>
              </button>
              <button 
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-purple-900 text-gold-300 font-black py-5 rounded-2xl flex justify-center items-center shadow-luxury text-xs uppercase tracking-widest hover:bg-purple-800 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 lg:px-12 py-16 border-t border-beige-100 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 mb-2">Verified Community Content</p>
              <h2 className="font-serif text-3xl font-bold text-purple-900">Community Reflections</h2>
            </div>
            
            {canReview && (
              <button 
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-beige-50 text-purple-900 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-purple-900 hover:text-white transition-all flex items-center space-x-2"
              >
                <MessageSquare size={16} />
                <span>{showReviewForm ? 'Cancel Reflection' : 'Write a Reflection'}</span>
              </button>
            )}
          </div>

          <AnimatePresence>
            {showReviewForm && (
              <motion.div 
                initial={{ height: 0, opacity: 0, y: 20 }}
                animate={{ height: 'auto', opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: 20 }}
                className="overflow-hidden mb-12"
              >
                <form onSubmit={handleReviewSubmit} className="bg-gradient-to-br from-beige-50/50 to-white p-8 md:p-12 rounded-[3.5rem] border border-beige-100 shadow-luxury relative">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-50 rounded-full opacity-20 blur-2xl" />
                  
                  <div className="mb-10 text-center">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-900/40 mb-6 block">Rate Your Experience</label>
                    <div className="flex justify-center space-x-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          type="button"
                          onClick={() => setReviewData({...reviewData, rating: star})}
                          className="transform hover:scale-125 transition-all duration-300 active:scale-95"
                        >
                          <Star 
                            size={38} 
                            strokeWidth={1.5}
                            className={`${star <= reviewData.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-200'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {reviewData.rating > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-8"
                        >
                            <div className="relative">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-4 block">Share Your Botanical Reflection</label>
                                <textarea 
                                    required
                                    placeholder="How has this product transformed your daily ritual? Describe the essence..." 
                                    rows={4}
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                                    className="w-full bg-white/80 backdrop-blur-sm border border-beige-100 rounded-[2rem] p-6 text-sm focus:outline-none focus:border-purple-300 focus:ring-4 focus:ring-purple-50 transition-all font-medium shadow-inner"
                                />
                                <div className="absolute bottom-4 right-6 pointer-events-none opacity-10">
                                    <MessageSquare size={40} className="text-purple-900" />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button 
                                    disabled={isSubmitting}
                                    className="bg-purple-900 text-gold-300 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center space-x-3 shadow-luxury hover:bg-purple-800 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                                >
                                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                    <span>Publish Reflection</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-8">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-beige-50 shadow-luxury group hover:border-purple-100 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/30 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-beige-50 rounded-2xl flex items-center justify-center text-purple-900 font-serif text-xl font-bold shadow-sm">
                        {review.name?.[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-purple-900 text-base leading-none mb-2">{review.name}</h4>
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} className={`${i < review.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <span className="absolute -top-4 -left-2 text-6xl text-purple-100 font-serif pointer-events-none">“</span>
                    <p className="text-gray-600 text-sm leading-relaxed font-medium pl-6 relative z-10 italic">
                        {review.comment}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center bg-beige-50/50 rounded-[3rem] border border-dashed border-beige-100">
                <MessageSquare size={32} className="mx-auto text-beige-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">No reflections yet</p>
                {canReview && <p className="text-purple-600 text-xs font-bold mt-2">Be the first to share your experience.</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsClient;
