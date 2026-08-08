'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Home, Grid, ShoppingBag, User, X, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';

/* ─────────────────────────────────────────
   TOP NAV — Glassmorphism header
───────────────────────────────────────── */
const TopNav = ({ cartItemCount }) => {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const prevCount = useRef(cartItemCount);
  const [cartBounce, setCartBounce] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cartItemCount !== prevCount.current && cartItemCount > prevCount.current) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 600);
    }
    prevCount.current = cartItemCount;
  }, [cartItemCount]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/products' },
    { name: 'Contact Us', path: '/contact' },
  ];

  // Don't render on home page – it has its own header
  if (pathname === '/') return null;

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'py-2 shadow-nav'
            : 'py-3'
        }`}
        style={{
          background: scrolled
            ? 'rgba(255,255,255,0.88)'
            : 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: scrolled ? '1px solid rgba(90,42,108,0.08)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 group whitespace-nowrap min-h-[48px]">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 6 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="relative w-8 h-8 md:w-10 md:h-10 overflow-hidden rounded-full shadow-luxury"
              style={{ border: '2px solid rgba(212,175,55,0.3)' }}
            >
              <Image src="/images/logo.jpg" alt="Evans Luxe Logo" fill sizes="40px" className="object-cover" priority />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg md:text-xl font-bold tracking-tight text-purple-900 group-hover:text-purple-700 transition-colors">
                Evans Luxe
              </span>
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-gold-500">
                Beauty
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`relative font-semibold text-sm transition-colors pb-1.5 group min-h-[48px] flex items-center ${
                    isActive ? 'text-purple-900' : 'text-gray-500 hover:text-purple-800'
                  }`}
                >
                  {link.name}
                  <motion.span
                    className="absolute bottom-0 left-0 h-0.5 rounded-full"
                    style={{ background: 'linear-gradient(90deg, #D4AF37, #edc757)' }}
                    initial={false}
                    animate={{ width: isActive ? '100%' : '0%' }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Profile */}
            <Link
              href="/profile"
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-900 transition-all group min-h-[48px] min-w-[36px]"
              title="My Account"
            >
              <motion.div whileHover={{ scale: 1.15 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                <User size={19} strokeWidth={2} />
              </motion.div>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative flex items-center justify-center min-h-[48px] px-1">
              <motion.div
                animate={cartBounce ? { scale: [1, 1.3, 0.9, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center text-purple-700 hover:bg-purple-100 hover:text-purple-900 transition-all relative"
              >
                <ShoppingBag size={19} strokeWidth={2} />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.span
                      key={cartItemCount}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="absolute -top-1.5 -right-1.5 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm"
                      style={{
                        background: 'linear-gradient(135deg, #5A2A6C, #8540b0)',
                        width: '18px',
                        height: '18px',
                        fontSize: '9px',
                      }}
                    >
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* Mobile hamburger – custom 3-line icon */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 min-h-[48px] min-w-[48px] space-y-1.5 text-purple-900"
              aria-label="Open menu"
            >
              <span className="block w-6 h-0.5 bg-purple-900 rounded-full" />
              <span className="block w-4 h-0.5 bg-purple-600 rounded-full" />
              <span className="block w-5 h-0.5 bg-purple-900 rounded-full" />
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Drawer Menu ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm z-[70] md:hidden flex flex-col overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, #2d0e3d 0%, #3e1d4a 60%, #5A2A6C 100%)',
              }}
            >
              {/* Orb decorations */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)', filter: 'blur(40px)' }} />
              <div className="absolute bottom-20 left-0 w-40 h-40 rounded-full opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #8540b0 0%, transparent 70%)', filter: 'blur(50px)' }} />

              <div className="relative z-10 p-8 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 overflow-hidden rounded-full border border-gold-400/40 shadow-gold">
                      <Image src="/images/logo.jpg" alt="Logo" fill sizes="40px" className="object-cover" />
                    </div>
                    <div>
                      <span className="font-serif text-lg font-bold text-white block leading-none">Evans Luxe</span>
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold-400">Beauty</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all min-h-[48px] min-w-[48px]"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-col space-y-1">
                  {[...navLinks, { name: 'My Account', path: '/profile' }].map((link, i) => {
                    const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.4 }}
                      >
                        <Link
                          href={link.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center justify-between py-4 px-4 rounded-2xl font-semibold text-base transition-all min-h-[56px] ${
                            isActive
                              ? 'bg-white/10 text-gold-300 border border-white/10'
                              : 'text-white/80 hover:text-white hover:bg-white/8'
                          }`}
                        >
                          <span>{link.name}</span>
                          <ChevronRight size={18} className={isActive ? 'text-gold-300' : 'text-white/30'} />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Footer tagline */}
                <div className="mt-auto pt-8 border-t border-white/10">
                  <div className="flex items-center space-x-2 mb-3">
                    <Sparkles size={14} className="text-gold-400" />
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Evans Luxe Beauty</p>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed italic">"Inspired by nature, perfected by science."</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/* ─────────────────────────────────────────
   BOTTOM NAV — Floating pill design
