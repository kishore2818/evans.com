'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  ShoppingBag, 
  CreditCard, 
  CheckCircle2, 
  Plus, 
  Package, 
  ShieldCheck, 
  Sparkles, 
  ChevronRight, 
  Phone, 
  Loader2,
  X
} from 'lucide-react';
import { useNavigate } from '@/router-shim';
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

  const [activeStep, setActiveStep] = useState(1); // 1: Checkout, 4: Success
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [showAddressList, setShowAddressList] = useState(false);
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
      // Auto select the newly added address (which is appended to the end of user.addresses)
      if (user?.addresses) {
        setSelectedAddressIndex(user.addresses.length);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user.addresses || user.addresses.length === 0) {
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
          <p className="text-[10px] font-black uppercase tracking-widest text-purple-500">Loading rituals</p>
        </div>
      </div>
    );
  }

  const currentAddress = user.addresses?.[selectedAddressIndex];

  return (
    <div className="min-h-screen bg-beige-50 pb-28 pt-6 relative overflow-hidden">
      
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="orb absolute w-[500px] h-[500px] bg-purple-100/40 top-[-5%] left-[-5%] opacity-40" />
        <div className="orb absolute w-[400px] h-[400px] bg-gold-100/30 bottom-[-5%] right-[-5%] opacity-30" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* Header Title */}
        <div className="mb-6 md:mb-8 text-center sm:text-left">
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-purple-900 mb-1 md:mb-2">Secure checkout</h1>
          <p className="text-gray-400 text-xs sm:text-sm font-medium">Verify your package and shipping details in one click</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 md:gap-8 items-start">
          
          {/* Main Content Area */}
          <div className="lg:col-span-6 space-y-4 md:space-y-5">
            <AnimatePresence mode="wait">
              {activeStep === 4 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 25 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                  className="bg-white rounded-3xl md:rounded-[2.5rem] p-8 md:p-14 text-center shadow-luxury border border-beige-100/60 flex flex-col items-center relative overflow-hidden"
                >
                  <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-purple-900 via-gold-400 to-purple-900" />
                  
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-5 shadow-luxury"
                    style={{ background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)', border: '2px solid rgba(212,175,55,0.4)' }}
                  >
                    <Package size={28} className="text-gold-400 animate-bounce" />
                  </motion.div>

                  <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-purple-900 mb-2">Order Confirmed!</h2>
                  <p className="text-gray-400 text-xs sm:text-sm max-w-sm mb-8 leading-relaxed font-medium">
                    Your luxury botanicals are officially locked. We will send updates to your registered email.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => navigate('/profile?tab=orders')}
                      className="px-6 py-3.5 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest text-white shadow-luxury hover:opacity-90 active:scale-95 transition-all min-h-0 min-w-0"
                      style={{ background: 'linear-gradient(135deg, #3e1d4a, #5A2A6C)' }}
                    >
                      Track My Rituals
                    </button>
                    <button 
                      onClick={() => navigate('/')}
                      className="px-6 py-3.5 rounded-xl md:rounded-2xl font-black text-[10px] uppercase tracking-widest text-purple-900 border border-purple-200 bg-white hover:bg-beige-50 active:scale-95 transition-all min-h-0 min-w-0"
                    >
                      Back to Gallery
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4 md:space-y-5">
                  
                  {/* ════ SECTION 1: DELIVERY ADDRESS ════ */}
                  <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-beige-100 p-5 md:p-8 shadow-sm">
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-beige-100">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <MapPin size={16} className="text-purple-900" />
                        <h3 className="font-serif text-base sm:text-lg font-bold text-purple-900">Delivery details</h3>
                      </div>
                      {user.addresses?.length > 0 && (
                        <button 
                          onClick={() => { setShowAddressList(prev => !prev); setIsAddingAddress(false); }}
                          className="text-[10px] text-purple-600 font-bold uppercase tracking-widest border-b border-purple-200 hover:text-purple-900 transition-colors"
                        >
                          {showAddressList ? 'Cancel' : 'Change'}
                        </button>
                      )}
                    </div>

                    {/* Address Selection List (Collapsed by default) */}
                    {showAddressList && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 space-y-3"
                      >
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Select a saved address:</p>
                        <div className="grid grid-cols-1 gap-3">
                          {user.addresses?.map((addr, idx) => (
                            <div 
                              key={idx}
                              onClick={() => { setSelectedAddressIndex(idx); setShowAddressList(false); }}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 bg-white ${
                                selectedAddressIndex === idx 
                                  ? 'border-purple-900 bg-purple-50/20' 
                                  : 'border-beige-100 hover:border-purple-100'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                selectedAddressIndex === idx ? 'border-purple-900' : 'border-gray-300'
                              }`}>
                                {selectedAddressIndex === idx && <div className="w-2 h-2 bg-purple-900 rounded-full" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-0.5">
                                  <span className="font-bold text-gray-900 text-xs truncate">{addr.name}</span>
                                  <span className="text-[7px] font-black tracking-widest uppercase bg-gold-400/10 text-gold-600 px-1.5 py-0.5 rounded-full">
                                    {addr.isDefault ? 'Primary' : 'Saved'}
                                  </span>
                                </div>
                                <p className="text-[10px] text-gray-500">{addr.address}, {addr.city} - {addr.pincode}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {!isAddingAddress && (
                          <button 
                            onClick={() => setIsAddingAddress(true)}
                            className="flex items-center space-x-1.5 text-purple-600 font-bold hover:text-purple-900 transition-colors group text-[10px] min-h-0 pt-2"
                          >
                            <Plus size={12} />
                            <span>Add a new delivery address</span>
                          </button>
                        )}
                      </motion.div>
                    )}

                    {/* Inline Add Address Form */}
                    {isAddingAddress && (
                      <motion.form 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleAddAddress}
                        className="bg-beige-50/30 border border-beige-100 rounded-2xl p-4 space-y-3 mb-6"
                      >
                        <h4 className="font-serif text-xs font-bold text-purple-900 flex items-center gap-1.5">
                          <Plus size={12} /> Add new address
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            placeholder="Full Name *"
                            required
                            value={newAddress.name}
                            onChange={e => setNewAddress({...newAddress, name: e.target.value})}
                            className="col-span-2 w-full px-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:border-gold-400 bg-white text-[10px] sm:text-xs font-medium focus:ring-1 focus:ring-gold-400"
                          />
                          <input 
                            placeholder="Phone Number *"
                            required
                            value={newAddress.phone}
                            onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:border-gold-400 bg-white text-[10px] sm:text-xs font-medium focus:ring-1 focus:ring-gold-400"
                          />
                          <input 
                            placeholder="Pincode *"
                            required
                            value={newAddress.pincode}
                            onChange={handlePincodeChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:border-gold-400 bg-white text-[10px] sm:text-xs font-medium focus:ring-1 focus:ring-gold-400"
                          />
                          <textarea 
                            placeholder="Flat, House no., Area, Street *"
                            required
                            rows={2}
                            value={newAddress.address}
                            onChange={e => setNewAddress({...newAddress, address: e.target.value})}
                            className="col-span-2 w-full px-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:border-gold-400 bg-white text-[10px] sm:text-xs font-medium focus:ring-1 focus:ring-gold-400"
                          />
                          <input 
                            placeholder="City / District *"
                            required
                            value={newAddress.city}
                            onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-xl border border-beige-200 focus:outline-none focus:border-gold-400 bg-white text-[10px] sm:text-xs font-medium focus:ring-1 focus:ring-gold-400"
                          />
                          <label className="flex items-center space-x-1.5 cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={newAddress.isDefault}
                              onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})}
                              className="w-3 h-3 rounded text-purple-900 border-beige-300 focus:ring-0"
                            />
                            <span className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-wider">Set as default</span>
                          </label>
                        </div>

                        <div className="flex space-x-2.5 pt-1.5">
                          <button 
                            type="submit"
                            className="px-4 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-wider bg-purple-950 text-white hover:bg-purple-900 active:scale-95 transition-all min-h-0 flex-1"
                          >
                            Save & Select
                          </button>
                          <button 
                            type="button"
                            onClick={() => setIsAddingAddress(false)}
                            className="px-4 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-wider border border-beige-200 text-gray-500 bg-white hover:bg-beige-50 active:scale-95 transition-all min-h-0"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* Selected Address View */}
                    {!showAddressList && !isAddingAddress && (
                      <div className="bg-purple-50/10 rounded-2xl border border-beige-100/60 p-4">
                        {currentAddress ? (
                          <div>
                            <div className="flex items-center space-x-2.5 mb-1">
                              <span className="font-bold text-purple-950 text-xs sm:text-sm">{currentAddress.name}</span>
                              <span className="text-[8px] font-black tracking-widest uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                Selected
                              </span>
                            </div>
                            <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 leading-relaxed">{currentAddress.address}</p>
                            <p className="text-[10px] sm:text-xs font-semibold text-purple-900 mb-2">{currentAddress.city} · {currentAddress.pincode}</p>
                            <div className="flex items-center space-x-1.5 text-gray-400">
                              <Phone size={8} />
                              <span className="text-[8px] sm:text-[9px] font-bold tracking-widest">{currentAddress.phone}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-xs text-gray-500 mb-3">No delivery address saved yet.</p>
                            <button 
                              onClick={() => setIsAddingAddress(true)}
                              className="px-5 py-2.5 bg-purple-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-luxury min-h-0"
                            >
                              Add Delivery Address
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ════ SECTION 2: ORDER SUMMARY ════ */}
                  <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-beige-100 p-5 md:p-8 shadow-sm">
                    <div className="flex items-center space-x-2 md:space-x-3 mb-4 pb-3 border-b border-beige-100">
                      <ShoppingBag size={16} className="text-purple-900" />
                      <h3 className="font-serif text-base sm:text-lg font-bold text-purple-900">Your rituals ({cart.length})</h3>
                    </div>

                    <div className="divide-y divide-beige-100/60 max-h-[220px] overflow-y-auto pr-1.5 no-scrollbar">
                      {cart.map((item) => {
                        const discPrice = item.price * (1 - (item.discountPercentage || 0) / 100);
                        return (
                          <div key={item.id} className="py-3 flex items-center space-x-3 first:pt-0 last:pb-0">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-beige-50 border border-beige-100/60 flex-shrink-0 shadow-sm">
                              <Image src={item.image || '/images/placeholder.png'} alt="" fill sizes="48px" className="object-cover" unoptimized />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[11px] font-bold text-purple-900 leading-tight mb-0.5 truncate">{item.name}</h4>
                              <div className="flex items-center space-x-1.5 text-[9px]">
                                <span className="font-extrabold text-gray-900">₹{discPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                <span className="text-gray-400 font-medium">Qty: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ════ SECTION 3: PAYMENT METHOD ════ */}
                  <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-beige-100 p-5 md:p-8 shadow-sm">
                    <div className="flex items-center space-x-2 md:space-x-3 mb-4 pb-3 border-b border-beige-100">
                      <CreditCard size={16} className="text-purple-900" />
                      <h3 className="font-serif text-base sm:text-lg font-bold text-purple-900">Payment details</h3>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50/40 to-white border border-purple-100 p-4 md:p-6 rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-900 flex-shrink-0">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-2.5" />
                          </div>
                          <div className="leading-tight">
                            <h4 className="font-bold text-purple-900 text-xs sm:text-sm mb-0.5">UPI & Online checkout</h4>
                            <p className="text-[8px] sm:text-[9px] text-gray-400 font-medium">Redirect to secure Razorpay screen</p>
                          </div>
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full border-4 border-purple-900 flex items-center justify-center flex-shrink-0" />
                      </div>
                      
                      {/* Payment App Badges */}
                      <div className="grid grid-cols-3 gap-2 bg-white/70 backdrop-blur-md rounded-xl p-2 border border-beige-100/60 shadow-sm mb-4">
                        <div className="flex flex-col items-center py-2 hover:bg-beige-50/50 rounded-lg transition-all border border-transparent">
                          <div className="h-4 flex items-center justify-center mb-0.5 w-8">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="max-h-full max-w-full" />
                          </div>
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">GPay</span>
                        </div>
                        <div className="flex flex-col items-center py-2 hover:bg-beige-50/50 rounded-lg transition-all border border-transparent">
                          <div className="h-4 flex items-center justify-center mb-0.5 w-8">
                            <img src="https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png" alt="PhonePe" className="max-h-full max-w-full object-contain" />
                          </div>
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">PhonePe</span>
                        </div>
                        <div className="flex flex-col items-center py-2 hover:bg-beige-50/50 rounded-lg transition-all border border-transparent">
                          <div className="h-4 flex items-center justify-center mb-0.5 w-8">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg" alt="Paytm" className="max-h-full max-w-full" />
                          </div>
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-wider">Paytm</span>
                        </div>
                      </div>

                      {/* VPA UPI Input */}
                      <div className="pt-3 border-t border-purple-100/60">
                        <label className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Optional UPI ID (VPA)</label>
                        <input 
                          type="text" 
                          placeholder="e.g. yourname@okaxis" 
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full px-3.5 py-2.5 sm:py-3 rounded-lg border border-beige-200 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 bg-white text-[10px] sm:text-xs font-semibold shadow-sm transition-all text-purple-900"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Pricing Summary Sidebar (Includes Pay Button) */}
          {activeStep < 4 && (
            <div className="lg:col-span-4 lg:sticky lg:top-32">
              <div 
                className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 md:p-7 border border-beige-100/60"
                style={{ boxShadow: '0 8px 32px rgba(90,42,108,0.06)' }}
              >
                <div className="flex items-center space-x-1.5 mb-4 border-b border-beige-100/60 pb-3">
                  <Sparkles size={14} className="text-gold-500" />
                  <h3 className="font-serif text-sm sm:text-base font-bold text-purple-900">Ritual Invoice</h3>
                </div>

                {/* Invoice rows */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 font-medium">
                    <span>Base package total</span>
                    <span className="font-extrabold text-gray-800">
                      ₹{cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  {cart.reduce((acc, item) => acc + (item.price * (item.discountPercentage / 100) * item.quantity), 0) > 0 && (
                    <div className="flex justify-between text-[10px] sm:text-xs text-red-500 font-medium">
                      <span>Botanical savings</span>
                      <span className="font-extrabold">
                        -₹{cart.reduce((acc, item) => acc + (item.price * (item.discountPercentage / 100) * item.quantity), 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 font-medium">
                    <span>Eco Shipping</span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-black uppercase tracking-wider text-[8px] sm:text-[9px]">Free</span>
                    ) : (
                      <span className="font-extrabold text-gray-800">₹{shippingCost.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-dashed border-beige-200 flex justify-between items-center mb-6">
                  <span className="font-serif text-xs sm:text-sm font-bold text-purple-950">Grand Total</span>
                  <span className="text-lg sm:text-xl md:text-2xl font-black text-purple-900">₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>

                {/* Pay Securely CTA Button */}
                <motion.button 
                  whileHover={{ scale: 1.015, y: -2 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 disabled:opacity-75 relative overflow-hidden group min-h-0 mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #D4AF37, #edc757)',
                    color: '#1a0a22',
                    boxShadow: '0 6px 24px rgba(212,175,55,0.3)',
                  }}
                >
                  <div className="absolute inset-0 bg-white/30 group-hover:translate-x-full transition-transform duration-700 ease-in-out -translate-x-full skew-x-12" />
                  {isSubmitting ? (
                    <Loader2 className="animate-spin text-purple-950" size={16} />
                  ) : (
                    <>
                      <ShieldCheck size={16} className="text-purple-950" strokeWidth={2.5} />
                      <span className="text-purple-950 font-black">Pay ₹{totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })} securely</span>
                    </>
                  )}
                </motion.button>

                {/* Secure Trust Callout */}
                <div className="bg-beige-50/50 rounded-xl p-3 border border-beige-100/60 flex items-start space-x-2.5">
                  <ShieldCheck size={14} className="text-gold-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
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
