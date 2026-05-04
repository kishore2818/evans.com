import API_BASE_URL from '@/config/api';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from '@/router-shim';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import Skeleton from '../components/Skeleton';
import toast from 'react-hot-toast';
import { 
  ChevronLeft, 
  Star, 
  Heart, 
  Share2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  MessageSquare, 
  Send,
  Loader2
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const addToCart = useStore((state) => state.addToCart);
  const { wishlist, toggleWishlist, addReview, myOrders, fetchMyOrders } = useStore();
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

  const toggleLike = async () => {
    if (!token) {
      toast.error('Please login to adjust wishlist');
      navigate('/auth', { state: { from: location } });
      return;
    }
    await toggleWishlist(product.id);
  };

  const isLiked = wishlist.includes(id);

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
    <div className="bg-white min-h-[calc(100vh-80px)] pb-24 md:pb-12 md:mt-4 md:rounded-3xl md:shadow-card md:mx-6 md:overflow-hidden relative max-w-6xl lg:mx-auto">
      {/* Mobile Top Bar Overlay */}
      <div className="md:hidden absolute top-0 w-full z-10 flex justify-between items-center p-6 bg-gradient-to-b from-black/20 to-transparent pt-10">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center text-purple-900 shadow-sm"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex space-x-3">
          <button className="w-10 h-10 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center text-purple-900 shadow-sm">
            <Share2 size={20} />
          </button>
          <button 
            onClick={toggleLike}
            className="w-10 h-10 bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm"
          >
            <Heart size={20} className={isLiked ? "text-red-500 fill-red-500" : "text-purple-900"} />
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
              <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-purple-900 shadow-md hover:bg-white hover:scale-110 transition-all font-bold">
                <Share2 size={18} />
              </button>
              <button 
                onClick={toggleLike}
                className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all"
              >
                <Heart size={18} className={isLiked ? "text-red-500 fill-red-500" : "text-purple-900"} />
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 bg-gold-50 px-3 py-1.5 rounded-full text-gold-700">
                  <Star size={14} className="fill-gold-400 text-gold-400" />
                  <span className="text-sm font-black leading-none">{product.rating || 0}</span>
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{product.reviewsCount || 0} Review(s)</span>
              </div>
              <div className="flex flex-col items-end">
                {product.discountPercentage > 0 && (
                  <span className="text-sm text-gray-400 line-through whitespace-nowrap">₹{product.price.toLocaleString('en-IN')}</span>
                )}
                <span className="font-sans text-2xl font-black text-purple-900 whitespace-nowrap">
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
            <div className="flex items-center space-x-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-900/40">Quantity</span>
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
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full">Only {product.stock} left!</span>
              )}
              {product.stock === 0 && (
                <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1.5 rounded-full">Out of Stock</span>
              )}
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

          {/* Review List */}
          <div className="space-y-8">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, idx) => (
                <div key={idx} className="bg-white p-6 md:p-8 rounded-3xl border border-beige-50 shadow-luxury group hover:border-purple-100 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-beige-100 to-white rounded-xl flex items-center justify-center text-purple-300 font-serif text-lg font-bold">
                        {review.name?.[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm leading-none mb-1 whitespace-nowrap truncate">{review.name}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} className={`${i < review.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed font-medium pl-1">
                    "{review.comment}"
                  </p>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-beige-50/50 rounded-[3rem] border border-dashed border-beige-100">
                <MessageSquare size={32} className="mx-auto text-beige-200 mb-4" />
                <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">No reflections yet</p>
                {hasPurchased && <p className="text-purple-600 text-xs font-bold mt-2">Be the first to share your experience.</p>}
              </div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default ProductDetails;
