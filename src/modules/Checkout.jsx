'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  ShoppingBag, 
  CreditCard, 
  CheckCircle2, 
  Plus, 
  Home, 
  Briefcase, 
  ArrowLeft,
  Loader2,
  Package,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  User,
  Phone,
  FileText
} from 'lucide-react';
import { useNavigate, Link } from '@/router-shim';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import Image from 'next/image';
import toast from 'react-hot-toast';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, placeOrder, createRazorpayOrder, verifyPayment, storeSettings, fetchStoreSettings } = useStore();
  const { user, token, fetchProfile, addAddress, loading: authLoading } = useAuthStore();

  const [activeStep, setActiveStep] = useState(1); // 1: Address, 2: Summary, 3: Payment
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    isDefault: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePincodeChange = async (e) => {
    const value = e.target.value;
    setNewAddress(prev => ({ ...prev, pincode: value }));
    
    if (value.length === 6 && /^\d+$/.test(value)) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await response.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          const exactCity = postOffice.Block && postOffice.Block !== "NA" ? postOffice.Block : postOffice.Name;
          setNewAddress(prev => ({
            ...prev,
            city: exactCity
          }));
          toast.success(`Location auto-filled for ${value}`);
        } else {
          toast.error('Invalid Pincode');
        }
      } catch (error) {
        console.error('Error fetching pincode details:', error);
      }
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/auth', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    fetchProfile();
  }, [token, navigate, fetchProfile]);

  useEffect(() => {
    if (cart.length === 0 && activeStep < 4) {
      navigate('/cart');
    }
  }, [cart, navigate, activeStep]);

  useEffect(() => {
    fetchStoreSettings();
  }, [fetchStoreSettings]);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * (1 - (item.discountPercentage || 0) / 100)) * item.quantity, 0);
  const threshold = storeSettings?.freeShippingThreshold ?? 2000;
  const fee = storeSettings?.shippingFee ?? 150;
  const shippingCost = subtotal > threshold ? 0 : fee;
  const totalAmount = subtotal > 0 ? subtotal + shippingCost : 0;

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(newAddress);
      setIsAddingAddress(false);
      setNewAddress({ name: '', phone: '', address: '', city: '', pincode: '', isDefault: false });
      toast.success('Address saved successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (user.addresses.length === 0) {
      toast.error('Please add a delivery address');
      return;
    }

    setIsSubmitting(true);
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setIsSubmitting(false);
        return;
      }

      const razorpayOrder = await createRazorpayOrder(totalAmount);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Evans Luxe',
        description: 'Secure Payment for order',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            const orderData = {
              items: cart.map(item => ({
                product: item.id || item._id,
                name: item.name,
                image: item.image || item.images?.[0] || '/images/placeholder.png',
                price: item.price * (1 - (item.discountPercentage || 0) / 100),
                quantity: item.quantity
              })),
              totalAmount,
              shippingAddress: user.addresses[selectedAddressIndex],
              paymentStatus: 'paid',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            };

            await placeOrder(orderData);
            clearCart();
            setActiveStep(4);
            toast.success('Order placed successfully!');
          } catch (err) {
            toast.error(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.addresses[selectedAddressIndex]?.phone,
          ...(upiId ? { vpa: upiId } : {})
        },
        theme: {
          color: '#3e1d4a'
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'UPI / Popular Apps',
                instruments: [{ method: 'upi' }]
              }
            },
            sequence: ['block.upi'],
            preferences: {
              show_default_blocks: true
            }
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        toast.error(response.error.description || 'Payment Failed');
      });
      paymentObject.open();

    } catch (error) {
      toast.error(error.message || 'Failed to initiate payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-purple-900" size={40} />
          <p className="text-xs font-black uppercase tracking-widest text-purple-500">Loading rituals</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige-50 pb-28 pt-6 relative overflow-hidden">
      
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="orb absolute w-[500px] h-[500px] bg-purple-100/40 top-[-5%] left-[-5%] opacity-40" />
        <div className="orb absolute w-[400px] h-[400px] bg-gold-100/30 bottom-[-5%] right-[-5%] opacity-30" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* Header Title */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-purple-900 mb-2">Secure checkout</h1>
          <p className="text-gray-400 text-sm font-medium">Verify details and finalize your botanical package</p>
        </div>

        {/* Elegant Progress Tracker */}
        {activeStep < 4 && (
          <div className="relative mb-12 max-w-xl mx-auto">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 rounded-full overflow-hidden">
              <motion.div 
                className="h-full"
                style={{ background: 'linear-gradient(90deg, #3e1d4a, #D4AF37)' }}
                initial={{ width: '0%' }}
                animate={{ width: `${((activeStep - 1) / 2) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="flex justify-between items-center relative z-10">
              {[
                { id: 1, label: 'Delivery', icon: MapPin },
                { id: 2, label: 'Summary', icon: ShoppingBag },
                { id: 3, label: 'Payment', icon: CreditCard }
              ].map((s) => {
                const isCompleted = activeStep > s.id;
                const isActive = activeStep === s.id;
                return (
                  <div key={s.id} className="flex flex-col items-center">
                    <motion.div
                      animate={{ scale: isActive ? 1.12 : 1 }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-purple-900 text-gold-400 shadow-luxury border border-gold-400/30' 
                          : isActive 
                            ? 'bg-gradient-to-r from-purple-900 to-purple-800 text-white shadow-luxury ring-4 ring-purple-100' 
                            : 'bg-white text-gray-400 border border-beige-200'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 size={16} /> : <s.icon size={16} />}
                    </motion.div>
                    <span className={`text-[9px] mt-2.5 font-black uppercase tracking-[0.18em] ${isActive ? 'text-purple-900' : 'text-gray-400'}`}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
          
          {/* Main Steps Content */}
          <div className="lg:col-span-6 space-y-5">
            <AnimatePresence mode="wait">
              {activeStep === 4 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                  className="bg-white rounded-[2.5rem] p-10 md:p-14 text-center shadow-luxury border border-beige-100/60 flex flex-col items-center relative overflow-hidden"
                >
                  {/* Confetti decoration / Ambient glow */}
                  <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-purple-900 via-gold-400 to-purple-900" />
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-luxury"
                    style={{ background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)', border: '2px solid rgba(212,175,55,0.4)' }}
                  >
                    <Package size={34} className="text-gold-400 animate-bounce" />
                  </motion.div>

                  <h2 className="font-serif text-3xl font-bold text-purple-900 mb-2">Order Confirmed!</h2>
                  <p className="text-gray-400 text-sm max-w-sm mb-10 leading-relaxed font-medium">
                    Your luxury botanicals are officially locked. We will send updates to your registered email.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button 
                      onClick={() => navigate('/profile?tab=orders')}
                      className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-luxury hover:opacity-90 active:scale-95 transition-all min-h-0 min-w-0"
                      style={{ background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)' }}
                    >
                      Track My Rituals
                    </button>
                    <button 
                      onClick={() => navigate('/')}
                      className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-purple-900 border border-purple-200 bg-white hover:bg-beige-50 active:scale-95 transition-all min-h-0 min-w-0"
                    >
                      Back to Gallery
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-5">
                  
                  {/* ════ STEP 1: DELIVERY ADDRESS ════ */}
                  <motion.div 
                    layout
                    className={`bg-white rounded-[2.5rem] overflow-hidden border transition-all duration-300 ${
                      activeStep === 1 
                        ? 'border-purple-200/80 shadow-luxury' 
                        : 'border-beige-100 shadow-sm opacity-50'
                    }`}
                  >
                    <div 
                      className="p-6 md:p-8 flex justify-between items-center cursor-pointer select-none"
                      onClick={() => setActiveStep(1)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${activeStep === 1 ? 'bg-purple-900 text-white' : 'bg-beige-100 text-purple-900'}`}>
                          1
                        </div>
                        <h3 className="font-serif text-lg md:text-xl font-bold text-purple-900">Delivery details</h3>
                      </div>
                      {activeStep > 1 && (
                        <span className="text-[10px] text-purple-600 font-bold uppercase tracking-widest border-b border-purple-200">Change</span>
                      )}
                    </div>

                    <AnimatePresence>
                      {activeStep === 1 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 md:px-8 pb-8 overflow-hidden"
                        >
                          <div className="grid grid-cols-1 gap-4 mb-6">
                            {user.addresses?.map((addr, idx) => (
                              <div 
                                key={idx}
                                onClick={() => setSelectedAddressIndex(idx)}
                                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-4 ${
                                  selectedAddressIndex === idx 
                                    ? 'border-purple-900 bg-purple-50/20' 
                                    : 'border-beige-100 hover:border-purple-100 bg-white'
                                }`}
                              >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                  selectedAddressIndex === idx ? 'border-purple-900' : 'border-gray-300'
                                }`}>
                                  {selectedAddressIndex === idx && <div className="w-2.5 h-2.5 bg-purple-900 rounded-full" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2.5 mb-1.5 flex-wrap gap-y-1">
                                    <span className="font-bold text-gray-900 text-sm truncate">{addr.name}</span>
                                    <span className="text-[8px] font-black tracking-widest uppercase bg-gold-400/10 text-gold-600 px-2 py-0.5 rounded-full">
                                      {addr.isDefault ? 'Primary' : 'Saved'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 mb-1 leading-relaxed">{addr.address}</p>
                                  <p className="text-xs font-semibold text-gray-700 mb-2">{addr.city} · {addr.pincode}</p>
                                  <div className="flex items-center space-x-1 text-gray-400">
                                    <Phone size={10} />
                                    <span className="text-[10px] font-bold tracking-widest">{addr.phone}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {isAddingAddress ? (
                            <motion.form 
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              onSubmit={handleAddAddress}
                              className="bg-beige-50/40 border border-beige-100 rounded-3xl p-5 space-y-4"
                            >
                              <h4 className="font-serif text-sm font-bold text-purple-900 flex items-center gap-2">
                                <Plus size={14} /> Add new address
                              </h4>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <input 
                                  placeholder="Full Name *"
                                  required
                                  value={newAddress.name}
                                  onChange={e => setNewAddress({...newAddress, name: e.target.value})}
                                  className="col-span-2 w-full px-5 py-3 rounded-xl border border-beige-200 focus:outline-none focus:border-gold-400 bg-white text-xs font-medium focus:ring-1 focus:ring-gold-400"
                                />
                                <input 
                                  placeholder="Phone Number *"
                                  required
                                  value={newAddress.phone}
                                  onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                                  className="w-full px-5 py-3 rounded-xl border border-beige-200 focus:outline-none focus:border-gold-400 bg-white text-xs font-medium focus:ring-1 focus:ring-gold-400"
                                />
                                <input 
                                  placeholder="Pincode *"
                                  required
                                  value={newAddress.pincode}
                                  onChange={handlePincodeChange}
                                  className="w-full px-5 py-3 rounded-xl border border-beige-200 focus:outline-none focus:border-gold-400 bg-white text-xs font-medium focus:ring-1 focus:ring-gold-400"
                                />
                                <textarea 
                                  placeholder="Flat, House no., Area, Street *"
                                  required
                                  rows={2}
                                  value={newAddress.address}
                                  onChange={e => setNewAddress({...newAddress, address: e.target.value})}
                                  className="col-span-2 w-full px-5 py-3 rounded-xl border border-beige-200 focus:outline-none focus:border-gold-400 bg-white text-xs font-medium focus:ring-1 focus:ring-gold-400"
                                />
                                <input 
                                  placeholder="City / District *"
                                  required
                                  value={newAddress.city}
                                  onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                  className="w-full px-5 py-3 rounded-xl border border-beige-200 focus:outline-none focus:border-gold-400 bg-white text-xs font-medium focus:ring-1 focus:ring-gold-400"
                                />
                                <label className="flex items-center space-x-2 cursor-pointer select-none">
                                  <input 
                                    type="checkbox" 
                                    checked={newAddress.isDefault}
                                    onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})}
                                    className="w-3.5 h-3.5 rounded text-purple-900 border-beige-300 focus:ring-0"
                                  />
                                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Set as default</span>
                                </label>
                              </div>

                              <div className="flex space-x-3 pt-2">
                                <button 
                                  type="submit"
                                  className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-purple-950 text-white hover:bg-purple-900 active:scale-95 transition-all min-h-0 flex-1"
                                >
                                  Save & Select
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => setIsAddingAddress(false)}
                                  className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider border border-beige-200 text-gray-500 bg-white hover:bg-beige-50 active:scale-95 transition-all min-h-0"
                                >
                                  Cancel
                                </button>
                              </div>
                            </motion.form>
                          ) : (
                            <button 
                              onClick={() => setIsAddingAddress(true)}
                              className="flex items-center space-x-2 text-purple-600 font-bold hover:text-purple-900 transition-colors group text-xs mt-2 min-h-0"
                            >
                              <Plus size={14} />
                              <span>Add a new delivery address</span>
                            </button>
                          )}

                          {user.addresses?.length > 0 && !isAddingAddress && (
                            <motion.button 
                              whileHover={{ scale: 1.01, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setActiveStep(2)}
                              className="w-full mt-8 bg-purple-900 text-gold-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-luxury min-h-0"
                              style={{ background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)', border: '1px solid rgba(255,255,255,0.08)' }}
                            >
                              Deliver to this address
                            </motion.button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* ════ STEP 2: SUMMARY ════ */}
                  <motion.div 
                    layout
                    className={`bg-white rounded-[2.5rem] overflow-hidden border transition-all duration-300 ${
                      activeStep === 2 
                        ? 'border-purple-200/80 shadow-luxury' 
                        : 'border-beige-100 shadow-sm opacity-50'
                    }`}
                  >
                    <div 
                      className="p-6 md:p-8 flex justify-between items-center cursor-pointer select-none"
                      onClick={() => activeStep >= 2 && setActiveStep(2)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${activeStep === 2 ? 'bg-purple-900 text-white' : 'bg-beige-100 text-purple-900'}`}>
                          2
                        </div>
                        <h3 className="font-serif text-lg md:text-xl font-bold text-purple-900">Order package</h3>
                      </div>
                    </div>

                    <AnimatePresence>
                      {activeStep === 2 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 md:px-8 pb-8 overflow-hidden"
                        >
                          <div className="divide-y divide-beige-100/60 mb-6 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
                            {cart.map((item) => {
                              const discPrice = item.price * (1 - (item.discountPercentage || 0) / 100);
                              return (
                                <div key={item.id} className="py-4 flex items-center space-x-4 first:pt-0 last:pb-0">
                                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-beige-50 border border-beige-100/60 flex-shrink-0 shadow-sm">
                                    <Image src={item.image || '/images/placeholder.png'} alt="" fill sizes="56px" className="object-cover" unoptimized />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="text-xs font-bold text-purple-900 leading-tight mb-1 truncate">{item.name}</h4>
                                    <div className="flex items-center space-x-2 text-[10px]">
                                      <span className="font-extrabold text-gray-900">₹{discPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                      <span className="text-gray-400 font-medium">Qty: {item.quantity}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          <motion.button 
                            whileHover={{ scale: 1.01, y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveStep(3)}
                            className="w-full bg-purple-900 text-gold-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-luxury min-h-0"
                            style={{ background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)', border: '1px solid rgba(255,255,255,0.08)' }}
                          >
                            Confirm summary
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* ════ STEP 3: PAYMENT OPTIONS ════ */}
                  <motion.div 
                    layout
                    className={`bg-white rounded-[2.5rem] overflow-hidden border transition-all duration-300 ${
                      activeStep === 3 
                        ? 'border-purple-200/80 shadow-luxury' 
                        : 'border-beige-100 shadow-sm opacity-50'
                    }`}
                  >
                    <div 
                      className="p-6 md:p-8 flex justify-between items-center cursor-pointer select-none"
                      onClick={() => activeStep >= 3 && setActiveStep(3)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${activeStep === 3 ? 'bg-purple-900 text-white' : 'bg-beige-100 text-purple-900'}`}>
                          3
                        </div>
                        <h3 className="font-serif text-lg md:text-xl font-bold text-purple-900">Secure Payment</h3>
                      </div>
                    </div>

                    <AnimatePresence>
                      {activeStep === 3 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 md:px-8 pb-8 overflow-hidden"
                        >
                          <div className="bg-gradient-to-r from-purple-50/40 to-white border border-purple-100 p-6 rounded-[2rem] mb-6 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                              <div className="flex items-center space-x-3.5">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-900">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-3" />
                                </div>
                                <div className="leading-tight">
                                  <h4 className="font-bold text-purple-900 text-sm mb-0.5">UPI & Online checkout</h4>
                                  <p className="text-[10px] text-gray-400 font-medium">Automatic redirect to secure banking gateway</p>
                                </div>
                              </div>
                              <div className="w-4 h-4 rounded-full border-4 border-purple-900 flex items-center justify-center flex-shrink-0" />
                            </div>
                            
                            {/* Payment Method Badges */}
                            <div className="grid grid-cols-3 gap-3 bg-white/70 backdrop-blur-md rounded-2xl p-3 border border-beige-100/60 shadow-sm mb-5">
                              <div className="flex flex-col items-center py-2.5 hover:bg-beige-50/50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-beige-100">
                                <div className="h-5 flex items-center justify-center mb-1 w-10">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="max-h-full max-w-full" />
                                </div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">GPay</span>
                              </div>
                              <div className="flex flex-col items-center py-2.5 hover:bg-beige-50/50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-beige-100">
                                <div className="h-5 flex items-center justify-center mb-1 w-10">
                                  <img src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png" alt="PhonePe" className="max-h-full max-w-full object-contain" />
                                </div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">PhonePe</span>
                              </div>
                              <div className="flex flex-col items-center py-2.5 hover:bg-beige-50/50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-beige-100">
                                <div className="h-5 flex items-center justify-center mb-1 w-10">
                                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="max-h-full max-w-full" />
                                </div>
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Paytm</span>
                              </div>
                            </div>

                            {/* VPA UPI Input */}
                            <div className="pt-4 border-t border-purple-100/60">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Optional UPI ID (VPA)</label>
                              <input 
                                type="text" 
                                placeholder="e.g. yourname@okaxis" 
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                className="w-full px-4 py-3.5 rounded-xl border border-beige-200 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 bg-white text-xs font-semibold shadow-sm transition-all text-purple-900"
                              />
                              <p className="text-[9px] text-gray-400 mt-2 font-medium">Entering VPA here will auto-fill your identifier securely inside the Razorpay gateway.</p>
                            </div>
                          </div>

                          {/* CTA Secure Pay Button */}
                          <motion.button 
                            whileHover={{ scale: 1.015, y: -2 }}
                            whileTap={{ scale: 0.985 }}
                            onClick={handlePlaceOrder}
                            disabled={isSubmitting}
                            className="w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center space-x-2.5 disabled:opacity-75 relative overflow-hidden group min-h-0"
                            style={{
                              background: 'linear-gradient(135deg, #D4AF37, #edc757)',
                              color: '#1a0a22',
                              boxShadow: '0 8px 32px rgba(212,175,55,0.4)',
                            }}
                          >
                            {/* Shiny sweeps */}
                            <div className="absolute inset-0 bg-white/30 group-hover:translate-x-full transition-transform duration-700 ease-in-out -translate-x-full skew-x-12" />
                            {isSubmitting ? (
                              <Loader2 className="animate-spin text-purple-950" size={20} />
                            ) : (
                              <>
                                <ShieldCheck size={20} className="text-purple-950" strokeWidth={2.5} />
                                <span className="text-purple-950 font-black">Pay ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })} securely</span>
                              </>
                            )}
                          </motion.button>
                          
                          <div className="flex items-center justify-center space-x-2.5 mt-5">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Secured via</span>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-3.5 opacity-60" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Pricing Summary Sidebar */}
          {activeStep < 4 && (
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <div 
                className="bg-white rounded-[2.5rem] p-7 border border-beige-100/60"
                style={{ boxShadow: '0 8px 32px rgba(90,42,108,0.06)' }}
              >
                <div className="flex items-center space-x-2 mb-6 border-b border-beige-100/60 pb-4">
                  <Sparkles size={16} className="text-gold-500" />
                  <h3 className="font-serif text-lg font-bold text-purple-900">Ritual Invoice</h3>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>Base package total</span>
                    <span className="font-extrabold text-gray-800">
                      ₹{cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  {cart.reduce((acc, item) => acc + (item.price * (item.discountPercentage / 100) * item.quantity), 0) > 0 && (
                    <div className="flex justify-between text-xs text-red-500 font-medium">
                      <span>Botanical savings</span>
                      <span className="font-extrabold">
                        -₹{cart.reduce((acc, item) => acc + (item.price * (item.discountPercentage / 100) * item.quantity), 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>Eco Shipping</span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-black uppercase tracking-wider text-[10px]">Free</span>
                    ) : (
                      <span className="font-extrabold text-gray-800">₹{shippingCost.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>

                <div className="pt-5 border-t border-dashed border-beige-200 flex justify-between items-center mb-6">
                  <span className="font-serif text-sm font-bold text-purple-950">Grand Total</span>
                  <span className="text-2xl font-black text-purple-900">₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>

                {/* Secure Trust Callout */}
                <div className="bg-beige-50/50 rounded-2xl p-4 border border-beige-100/60 flex items-start space-x-3">
                  <ShieldCheck size={16} className="text-gold-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                    Evans protocols guarantee complete secure processing & organic sourcing standards.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Checkout;
