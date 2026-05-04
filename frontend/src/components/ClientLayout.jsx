'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Grid, ShoppingBag, User, Menu, X, ChevronRight, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';

const TopNav = ({ cartItemCount }) => {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/products' },
    { name: 'Contact Us', path: '/contact' },
  ];

  // Don't render TopNav on home page — home has its own built-in header
  if (pathname === '/') return null;

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-md py-2' 
            : 'bg-white/80 backdrop-blur-md py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 group whitespace-nowrap min-h-[48px]">
            <div className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-full border-2 border-purple-100 shadow-md">
              <Image src="/images/logo.jpg" alt="Evans Luxe Logo" fill sizes="40px" className="object-cover" priority />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-purple-900">
                Evans Luxe
              </span>
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] text-gold-500">
                Beauty
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`relative font-bold text-base transition-colors pb-1 group min-h-[48px] flex items-center ${
                    isActive ? 'text-purple-900' : 'text-gray-500 hover:text-purple-700'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-purple-700 rounded-full transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-2 md:space-x-6">
            <Link 
              href="/profile" 
              className="hidden md:flex items-center space-x-2 text-gray-600 hover:text-purple-700 transition-colors group min-h-[48px]"
            >
              <div className="w-9 h-9 rounded-full bg-beige-100 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <User size={20} strokeWidth={2} />
              </div>
            </Link>

            <Link href="/cart" className="relative flex items-center space-x-2 text-gray-600 hover:text-purple-700 transition-colors group min-h-[48px] px-2">
              <div className="w-9 h-9 rounded-full bg-beige-100 flex items-center justify-center group-hover:bg-purple-100 relative transition-colors">
                <ShoppingBag size={20} strokeWidth={2} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-purple-700 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </div>
            </Link>

            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-purple-900 min-h-[48px] min-w-[48px] active:scale-90 transition-transform"
              aria-label="Menu"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white z-[70] md:hidden shadow-2xl flex flex-col p-8"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-serif text-xl font-bold text-purple-900">Evans Luxe</span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 min-h-[48px] min-w-[48px] active:scale-90 transition-transform"
                >
                  <X size={28} />
                </button>
              </div>
              <nav className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-bold text-gray-700 hover:text-purple-900 py-2 border-b border-gray-50 flex items-center justify-between min-h-[48px]"
                  >
                    <span>{link.name}</span>
                    <ChevronRight size={18} className="text-gray-300" />
                  </Link>
                ))}
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-gray-700 hover:text-purple-900 py-2 border-b border-gray-50 flex items-center justify-between min-h-[48px]"
                >
                  <span>My Account</span>
                  <ChevronRight size={18} className="text-gray-300" />
                </Link>
              </nav>
              <div className="mt-auto pt-8 border-t border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">Evans Luxe Beauty</p>
                <p className="text-xs text-gray-500 leading-relaxed italic">"Inspired by nature, perfected by science."</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const BottomNav = ({ cartItemCount }) => {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/products', icon: Grid },
    { name: 'Cart', path: '/cart', icon: ShoppingBag, badge: cartItemCount },
    { name: 'Contact', path: '/contact', icon: MessageCircle },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-beige-200 px-6 py-3 pb-8 z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <nav className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`relative flex flex-col items-center p-2 transition-colors duration-300 ${
                isActive ? 'text-purple-700' : 'text-gray-400 hover:text-purple-400'
              }`}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-gold-400 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                {item.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-3 w-12 h-1 bg-purple-700 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const ClientLayout = ({ children }) => {
  const pathname = usePathname();
  const cart = useStore((state) => state.cart);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // The admin module has been moved to a separate application.

  return (
    <div className="flex flex-col min-h-screen bg-beige-50 relative selection:bg-purple-200 selection:text-purple-900">
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#5A2A6C',
            color: '#fff',
            borderRadius: '16px',
            marginTop: '60px',
          },
        }} 
      />

      <TopNav cartItemCount={cartItemCount} />

      {/* On home page: no top padding (home has its own full-screen header) */}
      {/* On other pages: add top padding to clear the fixed navbar */}
      <main className={`flex-1 w-full max-w-7xl mx-auto pb-24 md:pb-8 relative ${
        pathname === '/' ? '' : 'pt-16 md:pt-28'
      }`}>
        <div className="hidden md:block absolute top-[10%] left-[5%] w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none -z-10"></div>
        <div className="hidden md:block absolute top-[40%] right-[10%] w-80 h-80 bg-gold-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none -z-10"></div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav cartItemCount={cartItemCount} />
    </div>
  );
};

export default ClientLayout;
