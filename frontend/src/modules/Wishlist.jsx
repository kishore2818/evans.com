import React from 'react';
import { ChevronLeft, Heart } from 'lucide-react';
import { useNavigate } from '@/router-shim';

const Wishlist = () => {
  const navigate = useNavigate();

  return (
    <div className="px-6 md:px-12 pt-8 md:pt-16 pb-24 md:pb-12 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center space-x-2 text-purple-600 hover:text-purple-900 font-semibold mb-6 md:mb-10 transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>

      <div className="mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-purple-900 mb-3">My Wishlist</h1>
        <p className="text-gray-500 font-medium">Keep track of items you love.</p>
      </div>

      <div className="text-center bg-white p-10 rounded-[2rem] border border-beige-100 flex flex-col items-center">
        <div className="w-20 h-20 bg-beige-50 rounded-full flex items-center justify-center text-red-200 mb-4">
          <Heart size={32} />
        </div>
        <h3 className="font-semibold text-lg text-gray-900 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-500 max-w-sm mb-6">Explore our collection and add your favorite botanical items to your wishlist.</p>
        <button 
          onClick={() => navigate('/products')}
          className="bg-purple-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-800 transition-colors"
        >
          Discover Products
        </button>
      </div>
    </div>
  );
};

export default Wishlist;
