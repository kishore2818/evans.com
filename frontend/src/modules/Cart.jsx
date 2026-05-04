import React from 'react';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import Link from 'next/link';
import Image from 'next/image';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useStore();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal > 0 ? subtotal + shipping : 0;

  if (cart.length === 0) {
    return (
      <div className="px-6 py-12 h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-beige-200 rounded-full flex items-center justify-center mb-6">
          <Trash2 size={40} className="text-purple-300" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-purple-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-sm">Looks like you haven't added any luxury botanicals yet.</p>
        <Link href="/products" className="bg-purple-900 text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-luxury">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 pt-12 md:pt-16 pb-24 md:pb-12 max-w-7xl mx-auto">
      <h1 className="font-serif text-3xl font-bold mb-6 md:mb-10">Your Bag</h1>
      
      <div className="md:flex md:space-x-8 lg:space-x-12">
        {/* Cart Items */}
        <div className="md:w-2/3 space-y-4 mb-8 md:mb-0">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-3xl flex items-center space-x-4 shadow-card border border-beige-100">
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-beige-100 flex-shrink-0">
                <Image
                  src={item.image || '/images/placeholder.png'}
                  alt={item.name || 'Cart item'}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-serif text-sm md:text-base font-bold text-purple-900 leading-tight line-clamp-2">{item.name}</h3>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-500 p-2 -mr-2 active:scale-90 transition-transform">
                    <Trash2 size={18} />
                  </button>
                </div>
                <span className="font-sans text-sm font-extrabold block mb-3 text-gray-900 whitespace-nowrap">₹{item.price.toLocaleString('en-IN')}</span>
                
                <div className="flex items-center">
                  <div className="flex items-center bg-beige-100 rounded-full p-1 border border-beige-200">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                      className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center text-purple-700 bg-white rounded-full shadow-sm active:scale-90 transition-transform"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="w-10 text-center font-black text-sm text-purple-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                      className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center text-purple-700 bg-white rounded-full shadow-sm active:scale-90 transition-transform"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="md:w-1/3">
          <div className="bg-white p-5 md:p-8 rounded-3xl shadow-card md:shadow-lg mb-6 border border-beige-100 sticky top-28">
            <h3 className="font-serif text-lg font-bold mb-4 border-b border-beige-100 pb-2">Order Summary</h3>
        <div className="space-y-3 mb-4 text-sm">
          <div className="flex justify-between text-gray-600 font-medium">
            <span>Subtotal</span>
            <span className="font-bold text-gray-900 whitespace-nowrap">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-gray-600 font-medium">
            <span>Shipping</span>
            <span className="font-bold text-gray-900 whitespace-nowrap">{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
          </div>
        </div>
            <div className="flex justify-between items-center pt-3 border-t border-beige-200">
              <span className="font-serif text-lg font-bold">Total</span>
              <span className="font-sans text-xl font-bold text-purple-900 whitespace-nowrap">₹{total.toLocaleString('en-IN')}</span>
            </div>

            <Link 
              href="/checkout"
              className="w-full bg-purple-900 text-white font-bold py-4 mt-8 rounded-full flex justify-center items-center space-x-2 shadow-luxury hover:bg-purple-800 transition-colors"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile Sticky Checkout */}
      <div className="md:hidden fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-xl border-t border-beige-200 z-50 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-24">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
          <span className="text-lg font-black text-purple-900 leading-tight whitespace-nowrap">₹{total.toLocaleString('en-IN')}</span>
        </div>
        <Link 
          href="/checkout"
          className="bg-purple-900 text-white font-bold px-8 py-4 rounded-2xl flex items-center space-x-2 shadow-luxury active:scale-95 transition-transform"
        >
          <span>Checkout</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default Cart;
