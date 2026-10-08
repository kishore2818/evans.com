'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Home, 
  Grid, 
  ShoppingBag, 
  User, 
  X, 
  ChevronRight, 
  Sparkles, 
  Heart, 
  Search, 
  Percent,
  Truck,
  ShieldCheck,
  Phone,
  FileText,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import FlashSaleBanner from './FlashSaleBanner';
import CartDrawer from './CartDrawer';
import Footer from './Footer';
import PolicyModal from './PolicyModal';
import OfferPopup from './OfferPopup';
import API_BASE_URL from '@/config/api';
import { io } from 'socket.io-client';

/* ─────────────────────────────────────────
   TOP NAV — Purplle-Style 2-Tier Header
───────────────────────────────────────── */
const TopNav = ({ cartItemCount, wishlistCount, onOpenPolicy }) => {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const prevCount = useRef(cartItemCount);
  const [cartBounce, setCartBounce] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
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

  const categoryTabs = [
    { name: 'All Products', path: '/products' },
    { name: 'Artisan Soaps', path: '/products?category=Soaps' },
    { name: 'Face Wash', path: '/products?category=Face%20Wash' },
    { name: 'Radiance Serums', path: '/products?category=Serums' },
    { name: 'Face Creams', path: '/products?category=Creams' },
    { name: 'Hair Care', path: '/products?category=Hair%20Care' },
    { name: '⚡ Flash Deals', path: '/products?sale=true', isSale: true },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? 'shadow-[0_4px_20px_rgba(62,29,74,0.10)] bg-white/95 backdrop-blur-xl'
            : 'bg-white/95 backdrop-blur-md'
        } border-b border-purple-100/70`}
      >
        {/* ── TIER 1: Main Header Row ── */}
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 flex items-center justify-between gap-2.5 sm:gap-6">
          
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden w-9 h-9 rounded-full bg-purple-50 text-purple-900 flex items-center justify-center flex-shrink-0"
            aria-label="Open navigation menu"
          >
            <div className="space-y-1 w-4 flex flex-col items-center">
              <span className="block w-4 h-0.5 bg-purple-900 rounded-full" />
              <span className="block w-3.5 h-0.5 bg-purple-600 rounded-full" />
              <span className="block w-4 h-0.5 bg-purple-900 rounded-full" />
            </div>
          </button>

          {/* Logo & Brand Name (Evans Luxe Beauty) */}
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group whitespace-nowrap min-w-0">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="relative w-8 h-8 sm:w-10 sm:h-10 p-[2px] rounded-full bg-gradient-to-tr from-gold-500 via-amber-200 to-gold-400 shadow-[0_0_12px_rgba(212,175,55,0.45)] group-hover:shadow-[0_0_18px_rgba(212,175,55,0.7)] transition-all shrink-0"
            >
              <div className="w-full h-full rounded-full overflow-hidden border border-purple-950/30 relative">
                <Image src="/images/logo.jpg" alt="Evans Luxe Beauty" fill sizes="40px" className="object-cover" priority />
              </div>
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-base sm:text-xl font-bold tracking-tight text-purple-900 group-hover:text-purple-700 transition-colors">
                Evans Luxe Beauty
              </span>
              <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] text-gold-600 mt-0.5">
                evansluxebeauty
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar (Purplle-Style) */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-2">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder="Search for serums, soaps, face wash..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-20 py-2 rounded-full text-xs bg-purple-50/70 border border-purple-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 transition-all"
              />
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-500" />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={13} />
                </button>
              ) : null}
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-purple-900 text-gold-300 font-bold text-[10px] uppercase tracking-wider rounded-full hover:bg-purple-950 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden w-8 h-8 rounded-full bg-purple-50 text-purple-800 flex items-center justify-center"
              aria-label="Toggle search input"
            >
              <Search size={16} />
            </button>

            {/* Offers / Deals Chip (Desktop) */}
            <Link
              href="/products?sale=true"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100 text-purple-900 border border-purple-200 hover:border-purple-300 transition-all group"
            >
              <Percent size={13} className="text-pink-600 group-hover:rotate-12 transition-transform" />
              <span className="text-[11px] font-bold">Mega Offers</span>
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/profile/wishlist"
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 flex items-center justify-center transition-colors"
              title="My Wishlist"
            >
              <Heart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-[18px] h-[18px] min-w-[18px] rounded-full flex items-center justify-center shadow-sm leading-none aspect-square shrink-0">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart / Bag Icon */}
            <button
              onClick={() => useStore.getState().openCart()}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-purple-900 hover:bg-purple-950 text-gold-300 flex items-center justify-center transition-all shadow-sm active:scale-95"
              aria-label="Open beauty bag"
            >
              <motion.div animate={cartBounce ? { scale: [1, 1.3, 0.9, 1.1, 1] } : {}} transition={{ duration: 0.5 }}>
                <ShoppingBag size={17} strokeWidth={2.2} />
              </motion.div>
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-gold-500 via-amber-300 to-gold-400 text-purple-950 text-[10px] font-black w-[18px] h-[18px] min-w-[18px] rounded-full flex items-center justify-center shadow-md leading-none aspect-square shrink-0">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>

            {/* Profile / Account Icon */}
            <Link
              href="/profile"
              className="hidden sm:flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 transition-colors"
              title="My Account"
            >
              <User size={18} strokeWidth={2} />
            </Link>
          </div>
        </div>

        {/* ── Mobile Search Dropdown Row ── */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden px-4 pb-3 border-t border-purple-50 overflow-hidden bg-white"
            >
              <form onSubmit={handleSearchSubmit} className="relative pt-2">
                <input
                  type="text"
                  placeholder="Search serums, soaps, face wash..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-9 pr-16 py-2 rounded-xl text-xs bg-purple-50/80 border border-purple-200 text-gray-800 focus:outline-none focus:border-purple-600"
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pt-1 text-purple-600" />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 pt-1 px-3 py-1 bg-purple-900 text-white font-bold text-[10px] rounded-lg"
                >
                  Go
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── TIER 2: Category Quick Bar (Desktop) ── */}
        <div className="hidden md:block bg-gradient-to-r from-purple-50/50 via-white to-purple-50/50 border-t border-purple-100/60 py-1.5 px-4 lg:px-8">
          <nav className="max-w-7xl mx-auto flex items-center justify-center space-x-6 lg:space-x-8 text-xs font-semibold overflow-x-auto no-scrollbar">
            {categoryTabs.map((tab) => {
              const isActive = pathname === tab.path || (tab.path !== '/products' && pathname.startsWith(tab.path));
              return (
                <Link
                  key={tab.name}
                  href={tab.path}
                  className={`py-1 transition-all whitespace-nowrap flex items-center space-x-1 ${
                    tab.isSale
                      ? 'text-pink-600 font-black hover:text-pink-700'
                      : isActive
                      ? 'text-purple-900 font-extrabold border-b-2 border-purple-900'
                      : 'text-gray-600 hover:text-purple-900'
                  }`}
                >
                  <span>{tab.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── Mobile Side Drawer Menu (Purplle-Style) ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-sm z-[80] md:hidden flex flex-col bg-white overflow-hidden shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="p-5 bg-gradient-to-r from-purple-950 via-purple-900 to-purple-950 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative w-10 h-10 p-[2px] rounded-full bg-gradient-to-tr from-gold-500 via-amber-200 to-gold-400">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <Image src="/images/logo.jpg" alt="Logo" fill sizes="40px" className="object-cover" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold leading-tight">Evans Luxe Beauty</h3>
                    <p className="text-[9px] text-gold-300 font-bold uppercase tracking-widest">evansluxebeauty</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* User quick status */}
                <div className="p-3 bg-purple-50 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-purple-900 text-gold-300 flex items-center justify-center text-xs font-bold">
                      {user ? user.username?.[0]?.toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-purple-950">
                        {user ? user.username : 'Welcome, Guest'}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {user ? user.email : 'Log in to view orders & points'}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[10px] font-bold text-purple-800 uppercase underline"
                  >
                    {user ? 'Account' : 'Login'}
                  </Link>
                </div>

                {/* Categories */}
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 py-1">
                    Shop Categories
                  </p>
                  {categoryTabs.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 text-xs font-semibold text-gray-800 transition-colors"
                    >
                      <span className={cat.isSale ? 'text-pink-600 font-bold' : ''}>{cat.name}</span>
                      <ChevronRight size={14} className="text-gray-400" />
                    </Link>
                  ))}
                </div>

                {/* Customer Care & Policies */}
                <div className="pt-3 border-t border-gray-100 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2 py-1">
                    Customer Care & Policies
                  </p>
                  <Link
                    href="/profile/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 text-xs font-semibold text-gray-800"
                  >
                    <span className="flex items-center space-x-2">
                      <Truck size={14} className="text-purple-700" />
                      <span>Track Orders</span>
                    </span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 text-xs font-semibold text-gray-800"
                  >
                    <span className="flex items-center space-x-2">
                      <Phone size={14} className="text-purple-700" />
                      <span>Contact Us & Store Location</span>
                    </span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onOpenPolicy) onOpenPolicy('privacy');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 text-xs font-semibold text-gray-800 text-left"
                  >
                    <span className="flex items-center space-x-2">
                      <ShieldCheck size={14} className="text-purple-700" />
                      <span>Privacy & Legal Policies</span>
                    </span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onOpenPolicy) onOpenPolicy('returns');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50 text-xs font-semibold text-gray-800 text-left"
                  >
                    <span className="flex items-center space-x-2">
                      <RotateCcw size={14} className="text-purple-700" />
                      <span>Returns & Replacements</span>
                    </span>
                    <ChevronRight size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Drawer Tagline */}
              <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  Evans Luxe Beauty • 100% Organic Botanical Care
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

/* ─────────────────────────────────────────
   BOTTOM NAV — Purplle-Style Crystal Clear Dock
───────────────────────────────────────── */
const BottomNav = ({ cartItemCount, wishlistCount = 0 }) => {
  const pathname = usePathname();
  const isPDP = pathname.startsWith('/products/') && pathname !== '/products';

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/products', icon: Grid },
    { name: 'Deals', path: '/products?sale=true', icon: Percent, isOffer: true },
    { name: 'Wishlist', path: '/profile/wishlist', icon: Heart, badge: wishlistCount, badgeColor: '#ef4444' },
    { name: 'Bag', path: '/cart', icon: ShoppingBag, badge: cartItemCount },
  ];

  if (isPDP) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-2.5 px-3 pointer-events-none">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="pointer-events-auto w-full max-w-md"
        style={{
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          borderRadius: '9999px',
          border: '1px solid rgba(90, 42, 108, 0.12)',
          boxShadow: '0 8px 32px rgba(62, 29, 74, 0.18), 0 2px 8px rgba(62, 29, 74, 0.08)',
          padding: '5px 8px',
        }}
      >
        <nav className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = item.isOffer 
              ? pathname.includes('sale=true')
              : pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.path}
                className="relative flex flex-col items-center justify-center flex-1 py-1"
              >
                <motion.div
                  whileTap={{ scale: 0.86 }}
                  className={`relative flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'w-11 h-9 rounded-full'
                      : 'w-9 h-9 rounded-full'
                  }`}
                  style={isActive ? {
                    background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)',
                    boxShadow: '0 3px 12px rgba(90,42,108,0.4)',
                  } : {}}
                >
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.6 : 2}
                    className={isActive ? 'text-gold-300' : 'text-gray-500'}
                    fill={item.name === 'Wishlist' && item.badge > 0 && !isActive ? 'rgba(239,68,68,0.2)' : 'transparent'}
                  />

                  {/* Badge */}
                  {item.badge > 0 && (
                    <motion.span
                      key={item.badge}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-sm"
                      style={{
                        background: item.badgeColor || 'linear-gradient(135deg, #D4AF37, #edc757)',
                        width: '15px',
                        height: '15px',
                      }}
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </motion.span>
                  )}

                  {/* Offer Mini Dot */}
                  {item.isOffer && !isActive && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                  )}
                </motion.div>

                {/* Label */}
                <span
                  className={`text-[9px] font-bold tracking-tight mt-0.5 whitespace-nowrap transition-colors ${
                    isActive ? 'text-purple-900 font-extrabold' : 'text-gray-500'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </motion.div>
    </div>
  );
};

