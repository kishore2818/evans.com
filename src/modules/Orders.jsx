import React, { useEffect } from 'react';
import { ChevronLeft, Package, ShoppingBag, ChevronRight, Clock } from 'lucide-react';
import { useNavigate } from '@/router-shim';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';

const Orders = () => {
  const navigate = useNavigate();
  const { myOrders, fetchMyOrders } = useStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className="bg-gray-50/50 min-h-screen pt-4 md:pt-12 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center space-x-2 text-purple-600 hover:text-purple-900 font-semibold mb-6 transition-colors"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>

        <div className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-purple-900 mb-3">My Orders</h1>
          <p className="text-gray-500 font-medium">Track and manage your past purchases.</p>
        </div>

        <div className="space-y-4">
          {myOrders.length > 0 ? (
            myOrders.map((order) => (
              <motion.div 
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.orderStatus === 'delivered' ? 'bg-green-50 text-green-600' : 
                          order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-600' : 
                          'bg-yellow-50 text-yellow-600'
                        }`}>
                          {order.orderStatus}
                        </div>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                          ID: {order._id.slice(-8)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-400 text-xs">
                        <Clock size={14} className="mr-1" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0">
                            <img src={item.image || '/images/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h5 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h5>
                            <p className="text-xs text-gray-500 mt-0.5">Quantity: {item.quantity} • ₹{item.price.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:w-48 md:border-l border-gray-100 md:pl-8 flex flex-col justify-center space-y-4 pt-6 md:pt-0 border-t md:border-t-0">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Total Amount</p>
                      <p className="text-xl font-black text-purple-900">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/profile?tab=orders`)}
                      className="w-full py-3 bg-purple-50 text-purple-700 rounded-xl font-bold text-xs hover:bg-purple-100 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Full Details</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center bg-white p-12 md:p-20 rounded-[2.5rem] border border-gray-100 flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                <ShoppingBag size={32} />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 max-w-sm mb-8">Your ritual history is waiting to be written. Explore our collection to start your journey.</p>
              <button 
                onClick={() => navigate('/products')}
                className="bg-purple-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-purple-800 transition-all shadow-luxury"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
