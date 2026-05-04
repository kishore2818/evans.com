import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  ShoppingBag, 
  CreditCard, 
  ChevronRight, 
  CheckCircle2, 
  Plus, 
  Home, 
  Briefcase, 
  ArrowLeft,
  Loader2,
  Package,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useNavigate, Link } from '@/router-shim';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, placeOrder } = useStore();
  const { user, token, fetchProfile, addAddress, loading: authLoading } = useAuthStore();

  const [activeStep, setActiveStep] = useState(1); // 1: Address, 2: Summary, 3: Payment
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    isDefault: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const totalAmount = cart.reduce((acc, item) => acc + (item.price * (1 - (item.discountPercentage || 0) / 100)) * item.quantity, 0);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(newAddress);
      setIsAddingAddress(false);
      setNewAddress({ name: '', phone: '', address: '', city: '', pincode: '', isDefault: false });
      toast.success('Address added successfully');
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
        paymentStatus: 'pending' // For COD
      };

      await placeOrder(orderData);
      setActiveStep(4); // Success Step
      toast.success('Order placed successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-purple-900" size={40} /></div>;

  return (
    <div className="min-h-screen bg-beige-50 pb-20 pt-4 md:pt-10">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 px-4 md:px-20">
          {[
            { id: 1, label: 'Delivery', icon: MapPin },
            { id: 2, label: 'Summary', icon: ShoppingBag },
            { id: 3, label: 'Payment', icon: CreditCard }
          ].map((s, idx) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10 ${
                  activeStep >= s.id ? 'bg-purple-900 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-200'
                }`}>
                  {activeStep > s.id ? <CheckCircle2 size={20} /> : <s.icon size={20} />}
                </div>
                <span className={`text-[10px] mt-2 font-bold uppercase tracking-widest ${activeStep >= s.id ? 'text-purple-900' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {idx < 2 && (
                <div className="flex-1 h-[2px] bg-gray-200 mx-4 -mt-6">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: activeStep > s.id ? '100%' : '0%' }}
                    className="h-full bg-purple-900" 
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            
            <AnimatePresence mode="wait">
              {activeStep === 4 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[2.5rem] p-12 text-center shadow-luxury flex flex-col items-center"
                >
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Package size={48} />
                  </div>
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                  <p className="text-gray-500 mb-8 max-w-sm">Your ritual essentials are being prepared. Check your email for confirmation and tracking details.</p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button 
                      onClick={() => navigate('/profile?tab=orders')}
                      className="bg-purple-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-purple-800 transition-all shadow-luxury"
                    >
                      Track My Order
                    </button>
                    <button 
                      onClick={() => navigate('/')}
                      className="border border-purple-200 text-purple-900 px-8 py-4 rounded-2xl font-bold hover:bg-purple-50 transition-all"
                    >
                      Back to Home
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* STEP 1: ADDRESS */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-[2.5rem] shadow-luxury overflow-hidden border transition-all duration-500 ${activeStep === 1 ? 'border-purple-200' : 'border-transparent opacity-60'}`}
                  >
                    <div 
                      className="p-6 md:p-8 flex justify-between items-center cursor-pointer"
                      onClick={() => setActiveStep(1)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeStep === 1 ? 'bg-purple-900 text-white' : 'bg-beige-100 text-purple-900'}`}>
                          <span className="font-bold text-sm">1</span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-gray-900">Delivery Address</h3>
                      </div>
                      {activeStep > 1 && <span className="text-purple-700 font-bold text-xs uppercase tracking-widest">Change</span>}
                    </div>

                    {activeStep === 1 && (
                      <div className="px-6 md:px-8 pb-8">
                        <div className="space-y-4 mb-6">
                          {user.addresses?.map((addr, idx) => (
                            <div 
                              key={idx}
                              onClick={() => setSelectedAddressIndex(idx)}
                              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start space-x-4 ${
                                selectedAddressIndex === idx ? 'border-purple-900 bg-purple-50/30' : 'border-beige-100 hover:border-purple-200'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedAddressIndex === idx ? 'border-purple-900' : 'border-gray-300'}`}>
                                {selectedAddressIndex === idx && <div className="w-2.5 h-2.5 bg-purple-900 rounded-full" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-bold text-gray-900 truncate max-w-[150px] sm:max-w-[200px] block">{addr.name}</span>
                                  <span className="text-[10px] bg-beige-200 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                                    {addr.isDefault ? 'Primary' : 'Saved'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{addr.address}</p>
                                <p className="text-sm text-gray-600 mb-2 font-medium">{addr.city} - {addr.pincode}</p>
                                <p className="text-xs text-gray-400 font-bold tracking-widest uppercase whitespace-nowrap">{addr.phone}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {isAddingAddress ? (
                          <motion.form 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            onSubmit={handleAddAddress}
                            className="bg-beige-50/50 border border-beige-100 rounded-3xl p-6 space-y-4"
                          >
                            <div className="grid grid-cols-2 gap-4">
                              <input 
                                placeholder="Full Name *"
                                required
                                value={newAddress.name}
                                onChange={e => setNewAddress({...newAddress, name: e.target.value})}
                                className="col-span-2 w-full px-5 py-3 rounded-xl border border-beige-200 focus:outline-none focus:border-purple-300 bg-white"
                              />
                              <input 
                                placeholder="Phone Number *"
                                required
                                value={newAddress.phone}
                                onChange={e => setNewAddress({...newAddress, phone: e.target.value})}
                                className="w-full px-5 py-3 rounded-xl border border-beige-200 focus:outline-none focus:border-purple-300 bg-white"
                              />
                              <input 
                                placeholder="Pincode *"
                                required
                                value={newAddress.pincode}
                                onChange={e => setNewAddress({...newAddress, pincode: e.target.value})}
                                className="w-full px-5 py-3 rounded-xl border border-beige-200 focus:outline-none focus:border-purple-300 bg-white"
                              />
                              <textarea 
                                placeholder="Flat, House no., Area, Street *"
                                required
                                rows={3}
                                value={newAddress.address}
                                onChange={e => setNewAddress({...newAddress, address: e.target.value})}
                                className="col-span-2 w-full px-5 py-3 rounded-xl border border-beige-200 focus:outline-none focus:border-purple-300 bg-white"
                              />
                              <input 
                                placeholder="City / District *"
                                required
                                value={newAddress.city}
                                onChange={e => setNewAddress({...newAddress, city: e.target.value})}
                                className="w-full px-5 py-3 rounded-xl border border-beige-200 focus:outline-none focus:border-purple-300 bg-white"
                              />
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={newAddress.isDefault}
                                  onChange={e => setNewAddress({...newAddress, isDefault: e.target.checked})}
                                  className="w-4 h-4 rounded text-purple-900 border-beige-300"
                                />
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Set as default</span>
                              </label>
                            </div>
                            <div className="flex space-x-4 pt-2">
                              <button 
                                type="submit"
                                className="bg-purple-900 text-white px-6 py-3 rounded-xl font-bold flex-1 hover:bg-purple-800"
                              >
                                Save & Selection
                              </button>
                              <button 
                                type="button"
                                onClick={() => setIsAddingAddress(false)}
                                className="text-gray-500 px-6 py-3 rounded-xl font-bold"
                              >
                                Cancel
                              </button>
                            </div>
                          </motion.form>
                        ) : (
                          <button 
                            onClick={() => setIsAddingAddress(true)}
                            className="flex items-center space-x-2 text-purple-700 font-bold hover:text-purple-900 group"
                          >
                            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                              <Plus size={16} />
                            </div>
                            <span className="text-sm">Add a new delivery address</span>
                          </button>
                        )}

                        {user.addresses?.length > 0 && !isAddingAddress && (
                          <button 
                            onClick={() => setActiveStep(2)}
                            className="w-full mt-8 bg-purple-900 text-white py-4 rounded-2xl font-bold shadow-luxury hover:bg-purple-800 transition-all"
                          >
                            Delivery Here
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>

                  {/* STEP 2: SUMMARY */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-[2.5rem] shadow-luxury overflow-hidden border transition-all duration-500 ${activeStep === 2 ? 'border-purple-200' : 'border-transparent opacity-60'}`}
                  >
                    <div 
                      className="p-6 md:p-8 flex justify-between items-center cursor-pointer"
                      onClick={() => activeStep >= 2 && setActiveStep(2)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeStep === 2 ? 'bg-purple-900 text-white' : 'bg-beige-100 text-purple-900'}`}>
                          <span className="font-bold text-sm">2</span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-gray-900">Order Summary</h3>
                      </div>
                    </div>

                    {activeStep === 2 && (
                      <div className="px-6 md:px-8 pb-8">
                        <div className="divide-y divide-beige-100 mb-6">
                          {cart.map((item) => (
                            <div key={item.id} className="py-4 flex items-center space-x-4">
                              <img src={item.image} alt="" className="w-16 h-16 rounded-2xl object-cover bg-beige-50 shadow-sm" />
                              <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-2">{item.name}</h4>
                                <div className="flex items-center space-x-2 text-xs">
                                  <span className="font-black text-purple-900 whitespace-nowrap">₹{(item.price * (1 - (item.discountPercentage || 0) / 100)).toLocaleString()}</span>
                                  <span className="text-gray-400">× {item.quantity}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => setActiveStep(3)}
                          className="w-full bg-purple-900 text-white py-4 rounded-2xl font-bold shadow-luxury hover:bg-purple-800 transition-all"
                        >
                          Confirm Summary
                        </button>
                      </div>
                    )}
                  </motion.div>

                  {/* STEP 3: PAYMENT */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-[2.5rem] shadow-luxury overflow-hidden border transition-all duration-500 ${activeStep === 3 ? 'border-purple-200' : 'border-transparent opacity-60'}`}
                  >
                    <div 
                      className="p-6 md:p-8 flex justify-between items-center cursor-pointer"
                      onClick={() => activeStep >= 3 && setActiveStep(3)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${activeStep === 3 ? 'bg-purple-900 text-white' : 'bg-beige-100 text-purple-900'}`}>
                          <span className="font-bold text-sm">3</span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-gray-900">Payment Options</h3>
                      </div>
                    </div>

                    {activeStep === 3 && (
                      <div className="px-6 md:px-8 pb-8">
                        <div className="bg-purple-50/50 border border-purple-100 p-5 rounded-2xl flex items-start space-x-4 mb-8">
                          <div className="w-6 h-6 rounded-full border-2 border-purple-900 flex items-center justify-center mt-1">
                            <div className="w-3 h-3 bg-purple-900 rounded-full" />
                          </div>
                          <div>
                            <h4 className="font-bold text-purple-900 mb-1 leading-none uppercase">Cash on Delivery</h4>
                            <p className="text-xs text-purple-800/60 leading-relaxed">Pay conveniently upon delivery. As we are in beta, COD is our preferred protocol for your organic rituals.</p>
                          </div>
                        </div>

                        <button 
                          onClick={handlePlaceOrder}
                          disabled={isSubmitting}
                          className="w-full bg-purple-900 text-white py-5 rounded-3xl font-bold shadow-luxury hover:bg-purple-800 transition-all flex items-center justify-center space-x-3 disabled:opacity-70"
                        >
                          {isSubmitting ? (
                            <Loader2 className="animate-spin" size={24} />
                          ) : (
                            <>
                              <ShieldCheck size={24} />
                              <span className="text-lg whitespace-nowrap">Place Order • ₹{totalAmount.toLocaleString()}</span>
                            </>
                          )}
                        </button>
                        <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-[0.2em] font-bold">100% Secure Checkout</p>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Pricing Sidebar */}
          {activeStep < 4 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2.5rem] shadow-luxury p-8 sticky top-32 border border-purple-50">
                <h3 className="font-serif text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-beige-100">Ritual Pricing</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Base Total</span>
                    <span className="whitespace-nowrap">₹{cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Botanical Discount</span>
                    <span className="whitespace-nowrap">-₹{cart.reduce((acc, item) => acc + (item.price * (item.discountPercentage / 100) * item.quantity), 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Eco Shipping</span>
                    <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Free</span>
                  </div>
                </div>
                <div className="pt-6 border-t-2 border-dashed border-beige-100 flex justify-between items-center mb-8">
                  <span className="font-bold text-gray-900">Grand Total</span>
                  <span className="text-2xl font-black text-purple-900 whitespace-nowrap">₹{totalAmount.toLocaleString()}</span>
                </div>
                
                <div className="bg-beige-50 rounded-2xl p-4 flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-700">
                    <ShieldCheck size={20} />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                    Sustainable sourcing & secure protocols guaranteed.
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
