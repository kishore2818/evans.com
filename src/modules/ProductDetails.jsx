import API_BASE_URL from '@/config/api';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from '@/router-shim';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import Skeleton from '../components/Skeleton';
import toast from 'react-hot-toast';
import { 
  ChevronLeft,
  ChevronRight,
  Star, 
  Share2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageSquare, 
  Send,
  Loader2,
  Quote
} from 'lucide-react';

// ─── Review Slider Component ───────────────────────────────────────────────────
const StarRating = ({ rating }) => (
  <div className="flex space-x-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={11}
        className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}
      />
    ))}
  </div>
);

const ReviewSlider = ({ reviews, hasPurchased }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-16 text-center bg-beige-50/50 rounded-[3rem] border border-dashed border-beige-100">
        <MessageSquare size={32} className="mx-auto text-beige-200 mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">No reflections yet</p>
        {hasPurchased && (
          <p className="text-purple-600 text-xs font-bold mt-2">Be the first to share your experience.</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Arrow Buttons — Desktop */}
      {reviews.length > 1 && (
        <>
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-purple-100 rounded-full shadow-md items-center justify-center text-purple-700 hover:bg-purple-50 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-purple-100 rounded-full shadow-md items-center justify-center text-purple-700 hover:bg-purple-50 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reviews.map((review, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-72 md:w-80 snap-start bg-white rounded-3xl border border-beige-50 shadow-luxury p-6 flex flex-col justify-between hover:border-purple-100 transition-colors"
          >
            {/* Quote icon */}
            <Quote size={20} className="text-purple-100 mb-3 flex-shrink-0" />

            {/* Review text */}
            <p className="text-gray-600 text-sm leading-relaxed font-medium flex-1 mb-5 line-clamp-4">
              "{review.comment}"
            </p>

            {/* Reviewer info */}
            <div className="flex items-center space-x-3 pt-4 border-t border-beige-50">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-100 to-beige-100 rounded-xl flex items-center justify-center text-purple-600 font-serif text-base font-bold flex-shrink-0">
                {review.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-gray-900 text-xs truncate">{review.name}</h4>
                <div className="flex items-center space-x-2 mt-0.5">
                  <StarRating rating={review.rating} />
                  <span className="text-[9px] text-gray-300 font-bold uppercase tracking-wider">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      {reviews.length > 1 && (
        <div className="flex justify-center space-x-1.5 mt-3">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = scrollRef.current;
                if (el) el.scrollTo({ left: i * 304, behavior: 'smooth' });
              }}
              className="w-1.5 h-1.5 rounded-full bg-purple-200 hover:bg-purple-700 transition-colors"
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const addToCart = useStore((state) => state.addToCart);
  const { addReview, myOrders, fetchMyOrders } = useStore();
  const { user, token } = useAuthStore();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Review State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        
        setProduct({
          ...data,
          id: data._id,
          images: data.images && data.images.length > 0 ? data.images : ['/images/placeholder.png'],
          rating: data.ratings?.average || 0,
          reviewsCount: data.ratings?.count || 0
        });

        if (token) {
          const orderRes = await fetch(`${API_BASE_URL}/api/orders/myorders`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const orders = await orderRes.json();
          const purchased = orders.some(order => 
            order.items.some(item => item.product === id)
          );
          setHasPurchased(purchased);
        }
      } catch (error) {
        console.error("Error fetching product details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, token]);

  if (loading) return (
    <div className="bg-white min-h-[calc(100vh-80px)] pb-24 md:pb-12 md:mt-4 md:rounded-3xl md:shadow-card md:mx-6 md:overflow-hidden relative max-w-6xl lg:mx-auto">
      <div className="md:flex md:h-full">
        <div className="w-full md:w-1/2 p-4 md:p-8">
          <Skeleton height="45vh" rounded="rounded-[3rem]" className="w-full md:h-[60vh]" />
          <div className="flex space-x-3 mt-4 overflow-hidden">
             {[...Array(4)].map((_, i) => (
               <Skeleton key={i} width="80px" height="80px" rounded="rounded-2xl" className="flex-shrink-0" />
             ))}
          </div>
        </div>
        <div className="px-6 md:px-12 pt-4 md:pt-24 bg-white md:w-1/2 flex flex-col">
          <Skeleton width="40%" height="32px" className="mb-6" />
          <Skeleton width="80%" height="20px" className="mb-4" />
          <Skeleton width="90%" height="20px" className="mb-8" />
          <div className="space-y-4 mb-10">
            <Skeleton width="100%" height="16px" />
            <Skeleton width="100%" height="16px" />
            <Skeleton width="100%" height="16px" />
          </div>
          <div className="flex space-x-4">
            <Skeleton width="50%" height="50px" rounded="rounded-full" />
            <Skeleton width="50%" height="50px" rounded="rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="min-h-screen flex items-center justify-center text-red-500 font-serif">Product not found.</div>;

  const handleAddToCart = () => {
    if (!token) {
      toast.error('Please login to add items to cart');
      navigate('/auth', { state: { from: location } });
      return;
    }
    const cartItem = { ...product, image: product.images[0] }; // Use first image for cart thumbnail
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
      await addReview(id, reviewData);
      toast.success('Review published successfully!');
      setShowReviewForm(false);
      // Refresh product to see new review
      window.location.reload(); // Simple way to refresh for now
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBuyNow = () => {
    if (!token) {
      toast.error('Please login to checkout');
      navigate('/auth', { state: { from: location } });
      return;
    }
    const cartItem = { ...product, image: product.images[0] };
    addToCart(cartItem, quantity);
    navigate('/cart');
  };

  return (
    <motion.div 
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, info) => {
        // If swiped down significantly
        if (info.offset.y > 100 && info.velocity.y >= 0) {
          navigate(-1);
        }
      }}
      className="bg-white min-h-[calc(100vh-80px)] pb-24 md:pb-12 md:mt-4 md:rounded-3xl md:shadow-card md:mx-6 md:overflow-hidden relative max-w-6xl lg:mx-auto touch-pan-x"
    >
      {/* Mobile Top Bar Overlay */}
      <div className="md:hidden absolute top-0 w-full z-10 flex justify-between items-center p-6 bg-gradient-to-b from-black/20 to-transparent pt-10">
        <button 
          onClick={() => navigate(-1)} 
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
        {/* GALLERY SECTION */}
        <div className="w-full lg:w-1/2 p-0 lg:p-8 bg-beige-50/30">
          {/* Main Hero Image */}
          <div className="w-full h-[50vh] md:h-[65vh] md:rounded-[3rem] overflow-hidden relative shadow-luxury group bg-beige-100">
            <img 
              src={product.images[activeImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Desktop Quick Actions */}
            <div className="hidden lg:flex absolute top-6 right-6 space-x-3 z-10">
              <button 
                onClick={handleShare}
                className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-purple-900 shadow-md hover:bg-white hover:scale-110 transition-all font-bold"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {/* Thumbnail Rail */}
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

        {/* DETAILS SECTION */}
        <div className="px-6 lg:px-12 pt-8 lg:pt-16 bg-white relative -mt-6 lg:mt-0 rounded-t-[3.5rem] lg:rounded-none lg:w-1/2 flex flex-col justify-start">
          <button 
            onClick={() => navigate(-1)} 
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
                <div className="flex items-center space-x-1 bg-gold-50 px-3 py-1.5 rounded-full text-gold-700">
                  <Star size={14} className="fill-gold-400 text-gold-400" />
                  <span className="text-sm font-black leading-none">{product.rating || 0}</span>
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">{product.reviewsCount || 0} Review(s)</span>
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
            {/* Quantity Control */}
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
                {/* Live stock indicator */}
                {product.stock > 0 && product.stock <= 10 && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full whitespace-nowrap">Only {product.stock} left!</span>
                )}
                {product.stock === 0 && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1.5 rounded-full whitespace-nowrap">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Buying Actions */}
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

      {/* REVIEWS & COMMUNITY SECTION */}
      <div className="px-6 lg:px-12 py-16 border-t border-beige-100 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 mb-2">Verified Community Content</p>
              <h2 className="font-serif text-3xl font-bold text-purple-900">Community Reflections</h2>
            </div>
            
            {hasPurchased && (
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
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-12"
              >
                <form onSubmit={handleReviewSubmit} className="bg-beige-50/50 p-8 rounded-[2.5rem] border border-beige-100 shadow-luxury">
                  <div className="mb-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3 block">Sacred Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star}
                          type="button"
                          onClick={() => setReviewData({...reviewData, rating: star})}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star 
                            size={24} 
                            className={`${star <= reviewData.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-300'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3 block">Your Botanical Experience</label>
                    <textarea 
                      required
                      placeholder="How has this affected your daily rituals? (Keep it authentic)" 
                      rows={4}
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                      className="w-full bg-white border border-beige-100 rounded-2xl p-4 text-sm focus:outline-none focus:border-purple-300 font-medium"
                    />
                  </div>
                  <button 
                    disabled={isSubmitting}
                    className="bg-purple-900 text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest flex items-center space-x-2 shadow-luxury hover:bg-purple-800 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    <span>Publish Reflection</span>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Review Slider */}
          <ReviewSlider reviews={product.reviews} hasPurchased={hasPurchased} />
        </div>
      </div>


    </motion.div>
  );
};

export default ProductDetails;
