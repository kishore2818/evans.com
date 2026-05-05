import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from '@/router-shim';
import { Home, Grid, ShoppingBag, User, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';

const TopNav = ({ cartItemCount }) => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/products' },
  ];

  return (
    <header 
      className={`hidden md:flex fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-md py-3' 
          : 'bg-white/60 backdrop-blur-md py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 w-full flex justify-between items-center">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center space-x-3 group whitespace-nowrap">
          <div className="w-10 h-10 overflow-hidden rounded-full border-2 border-purple-100 shadow-md transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
            <img src="/images/logo.jpg" alt="Evans Luxe Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-xl font-bold tracking-tight text-purple-900 group-hover:text-purple-700 transition-colors">
              Evans Luxe
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-500">
              Beauty
            </span>
          </div>
        </Link>
        
        {/* Main Links */}
        <nav className="flex items-center space-x-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-bold text-base transition-colors pb-1 group ${
                  isActive ? 'text-purple-900' : 'text-gray-500 hover:text-purple-700'
                }`}
              >
                {link.name}
                {/* Active underline */}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-purple-700 rounded-full transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-6">
          <Link 
            to="/profile" 
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-700 transition-colors group"
          >
            <div className="w-9 h-9 rounded-full bg-beige-100 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
              <User size={20} strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold text-gray-600 group-hover:text-purple-700 transition-colors">
              {user ? user.username?.split(' ')[0] : 'Account'}
            </span>
          </Link>

          <Link to="/cart" className="relative flex items-center space-x-2 text-gray-600 hover:text-purple-700 transition-colors group">
            <div className="w-9 h-9 rounded-full bg-beige-100 flex items-center justify-center group-hover:bg-purple-100 transition-colors relative">
              <ShoppingBag size={20} strokeWidth={2} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-purple-700 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </div>
            <span className="text-sm font-semibold text-gray-600 group-hover:text-purple-700 transition-colors">
              Bag
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

const BottomNav = ({ cartItemCount }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/products', icon: Grid },
    { name: 'Cart', path: '/cart', icon: ShoppingBag, badge: cartItemCount },
    { name: 'Profile', path: '/profile', icon: User },

  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-beige-200 px-6 py-3 pb-8 z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <nav className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
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

const Layout = () => {
  const location = useLocation();
  const cart = useStore((state) => state.cart);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-beige-50 relative selection:bg-purple-200 selection:text-purple-900">
      <Toaster 
        position={typeof window !== 'undefined' && window.innerWidth < 768 ? "top-center" : "top-right"} 
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

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto md:pt-28 pb-24 md:pb-8 relative">
        {/* Abstract Leaf Decoration for Desktop */}
        <div className="hidden md:block absolute top-[10%] left-[5%] w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none -z-10"></div>
        <div className="hidden md:block absolute top-[40%] right-[10%] w-80 h-80 bg-gold-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none -z-10"></div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={location.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>


      <BottomNav cartItemCount={cartItemCount} />
    </div>
  );
};

export default Layout;
