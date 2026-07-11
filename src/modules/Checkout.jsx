import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ShoppingBag,
  CreditCard,
  CheckCircle2,
  Plus,
  ArrowLeft,
  Loader2,
  Package,
  ShieldCheck,
  ChevronRight,
  Truck,
  Leaf,
  Sparkles,
  Lock
} from 'lucide-react';
import { useNavigate } from '@/router-shim';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const WELLNESS_QUOTES = [
  { icon: Leaf, text: 'Pure botanicals, trusted delivery — your ritual awaits.' },
  { icon: Sparkles, text: 'Nature\'s finest, curated for your skin\'s daily ceremony.' },
  { icon: Truck, text: 'Delivered with care, straight from nature to your doorstep.' },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, placeOrder, createRazorpayOrder, verifyPayment, storeSettings, fetchStoreSettings } = useStore();
  const { user, token, fetchProfile, addAddress } = useAuthStore();

  const [activeStep, setActiveStep] = useState(1);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [upiMode, setUpiMode] = useState('apps'); // 'apps' | 'id'
  const [newAddress, setNewAddress] = useState({
    name: '', phone: '', address: '', city: '', pincode: '', isDefault: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePincodeChange = async (e) => {
    const value = e.target.value;
    setNewAddress(prev => ({ ...prev, pincode: value }));
    if (value.length === 6 && /^\d+$/.test(value)) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();
        if (data?.[0]?.Status === 'Success') {
          const po = data[0].PostOffice[0];
          const city = po.Block && po.Block !== 'NA' ? po.Block : po.Name;
          setNewAddress(prev => ({ ...prev, city }));
          toast.success(`Location detected: ${city}`);
        } else {
          toast.error('Invalid Pincode');
        }
      } catch {}
    }
  };

  useEffect(() => {
    if (!token) { navigate('/auth', { state: { from: { pathname: '/checkout' } } }); return; }
    fetchProfile();
  }, [token, navigate, fetchProfile]);

  useEffect(() => {
    if (cart.length === 0 && activeStep < 4) navigate('/cart');
  }, [cart, navigate, activeStep]);

  useEffect(() => { fetchStoreSettings(); }, [fetchStoreSettings]);

  const subtotal = cart.reduce((acc, item) => acc + (item.price * (1 - (item.discountPercentage || 0) / 100)) * item.quantity, 0);
  const originalTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = originalTotal - subtotal;
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
      toast.success('Address saved!');
    } catch (err) {
      toast.error(err.message || 'Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user?.addresses?.length) { toast.error('Please add a delivery address'); return; }
    if (upiMode === 'id' && !upiId.trim()) { toast.error('Please enter your UPI ID'); return; }

    setIsSubmitting(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) { toast.error('Payment service unavailable. Check your connection.'); setIsSubmitting(false); return; }

      const razorpayOrder = await createRazorpayOrder(totalAmount);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Evans Luxe',
        description: 'Pure Botanical Skincare',
        image: 'https://evanscom.vercel.app/images/logo.jpg',
        order_id: razorpayOrder.id,
        handler: async (response) => {
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
            setActiveStep(4);
            toast.success('Order placed! Your ritual is on its way 🌿');
          } catch (err) {
            toast.error(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.addresses?.[selectedAddressIndex]?.phone || '',
          ...(upiMode === 'id' && upiId ? { vpa: upiId } : {})
        },
        theme: { color: '#581c87' },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI',
                instruments: [{ method: 'upi' }]
              }
            },
            sequence: ['block.upi'],
            preferences: { show_default_blocks: false }
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (r) => toast.error(r.error.description || 'Payment failed'));
      rzp.open();
    } catch (err) {
      toast.error(err.message || 'Could not initiate payment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-purple-900" size={32} />
    </div>
  );

  // ─── SUCCESS SCREEN ───────────────────────────────────────────────────────────
  if (activeStep === 4) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="text-green-600" size={34} />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-1">Order Confirmed!</h2>
        <p className="text-xs text-gray-500 mb-1">Your ritual essentials are being lovingly packed.</p>
        <p className="text-[11px] text-purple-700 italic font-medium mb-5">"Pure nature, delivered with care — your skin will thank you."</p>
        <div className="space-y-2">
          <button
            onClick={() => navigate('/profile?tab=orders')}
            className="w-full bg-purple-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-purple-800 transition-colors"
          >
            Track My Order
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );

  const selectedAddr = user.addresses?.[selectedAddressIndex];

  // ─── MAIN LAYOUT ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-4xl mx-auto px-2 py-3 md:px-4 md:py-5 md:flex md:gap-4 md:items-start">

        {/* Left Column — Steps */}
        <div className="flex-1 space-y-2 md:space-y-3">

          {/* ── STEP 1: DELIVERY ADDRESS ─────────────────────────────────── */}
          <div className={`bg-white rounded-xl overflow-hidden shadow-sm border ${activeStep === 1 ? 'border-purple-300' : 'border-gray-200'}`}>

            {/* Step Header */}
            <div
              className={`flex items-center justify-between px-3 py-3 cursor-pointer ${activeStep > 1 ? 'bg-purple-50' : 'bg-white'}`}
              onClick={() => activeStep > 1 && setActiveStep(1)}
            >
              <div className="flex items-center space-x-2.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${activeStep >= 1 ? 'bg-purple-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {activeStep > 1 ? <CheckCircle2 size={14} /> : '1'}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Delivery Address</p>
                  {activeStep > 1 && selectedAddr && (
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate max-w-[180px]">
                      {selectedAddr.name} · {selectedAddr.city}
                    </p>
                  )}
                </div>
              </div>
              {activeStep > 1 && (
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wide border border-purple-200 px-2 py-0.5 rounded">
                  CHANGE
                </span>
              )}
            </div>

            {/* Step Body */}
            {activeStep === 1 && (
              <div className="px-3 pb-4 border-t border-gray-100">

                {/* Quote */}
                <div className="flex items-center space-x-2 bg-purple-50 rounded-lg px-3 py-2 my-3">
                  <MapPin size={13} className="text-purple-600 flex-shrink-0" />
                  <p className="text-[11px] text-purple-700 italic">"Where shall we send your botanical ritual?"</p>
                </div>

                {/* Address List */}
                <div className="space-y-2 mb-3">
                  {user.addresses?.map((addr, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedAddressIndex(idx)}
                      className={`flex items-start space-x-2.5 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressIndex === idx ? 'border-purple-700 bg-purple-50/40' : 'border-gray-200 hover:border-purple-200'}`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedAddressIndex === idx ? 'border-purple-700' : 'border-gray-400'}`}>
                        {selectedAddressIndex === idx && <div className="w-2 h-2 bg-purple-700 rounded-full" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5 mb-0.5">
                          <span className="text-xs font-bold text-gray-900 truncate">{addr.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${addr.isDefault ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                            {addr.isDefault ? 'DEFAULT' : 'SAVED'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">{addr.address}</p>
                        <p className="text-[11px] text-gray-600 font-semibold mt-0.5">{addr.city} — {addr.pincode}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{addr.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add New Address Form */}
                {isAddingAddress ? (
                  <form onSubmit={handleAddAddress} className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2.5 mb-3">
                    <p className="text-xs font-bold text-gray-700 mb-1">Add New Address</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        placeholder="Full Name *"
                        required
                        value={newAddress.name}
                        onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="col-span-2 w-full px-3 py-2.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-purple-400 bg-white"
                      />
                      <input
                        placeholder="Phone Number *"
                        required
                        value={newAddress.phone}
                        onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-purple-400 bg-white"
                      />
                      <input
                        placeholder="Pincode *"
                        required
                        maxLength={6}
                        value={newAddress.pincode}
                        onChange={handlePincodeChange}
                        className="w-full px-3 py-2.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-purple-400 bg-white"
                      />
                      <textarea
                        placeholder="Flat, House no., Area, Street *"
                        required
                        rows={2}
                        value={newAddress.address}
                        onChange={e => setNewAddress({ ...newAddress, address: e.target.value })}
                        className="col-span-2 w-full px-3 py-2.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-purple-400 bg-white resize-none"
                      />
                      <input
                        placeholder="City / District *"
                        required
                        value={newAddress.city}
                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs rounded-lg border border-gray-300 focus:outline-none focus:border-purple-400 bg-white"
                      />
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={e => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                          className="w-3.5 h-3.5 accent-purple-700"
                        />
                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Set as default</span>
                      </label>
                    </div>
                    <div className="flex space-x-2 pt-1">
                      <button type="submit" className="flex-1 bg-purple-900 text-white py-2.5 rounded-lg text-xs font-bold hover:bg-purple-800 transition-colors">
                        Save Address
                      </button>
                      <button type="button" onClick={() => setIsAddingAddress(false)} className="px-4 text-gray-500 text-xs font-semibold">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="flex items-center space-x-2 text-purple-700 text-xs font-bold py-2 hover:text-purple-900 transition-colors mb-3"
                  >
                    <Plus size={14} />
                    <span>Add New Address</span>
                  </button>
                )}

                {user.addresses?.length > 0 && !isAddingAddress && (
                  <button
                    onClick={() => setActiveStep(2)}
                    className="w-full bg-purple-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-purple-800 transition-colors shadow-sm"
                  >
                    DELIVER HERE
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── STEP 2: ORDER SUMMARY ──────────────────────────────────────── */}
          <div className={`bg-white rounded-xl overflow-hidden shadow-sm border ${activeStep === 2 ? 'border-purple-300' : 'border-gray-200'} ${activeStep < 2 ? 'opacity-60' : ''}`}>

            <div
              className={`flex items-center justify-between px-3 py-3 cursor-pointer ${activeStep > 2 ? 'bg-purple-50' : 'bg-white'}`}
              onClick={() => activeStep >= 2 && setActiveStep(2)}
            >
              <div className="flex items-center space-x-2.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${activeStep >= 2 ? 'bg-purple-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {activeStep > 2 ? <CheckCircle2 size={14} /> : '2'}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Order Summary</p>
                  {activeStep > 2 && (
                    <p className="text-[11px] text-gray-500 mt-0.5">{cart.length} item{cart.length > 1 ? 's' : ''} · ₹{totalAmount.toLocaleString()}</p>
                  )}
                </div>
              </div>
              {activeStep > 2 && (
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wide border border-purple-200 px-2 py-0.5 rounded">
                  CHANGE
                </span>
              )}
            </div>

            {activeStep === 2 && (
              <div className="px-3 pb-4 border-t border-gray-100">

                {/* Quote */}
                <div className="flex items-center space-x-2 bg-purple-50 rounded-lg px-3 py-2 my-3">
                  <ShoppingBag size={13} className="text-purple-600 flex-shrink-0" />
                  <p className="text-[11px] text-purple-700 italic">"Each product is crafted to nurture your skin's natural glow."</p>
                </div>

                {/* Cart Items */}
                <div className="divide-y divide-gray-100 mb-4">
                  {cart.map((item) => {
                    const discountedPrice = item.price * (1 - (item.discountPercentage || 0) / 100);
                    return (
                      <div key={item.id || item._id} className="py-3 flex items-center space-x-3">
                        <img
                          src={item.image || item.images?.[0]}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">{item.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs font-bold text-purple-900">₹{discountedPrice.toLocaleString()}</span>
                            {item.discountPercentage > 0 && (
                              <span className="text-[10px] text-gray-400 line-through">₹{item.price.toLocaleString()}</span>
                            )}
                            <span className="text-[10px] text-gray-500">× {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-bold text-gray-900">₹{(discountedPrice * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shipping note */}
                <div className={`flex items-center space-x-2 rounded-lg px-3 py-2 mb-4 ${shippingCost === 0 ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <Truck size={13} className={shippingCost === 0 ? 'text-green-600' : 'text-yellow-600'} />
                  <p className="text-[11px] font-semibold text-gray-700">
                    {shippingCost === 0
                      ? '✓ Free delivery on this order!'
                      : `Delivery charge: ₹${shippingCost}. Add ₹${(threshold - subtotal).toFixed(0)} more for free delivery.`}
                  </p>
                </div>

                <button
                  onClick={() => setActiveStep(3)}
                  className="w-full bg-purple-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-purple-800 transition-colors shadow-sm"
                >
                  CONTINUE TO PAYMENT
                </button>
              </div>
            )}
          </div>

          {/* ── STEP 3: PAYMENT ────────────────────────────────────────────── */}
          <div className={`bg-white rounded-xl overflow-hidden shadow-sm border ${activeStep === 3 ? 'border-purple-300' : 'border-gray-200'} ${activeStep < 3 ? 'opacity-60' : ''}`}>

            <div
              className="flex items-center justify-between px-3 py-3 cursor-pointer"
              onClick={() => activeStep >= 3 && setActiveStep(3)}
            >
              <div className="flex items-center space-x-2.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${activeStep >= 3 ? 'bg-purple-900 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  3
                </div>
                <p className="text-xs font-bold text-gray-800 uppercase tracking-wide">Payment</p>
              </div>
            </div>

            {activeStep === 3 && (
              <div className="px-3 pb-4 border-t border-gray-100">

                {/* Quote */}
                <div className="flex items-center space-x-2 bg-purple-50 rounded-lg px-3 py-2 my-3">
                  <ShieldCheck size={13} className="text-purple-600 flex-shrink-0" />
                  <p className="text-[11px] text-purple-700 italic">"Secure payment, so your ritual begins worry-free."</p>
                </div>

                {/* UPI Section Header */}
                <div className="flex items-center space-x-2 mb-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-5" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">UPI Payment</p>
                    <p className="text-[10px] text-gray-500">Fast · Secure · Instant</p>
                  </div>
                </div>

                {/* UPI Mode Toggle */}
                <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-4">
                  <button
                    onClick={() => setUpiMode('apps')}
                    className={`flex-1 py-2.5 text-xs font-bold transition-colors ${upiMode === 'apps' ? 'bg-purple-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    UPI Apps
                  </button>
                  <button
                    onClick={() => setUpiMode('id')}
                    className={`flex-1 py-2.5 text-xs font-bold transition-colors border-l border-gray-200 ${upiMode === 'id' ? 'bg-purple-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                  >
                    UPI ID
                  </button>
                </div>

                {/* UPI Apps Panel */}
                {upiMode === 'apps' && (
                  <div className="mb-4">
                    <p className="text-[10px] text-gray-500 mb-2.5 font-medium">Select your preferred UPI app to pay after clicking the button below:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { name: 'GPay', img: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg', size: 'h-5', bg: 'hover:border-blue-400 hover:bg-blue-50' },
                        { name: 'PhonePe', img: 'https://download.logo.wine/logo/PhonePe/PhonePe-Logo.wine.png', size: 'h-9 w-9 object-contain', bg: 'hover:border-purple-400 hover:bg-purple-50' },
                        { name: 'Paytm', img: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg', size: 'h-4', bg: 'hover:border-blue-400 hover:bg-blue-50' },
                        { name: 'BHIM', img: 'https://www.npci.org.in/images/bhim-logo.png', size: 'h-7 w-7 object-contain', bg: 'hover:border-orange-400 hover:bg-orange-50', fallback: '🇮🇳' },
                        { name: 'Any UPI', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg', size: 'h-5', bg: 'hover:border-green-400 hover:bg-green-50' },
                        { name: 'More Apps', img: null, bg: 'hover:border-gray-400 hover:bg-gray-50' },
                      ].map((app) => (
                        <div
                          key={app.name}
                          className={`flex flex-col items-center justify-center border-2 border-gray-200 rounded-xl py-3 px-2 cursor-pointer transition-all ${app.bg}`}
                        >
                          {app.img ? (
                            <img src={app.img} alt={app.name} className={`${app.size} mb-1.5`} />
                          ) : (
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1.5">
                              <CreditCard size={14} className="text-gray-500" />
                            </div>
                          )}
                          <span className="text-[9px] font-bold text-gray-600">{app.name}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 text-center">Razorpay will show apps available on your device</p>
                  </div>
                )}

                {/* UPI ID Panel */}
                {upiMode === 'id' && (
                  <div className="mb-4">
                    <label className="text-xs font-bold text-gray-700 block mb-1.5">Enter UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@okbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-3 text-sm rounded-xl border-2 border-gray-200 focus:outline-none focus:border-purple-500 bg-white transition-colors"
                    />
                    <p className="text-[10px] text-gray-400 mt-1.5">e.g. kishore@okicici · yourname@ybl · mobile@paytm</p>
                    {upiId && (
                      <div className="flex items-center space-x-1.5 mt-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        <CheckCircle2 size={12} className="text-green-600" />
                        <span className="text-[11px] text-green-700 font-medium">UPI ID entered: {upiId}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Amount display */}
                <div className="bg-purple-900 rounded-xl p-3 mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-purple-300 font-medium">Total Amount</p>
                    <p className="text-xl font-black text-white">₹{totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-purple-300">You save</p>
                    <p className="text-sm font-bold text-green-400">₹{discount.toLocaleString()}</p>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="w-full bg-purple-900 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-purple-800 transition-colors shadow-sm flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>PAY ₹{totalAmount.toLocaleString()} SECURELY</span>
                    </>
                  )}
                </button>

                {/* Razorpay trust badge */}
                <div className="flex items-center justify-center space-x-1.5 mt-3">
                  <Lock size={10} className="text-gray-400" />
                  <span className="text-[10px] text-gray-400">Secured by</span>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-3 opacity-60" />
                </div>
              </div>
            )}
          </div>

          {/* Wellness Quotes Strip */}
          <div className="space-y-2">
            {WELLNESS_QUOTES.map((q, i) => (
              <div key={i} className="bg-white rounded-xl px-3 py-2.5 flex items-center space-x-3 shadow-sm border border-gray-100">
                <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <q.icon size={14} className="text-purple-700" />
                </div>
                <p className="text-[11px] text-gray-600 italic leading-snug">{q.text}</p>
              </div>
            ))}
          </div>

        </div>

        {/* ── RIGHT SIDEBAR: PRICE DETAILS ────────────────────────────── */}
        <div className="md:w-72 mt-3 md:mt-0 md:sticky md:top-16">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5">
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Price Details</p>
            </div>
            <div className="px-4 py-3 space-y-2.5">
              <div className="flex justify-between text-xs text-gray-700">
                <span>Price ({cart.length} item{cart.length > 1 ? 's' : ''})</span>
                <span>₹{originalTotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-green-600">
                  <span>Discount</span>
                  <span>−₹{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-gray-700">
                <span>Delivery Charges</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600 font-bold">FREE</span>
                ) : (
                  <span>₹{shippingCost}</span>
                )}
              </div>
              <div className="border-t border-dashed border-gray-200 pt-2.5 flex justify-between font-bold text-sm text-gray-900">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="bg-green-50 rounded-lg px-3 py-2">
                  <p className="text-[11px] text-green-700 font-semibold">🎉 You save ₹{discount.toLocaleString()} on this order!</p>
                </div>
              )}
            </div>
          </div>

          {/* Selected address preview */}
          {activeStep > 1 && selectedAddr && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-3 px-4 py-3">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin size={13} className="text-purple-700" />
                <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Delivering To</p>
              </div>
              <p className="text-xs font-bold text-gray-800">{selectedAddr.name}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{selectedAddr.address}</p>
              <p className="text-[11px] text-gray-600 font-semibold">{selectedAddr.city} - {selectedAddr.pincode}</p>
            </div>
          )}

          {/* Trust badges */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-3 px-4 py-3">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Safe & Secure</p>
            <div className="space-y-1.5">
              {[
                '✓ 100% Authentic Products',
                '✓ Secure UPI Payment',
                '✓ Easy Returns & Refunds',
                '✓ Nature-Certified Ingredients',
              ].map(t => (
                <p key={t} className="text-[11px] text-gray-600">{t}</p>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