───────────────────────────────────────── */
const BottomNav = ({ cartItemCount, wishlistCount = 0 }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/products', icon: Grid },
    { name: 'Wishlist', path: '/profile/wishlist', icon: Heart, badge: wishlistCount, badgeColor: '#ef4444' },
    { name: 'Cart', path: '/cart', icon: ShoppingBag, badge: cartItemCount },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4 pointer-events-none">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
        className="pointer-events-auto"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
          borderRadius: '9999px',
          border: '1px solid rgba(255,255,255,0.9)',
          boxShadow: '0 8px 32px rgba(62,29,74,0.18), 0 2px 8px rgba(62,29,74,0.1)',
          padding: '8px 12px',
        }}
      >
        <nav className="flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.path}
                className="relative flex flex-col items-center"
              >
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className={`relative flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'w-12 h-10 rounded-full'
                      : 'w-10 h-10 rounded-full'
                  }`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)',
                    boxShadow: '0 4px 16px rgba(90,42,108,0.4)',
                  } : {}}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-glow"
                      className="absolute inset-0 rounded-full opacity-40"
                      style={{
                        background: 'radial-gradient(circle, rgba(212,175,55,0.6) 0%, transparent 70%)',
                        filter: 'blur(6px)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? 'text-gold-300 relative z-10' : 'text-gray-400'}
                    fill={item.name === 'Wishlist' && item.badge > 0 && !isActive ? 'rgba(239,68,68,0.25)' : 'transparent'}
                  />
                  {/* Badge */}
                  {item.badge > 0 && (
                    <motion.span
                      key={item.badge}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="absolute -top-1 -right-1 text-white text-[8px] font-black rounded-full flex items-center justify-center z-20"
                      style={{
                        background: item.badgeColor || 'linear-gradient(135deg, #D4AF37, #edc757)',
                        width: '15px',
                        height: '15px',
                      }}
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </motion.span>
                  )}
                </motion.div>
                {/* Label */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-[8px] font-bold uppercase tracking-widest text-purple-800 mt-0.5 whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </motion.div>
    </div>
  );
};




/* ─────────────────────────────────────────
   CLIENT LAYOUT — Root wrapper
───────────────────────────────────────── */
const ClientLayout = ({ children }) => {
  const pathname = usePathname();
  const cart = useStore((state) => state.cart);
  const localWishlist = useStore((state) => state.localWishlist);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = localWishlist.length;

  return (
    <div className="flex flex-col min-h-screen bg-beige-50 relative selection:bg-purple-200 selection:text-purple-900">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)',
            color: '#fff',
            borderRadius: '16px',
            marginTop: '64px',
            boxShadow: '0 8px 32px rgba(62,29,74,0.3)',
            border: '1px solid rgba(255,255,255,0.12)',
            fontWeight: '600',
            fontSize: '13px',
          },
        }}
      />

      <TopNav cartItemCount={cartItemCount} />

      {/* Background orbs — ambient decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="orb absolute w-[600px] h-[600px] bg-purple-100 top-[-10%] left-[-10%] opacity-40" />
        <div className="orb absolute w-[400px] h-[400px] bg-gold-100 top-[40%] right-[-8%] opacity-30"
          style={{ animationDelay: '3s' }} />
      </div>

      {/* Main content */}
      <main className={`flex-1 w-full max-w-7xl mx-auto pb-28 md:pb-10 relative ${
        pathname === '/' ? '' : 'pt-16 md:pt-28'
      }`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav cartItemCount={cartItemCount} wishlistCount={wishlistCount} />
    </div>
  );
};

export default ClientLayout;