/* ─────────────────────────────────────────
   CLIENT LAYOUT — Root Wrapper
───────────────────────────────────────── */
const ClientLayout = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const localWishlist = useStore((state) => state.localWishlist);
  const fetchStoreSettings = useStore((state) => state.fetchStoreSettings);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = localWishlist.length;

  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [selectedPolicyTab, setSelectedPolicyTab] = useState('privacy');

  const handleOpenPolicy = (tab = 'privacy') => {
    setSelectedPolicyTab(tab);
    setIsPolicyOpen(true);
  };

  useEffect(() => {
    fetchStoreSettings();

    try {
      const socket = io(API_BASE_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true
      });

      const handleUpdate = (newSettings) => {
        if (newSettings) {
          useStore.setState((prev) => ({
            storeSettings: {
              ...prev.storeSettings,
              ...newSettings,
              shippingFee: newSettings.shippingFee !== undefined ? Number(newSettings.shippingFee) : prev.storeSettings?.shippingFee,
              freeShippingThreshold: newSettings.freeShippingThreshold !== undefined ? Number(newSettings.freeShippingThreshold) : prev.storeSettings?.freeShippingThreshold,
            }
          }));
        }
        fetchStoreSettings();
      };

      const handleProductUpdate = () => {
        router.refresh();
      };

      socket.on('settingsUpdated', handleUpdate);
      socket.on('store_settings_update', handleUpdate);
      socket.on('productUpdated', handleProductUpdate);
      socket.on('product_update', handleProductUpdate);
      socket.on('products_updated', handleProductUpdate);

      return () => socket.disconnect();
    } catch (e) {
      // fallback
    }
  }, [fetchStoreSettings, router]);

  return (
    <div className="flex flex-col min-h-screen bg-[#faf6fc] relative selection:bg-purple-200 selection:text-purple-900">
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

      <FlashSaleBanner />
      <TopNav cartItemCount={cartItemCount} wishlistCount={wishlistCount} onOpenPolicy={handleOpenPolicy} />
      <CartDrawer />

      {/* Subtle ambient lavender/gold background orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="orb absolute w-[650px] h-[650px] bg-purple-100 top-[-10%] left-[-10%] opacity-40" />
        <div className="orb absolute w-[450px] h-[450px] bg-gold-100 top-[40%] right-[-8%] opacity-35" style={{ animationDelay: '3s' }} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto pb-20 md:pb-12 pt-0 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* End-to-End Purplle-Style Footer */}
      <Footer onOpenPolicy={handleOpenPolicy} />

      {/* Interactive Policy Modal */}
      <PolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        initialTab={selectedPolicyTab}
      />

      {/* Purplle-Style Offer Popup & Floating Trigger ("pop tiger") */}
      <OfferPopup />

      {/* Fixed Mobile Bottom Nav */}
      <BottomNav cartItemCount={cartItemCount} wishlistCount={wishlistCount} />
    </div>
  );
};

export default ClientLayout;
