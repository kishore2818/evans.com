"use client";

import { Star, Plus, Heart } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'framer-motion';
import { useStore } from '../store/useStore';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useState, useRef } from 'react';

const ProductCard = ({ product, priority = false }) => {
  const addToCart = useStore((state) => state.addToCart);
  const toggleLocalWishlist = useStore((state) => state.toggleLocalWishlist);
  const localWishlist = useStore((state) => state.localWishlist);
  const router = useRouter();
  const productId = product._id || product.id;
  const isWishlisted = localWishlist.some(p => (p._id || p.id) === productId);
  const [addedToCart, setAddedToCart] = useState(false);
  const cardRef = useRef(null);

  // Active shade selection
  const [selectedShade, setSelectedShade] = useState(product.shades?.[0] || null);

  /* ── 3D Tilt via mouse ── */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });
  // Reactive glare position using useMotionTemplate
  const glareX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.20) 0%, transparent 65%)`;

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const itemToAdd = {
      ...product,
      selectedShade: selectedShade || (product.shades?.[0] || null),
      image: selectedShade?.image || product.images?.[0] || product.image
    };
    addToCart(itemToAdd);
    toast.success(`${product.name}${selectedShade ? ` (${selectedShade.name})` : ''} added!`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLocalWishlist(product);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist ♥');
  };

  const handleShadeSelect = (e, shade) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedShade(shade);
  };

  const effectiveDiscount = product.flashSale?.isActive && product.flashSale?.discountPercentage
    ? Math.max(product.discountPercentage || 0, product.flashSale.discountPercentage)
    : product.discountPercentage || 0;

  const discountedPrice = effectiveDiscount > 0
    ? product.price - (product.price * (effectiveDiscount / 100))
    : product.price;

  const rating = product.rating || product.ratings?.average || 0;
  const reviewCount = product.reviews?.length || product.reviewsCount || product.reviews || 0;
  const [imgSrc, setImgSrc] = useState(null);
  const displayImage = imgSrc || selectedShade?.image || product.images?.[0] || product.image || '/images/aloevera_gel.jpg';
  // "New Arrival" = added within last 7 days
  const isNewArrival = product.createdAt && 
    (Date.now() - new Date(product.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
  // "Low Stock" warning  
  const isLowStock = product.stock !== undefined && product.stock > 0 &&
    product.stock <= (product.lowStockThreshold || 10);

  return (
    <Link href={`/products/${productId}`} className="block h-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          perspective: '1000px',
          boxShadow: '0 4px 20px rgba(90,42,108,0.10), 0 1px 4px rgba(90,42,108,0.06)',
        }}
        whileHover={{ scale: 1.03, z: 20 }}
        whileTap={{ scale: 0.97 }}
        className="relative h-full flex flex-col rounded-[2rem] bg-white border border-beige-100/60 overflow-hidden cursor-pointer group shine-sweep"
      >
        {/* ── Dynamic glare overlay (reactive via useMotionTemplate) ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-10 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: glareBackground }}
        />

        {/* ── Image Container ── */}
        <div className="relative rounded-[1.8rem] overflow-hidden aspect-square mx-3 mt-3 bg-beige-50 flex-shrink-0">
          <Image
            src={displayImage}
            alt={product.name || 'Product image'}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            priority={priority}
            unoptimized={typeof displayImage === 'string' && displayImage.startsWith('http')}
            onError={() => setImgSrc('/images/aloevera_gel.jpg')}
          />

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 rounded-[1.8rem]" />

          {/* ── Badges ── */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-20">
            {product.flashSale?.isActive && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm text-white bg-gradient-to-r from-red-600 to-amber-600 flex items-center space-x-1"
              >
                <span>⚡ Flash Deal</span>
              </motion.div>
            )}

            {isNewArrival && !product.flashSale?.isActive && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
                className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-md shadow-sm"
                style={{ background: 'rgba(16,185,129,0.92)', color: '#fff' }}
              >
                ✨ New
              </motion.div>
            )}

            {product.isBestSeller && !product.flashSale?.isActive && !isNewArrival && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-md shadow-sm"
                style={{ background: 'rgba(62,29,74,0.90)', color: '#D4AF37' }}
              >
                ❆ Best Seller
              </motion.div>
            )}

            {effectiveDiscount > 0 && !product.flashSale?.isActive && (
              <div
                className="text-[9px] font-black px-2 py-1 rounded-full shadow-sm backdrop-blur-md text-white"
                style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
              >
                -{effectiveDiscount}%
              </div>
            )}
          </div>

          {/* ── Wishlist button ── */}
          <motion.button
            onClick={handleWishlist}
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.15 }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all z-20 min-h-0 min-w-0"
            style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.9)' }}
          >
            <Heart
              size={14}
              className="transition-all duration-300"
              fill={isWishlisted ? '#ef4444' : 'transparent'}
              stroke={isWishlisted ? '#ef4444' : '#9ca3af'}
              strokeWidth={2}
            />
          </motion.button>

          {/* ── Quick-add hover overlay ── */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            whileHover={{ y: '0%', opacity: 1 }}
            className="absolute bottom-0 left-0 right-0 z-20"
            style={{ originY: 'bottom' }}
          >
            <div className="group-hover:translate-y-0 translate-y-full transition-transform duration-300 ease-out">
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 flex items-center justify-center space-x-2 font-black text-[10px] uppercase tracking-widest text-gold-300 backdrop-blur-md"
                style={{
                  background: 'linear-gradient(135deg, rgba(62,29,74,0.95), rgba(90,42,108,0.95))',
                }}
              >
                <Plus size={14} strokeWidth={3} className="text-gold-300" />
                <span>Add to Bag</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* ── Card Body ── */}
        <div className="px-3.5 pt-3 pb-4 flex flex-col flex-grow justify-between">
          <div>
            {/* Top row: Category + Clean Beauty Badge */}
            <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
              {product.category && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {product.category}
                </span>
              )}
              {product.cleanBadges?.[0] && (
                <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200/60 whitespace-nowrap">
                  🌿 {product.cleanBadges[0]}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-1">
              <div className="flex space-x-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={9}
                    className={i <= Math.round(rating) ? 'text-gold-400' : 'text-gray-200'}
                    fill={i <= Math.round(rating) ? '#D4AF37' : 'transparent'}
                  />
                ))}
              </div>
              <span className="text-[9px] text-gray-400 font-bold">({reviewCount})</span>
            </div>

            {/* Name */}
            <h3 className="font-serif font-bold text-purple-900 text-[14px] leading-tight mb-1.5 line-clamp-2">
              {product.name}
            </h3>

            {/* ── Shade Swatches (if product has shades) ── */}
            {product.shades && product.shades.length > 0 && (
              <div className="my-1.5 flex items-center space-x-1.5">
                <span className="text-[9px] text-gray-400 font-medium">Shades:</span>
                <div className="flex items-center space-x-1">
                  {product.shades.slice(0, 4).map((shade, sIdx) => {
                    const isCurrent = (selectedShade?.name || product.shades[0].name) === shade.name;
                    return (
                      <button
                        key={sIdx}
                        onClick={(e) => handleShadeSelect(e, shade)}
                        title={shade.name}
                        className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                          isCurrent
                            ? 'ring-2 ring-purple-900 ring-offset-1 scale-110'
                            : 'border-black/20 hover:scale-110 opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: shade.hex || '#E0A899' }}
                      />
                    );
                  })}
                  {product.shades.length > 4 && (
                    <span className="text-[8px] text-gray-400 font-bold">+{product.shades.length - 4}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Price + Add button row */}
          <div className="flex items-center justify-between mt-2 gap-2 pt-1 border-t border-beige-100/80">
            <div className="flex flex-col min-w-0">
              <span className="font-sans font-extrabold text-base text-purple-900 leading-none">
                ₹{discountedPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              {effectiveDiscount > 0 && (
                <span className="text-[10px] text-gray-400 line-through mt-0.5">
                  ₹{product.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              )}
              {isLowStock && (
                <span className="text-[8px] font-bold text-amber-600 mt-0.5 flex items-center gap-0.5">
                  🔥 Only {product.stock} left
                </span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.88 }}
              onClick={handleAdd}
              className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-luxury transition-all duration-300 min-h-0 min-w-0 overflow-hidden relative"
              style={{
                background: addedToCart
                  ? 'linear-gradient(135deg, #16a34a, #15803d)'
                  : 'linear-gradient(135deg, #3e1d4a, #5A2A6C)',
              }}
              aria-label="Add to cart"
            >
              <motion.div
                animate={addedToCart ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Plus size={15} strokeWidth={3} className="text-gold-200" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
