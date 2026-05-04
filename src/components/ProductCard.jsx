import { Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const addToCart = useStore((state) => state.addToCart);
  const router = useRouter();

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };
  const discountedPrice = product.discountPercentage > 0
    ? product.price - (product.price * (product.discountPercentage / 100))
    : product.price;

  const productId = product._id || product.id;

  return (
    <Link href={`/products/${productId}`} className="block h-full">
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-[2.5rem] p-4 shadow-luxury hover:shadow-2xl transition-all duration-500 relative group h-full flex flex-col justify-between border border-beige-100/50"
      >
        <div className="relative rounded-[2rem] overflow-hidden aspect-square mb-4 bg-beige-50">
          <Image
            src={product.images?.[0] || product.image || '/images/placeholder.png'}
            alt={product.name || 'Product image'}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {product.isBestSeller && (
            <div className="absolute top-3 left-3 bg-purple-900/90 backdrop-blur-md text-gold-300 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
              Best Seller
            </div>
          )}
          {product.discountPercentage > 0 && (
            <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
              -{product.discountPercentage}%
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
        </div>

        <div className="px-1 flex flex-col flex-grow justify-between">
          <div>
            <div className="flex items-center space-x-1.5 mb-2 whitespace-nowrap">
              <div className="flex text-gold-400">
                <Star size={10} fill="currentColor" />
              </div>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest whitespace-nowrap">{product.rating} • {product.reviews} reviews</span>
            </div>
            <h3 className="font-serif font-bold text-purple-900 text-lg leading-tight mb-2 line-clamp-2">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center justify-between mt-auto pt-2 gap-2">
            <div className="flex flex-row items-center space-x-1 flex-nowrap min-w-0">
              <span className="font-sans font-extrabold text-base md:text-lg text-gray-900 whitespace-nowrap">
                ₹{discountedPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </span>
              {product.discountPercentage > 0 && (
                <span className="hidden sm:inline text-[10px] text-gray-400 line-through whitespace-nowrap">₹{product.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: '#4C1D95' }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAdd}
              className="bg-purple-900 text-white hover:bg-purple-800 transition-colors py-2 px-3 md:px-4 rounded-xl shadow-luxury flex items-center justify-center flex-shrink-0"
              aria-label="Add to cart"
            >
              <Plus size={10} strokeWidth={4} className="text-gold-200 sm:mr-1 lg:mr-0 2xl:mr-1 drop-shadow-[0_0_2px_rgba(253,224,71,0.5)]" />
              <span className="hidden sm:inline lg:hidden 2xl:inline text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap">Add</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
