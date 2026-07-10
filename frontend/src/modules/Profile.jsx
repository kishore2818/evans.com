import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Package, 
  ChevronRight, 
  LogOut, 
  Plus, 
  Trash2, 
  Mail, 
  Smartphone,
  Calendar,
  Clock,
  ExternalLink,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Truck,
  Edit2,
  Star,
  MessageSquare,
  Sparkles,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Profile = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, fetchProfile, addAddress, updateProfile, updateAddress, deleteAddress, changePassword } = useAuthStore();
  const { myOrders, fetchMyOrders, addReview } = useStore();
  
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'orders'

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'orders'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    isDefault: false
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    username: '',
    email: '',
    mobile: ''
  });

  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [reviewingItem, setReviewingItem] = useState(null); // {productId, name}
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editAddressData, setEditAddressData] = useState({
    name: '', phone: '', address: '', city: '', pincode: '', isDefault: false
  });

  const [trackingOrder, setTrackingOrder] = useState(null);

  const fetchPincodeDetails = async (pincode, isEdit = false) => {
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          const exactCity = postOffice.Block && postOffice.Block !== "NA" ? postOffice.Block : postOffice.Name;
          if (isEdit) {
            setEditAddressData(prev => ({ ...prev, city: exactCity }));
          } else {
            setNewAddress(prev => ({ ...prev, city: exactCity }));
          }
          toast.success(`Location auto-filled for ${pincode}`);
        } else {
          toast.error('Invalid Pincode');
        }
      } catch (error) {
        console.error('Error fetching pincode details:', error);
      }
    }
  };

  const handlePincodeChange = (e, isEdit = false) => {
    const value = e.target.value;
    if (isEdit) {
      setEditAddressData(prev => ({ ...prev, pincode: value }));
    } else {
      setNewAddress(prev => ({ ...prev, pincode: value }));
    }
    fetchPincodeDetails(value, isEdit);
  };

  useEffect(() => {
    fetchProfile();
    fetchMyOrders();
  }, []);

  useEffect(() => {
    if (user) {
      setEditProfileData({
        username: user.username || '',
        email: user.email || '',
        mobile: user.mobile || ''
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(newAddress);
      setIsAddingAddress(false);
      setNewAddress({ name: '', phone: '', address: '', city: '', pincode: '', isDefault: false });
      toast.success('Address saved to profile');
    } catch (error) {
      toast.error(error.message || 'Failed to save address');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      if (isChangingPassword) {
        if (passwordChange.newPassword !== passwordChange.confirmPassword) {
          return toast.error("New passwords don't match");
        }
        await changePassword({ 
          currentPassword: passwordChange.currentPassword, 
          newPassword: passwordChange.newPassword 
        });
      }
      await updateProfile(editProfileData);
      setIsEditingProfile(false);
      setIsChangingPassword(false);
      setPasswordChange({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Account updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update account details');
    }
  };

  const handleEditAddressSave = async (e, id) => {
    e.preventDefault();
    try {
      await updateAddress(id, editAddressData);
      setEditingAddressId(null);
      toast.success('Address updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if(!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id);
      toast.success('Address deleted safely');
    } catch (error) {
      toast.error(error.message || 'Failed to delete address');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await addReview(reviewingItem.productId, {
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      toast.success('Review submitted! Thank you for the feedback.');
      setReviewingItem(null);
      setReviewData({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    }
  };

  if (!user) {
    return (
      <div className="px-6 py-20 h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-beige-100 rounded-full flex items-center justify-center mb-6 text-purple-300">
          <User size={40} />
        </div>
        <h1 className="font-serif text-3xl font-bold text-purple-900 mb-3">Your Botanical Space</h1>
        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Sign in to track orders, manage addresses and view your luxury wishlist.</p>
        <div className="flex flex-col space-y-4 min-w-[280px]">
          <button onClick={() => router.push('/auth')} className="bg-purple-900 text-white font-bold py-4 rounded-2xl hover:bg-purple-800 shadow-luxury">Sign In / Register</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile Info', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
  ];

  return (
    <div className="bg-gray-50/50 min-h-screen pt-4 md:pt-12 pb-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-4 lg:gap-8">
          
          {/* Left Sidebar */}
          <div className="w-full md:w-72 flex-shrink-0 space-y-4">
            {/* User Info Card */}
            <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 md:space-x-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-900 font-serif text-lg md:text-xl font-bold">
                {user.username[0]}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Hello,</p>
                <h2 className="font-bold text-gray-900 text-sm md:text-base truncate">{user.username}</h2>
              </div>
            </div>

            {/* Navigation Menu (Grid on Mobile / Sidebar on Desktop) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <nav className="grid grid-cols-2 md:flex md:flex-col">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center md:justify-between p-3 md:p-4 text-center md:text-left transition-colors md:border-b border-gray-50 last:border-b-0 ${
                        isActive ? 'bg-purple-50 text-purple-900 border-b-2 md:border-b-0 border-purple-500' : 'text-gray-600 hover:bg-gray-50 hover:text-purple-900'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-3">
                        <tab.icon size={18} className={isActive ? 'text-purple-700' : 'text-gray-400'} />
                        <span className={`font-semibold text-[11px] md:text-sm ${isActive ? 'text-purple-900' : ''}`}>{tab.label}</span>
                      </div>
                      <ChevronRight size={16} className={`hidden md:block ${isActive ? 'text-purple-700' : 'text-gray-300'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>

            <button 
              onClick={handleLogout}
              className="hidden md:flex w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center justify-center space-x-2 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors mt-4"
            >
              <LogOut size={18} />
              <span className="font-semibold text-sm">Logout</span>
            </button>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} className="space-y-4 md:space-y-6">
                  
                  {/* Personal Information section */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8">
                    <div className="flex justify-between items-center mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-100">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">Profile Details</h3>
                      {!isEditingProfile && (
                        <button onClick={() => setIsEditingProfile(true)} className="text-purple-900 font-bold text-xs md:text-sm flex items-center space-x-1 hover:text-purple-700 transition-colors">
                          <Edit2 size={14}/>
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                    
                    {isEditingProfile ? (
                      <form onSubmit={handleUpdateProfile} className="space-y-4 md:space-y-6 max-w-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                          <div className="space-y-1 md:space-y-2">
                            <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                            <input required type="text" value={editProfileData.username} onChange={e => setEditProfileData({...editProfileData, username: e.target.value})} className="w-full px-3 py-2 md:py-3 rounded-lg border border-gray-300 text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"/>
                          </div>
                          <div className="space-y-1 md:space-y-2">
                            <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                            <input required type="email" value={editProfileData.email} onChange={e => setEditProfileData({...editProfileData, email: e.target.value})} className="w-full px-3 py-2 md:py-3 rounded-lg border border-gray-300 text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"/>
                          </div>
                          <div className="space-y-1 md:space-y-2">
                            <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile Number</label>
                            <input required type="text" value={editProfileData.mobile} onChange={e => setEditProfileData({...editProfileData, mobile: e.target.value})} className="w-full px-3 py-2 md:py-3 rounded-lg border border-gray-300 text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"/>
                          </div>
                        </div>

                        {/* Password Change Toggle */}
                        <div className="pt-2 border-t border-gray-100">
                          <button 
                            type="button" 
                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                            className="text-xs font-bold text-purple-700 hover:text-purple-900 transition-colors flex items-center space-x-2"
                          >
                            <Lock size={12}/>
                            <span>{isChangingPassword ? 'Cancel Password Change' : 'Update Security Password'}</span>
                          </button>
                        </div>

                        {isChangingPassword && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 bg-purple-50/50 p-4 rounded-xl border border-purple-100 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-1 md:space-y-2">
                              <label className="text-[10px] sm:text-xs font-bold text-purple-900 uppercase tracking-wider">Current Password</label>
                              <div className="relative">
                                <input required type={showCurrentPassword ? "text" : "password"} value={passwordChange.currentPassword} onChange={e => setPasswordChange({...passwordChange, currentPassword: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-purple-200 text-base focus:ring-2 focus:ring-purple-500 outline-none bg-white"/>
                                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                                  {showCurrentPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                              </div>
                            </div>
                            <div className="hidden sm:block"></div>
                            <div className="space-y-1 md:space-y-2">
                              <label className="text-[10px] sm:text-xs font-bold text-purple-900 uppercase tracking-wider">New Password</label>
                              <div className="relative">
                                <input required type={showNewPassword ? "text" : "password"} value={passwordChange.newPassword} onChange={e => setPasswordChange({...passwordChange, newPassword: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-purple-200 text-base focus:ring-2 focus:ring-purple-500 outline-none bg-white"/>
                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                                  {showNewPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1 md:space-y-2">
                              <label className="text-[10px] sm:text-xs font-bold text-purple-900 uppercase tracking-wider">Confirm New Password</label>
                              <div className="relative">
                                <input required type={showConfirmPassword ? "text" : "password"} value={passwordChange.confirmPassword} onChange={e => setPasswordChange({...passwordChange, confirmPassword: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-purple-200 text-base focus:ring-2 focus:ring-purple-500 outline-none bg-white"/>
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
                                  {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-3 pt-2 md:pt-4">
                          <button type="submit" className="bg-purple-900 text-white px-6 py-2.5 rounded-lg font-bold text-xs md:text-sm hover:bg-purple-800 transition-colors shadow-sm">Save Changes</button>
                          <button type="button" onClick={() => { setIsEditingProfile(false); setIsChangingPassword(false); }} className="text-gray-500 font-bold text-xs md:text-sm px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 max-w-2xl">
                        <div className="space-y-1 md:space-y-2">
                          <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                          <div className="p-2 md:p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                            <p className="text-xs md:text-sm font-semibold text-gray-900 truncate">{user.username}</p>
                          </div>
                        </div>
                        <div className="space-y-1 md:space-y-2">
                          <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                          <div className="p-2 md:p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                            <p className="text-xs md:text-sm font-semibold text-gray-900 truncate">{user.email || 'Not provided'}</p>
                          </div>
                        </div>
                        <div className="space-y-1 md:space-y-2">
                          <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Mobile Number</label>
                          <div className="p-2 md:p-3 bg-gray-50/50 rounded-lg border border-gray-100">
                            <p className="text-xs md:text-sm font-semibold text-gray-900 truncate">{user.mobile || '+91 - Not provided'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Address Section */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-8">
                    <div className="flex flex-row justify-between items-center mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-100">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">Manage Addresses</h3>
                      {!isAddingAddress && (
                        <button onClick={() => setIsAddingAddress(true)} className="bg-purple-900 hover:bg-purple-800 text-white px-3 py-1.5 md:px-5 md:py-2 rounded-lg text-xs md:text-sm font-bold flex items-center space-x-1 md:space-x-2 transition-colors shadow-sm">
                          <Plus size={14}/>
                          <span>Add New</span>
                        </button>
                      )}
                    </div>

                    <AnimatePresence>
                      {isAddingAddress && (
                        <motion.div initial={{height: 0, opacity: 0}} animate={{height: 'auto', opacity: 1}} exit={{height: 0, opacity: 0}} className="overflow-hidden mb-4 md:mb-8">
                          <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide text-[10px] md:text-xs">Add A New Address</h4>
                            <form onSubmit={handleAddAddress} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                              <input placeholder="Full Name" required value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="px-3 py-2 md:py-3 rounded-lg border border-gray-300 text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"/>
                              <input placeholder="Mobile Number" required value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="px-3 py-2 md:py-3 rounded-lg border border-gray-300 text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"/>
                              <input placeholder="Pincode" required value={newAddress.pincode} onChange={e => handlePincodeChange(e, false)} className="px-3 py-2 md:py-3 rounded-lg border border-gray-300 text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"/>
                              <input placeholder="City/Town" required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="px-3 py-2 md:py-3 rounded-lg border border-gray-300 text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"/>
                              <textarea placeholder="Address (House No, Area and Street)" required rows={2} value={newAddress.address} onChange={e => setNewAddress({...newAddress, address: e.target.value})} className="col-span-1 md:col-span-2 px-3 py-2 md:py-3 rounded-lg border border-gray-300 text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"/>
                              <div className="col-span-1 md:col-span-2 flex items-center space-x-3 mt-1 md:mt-2">
                                <button type="submit" className="bg-purple-900 text-white px-6 py-2 rounded-lg font-bold text-xs md:text-sm hover:bg-purple-800 transition-colors shadow-sm">Save</button>
                                <button type="button" onClick={() => setIsAddingAddress(false)} className="text-gray-500 font-bold text-xs md:text-sm px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                              </div>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      {user.addresses?.map((addr, idx) => (
                        editingAddressId === addr._id ? (
                          <div key={addr._id} className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-3 md:mb-4 uppercase tracking-wide text-[10px] md:text-xs">Edit Address</h4>
                            <form onSubmit={(e) => handleEditAddressSave(e, addr._id)} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                              <input placeholder="Full Name" required value={editAddressData.name} onChange={e => setEditAddressData({...editAddressData, name: e.target.value})} className="px-3 py-2 md:py-3 rounded-lg border border-gray-300 text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"/>
                              <input placeholder="Mobile Number" required value={editAddressData.phone} onChange={e => setEditAddressData({...editAddressData, phone: e.target.value})} className="px-3 py-2 md:py-3 rounded-lg border border-gray-300 text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"/>
                              <input placeholder="Pincode" required value={editAddressData.pincode} onChange={e => handlePincodeChange(e, true)} className="px-3 py-2 md:py-3 rounded-lg border border-gray-300 text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"/>
                              <input placeholder="City/Town" required value={editAddressData.city} onChange={e => setEditAddressData({...editAddressData, city: e.target.value})} className="px-3 py-2 md:py-3 rounded-lg border border-gray-300 text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"/>
                              <textarea placeholder="Address (House No, Area and Street)" required rows={2} value={editAddressData.address} onChange={e => setEditAddressData({...editAddressData, address: e.target.value})} className="col-span-1 md:col-span-2 px-3 py-2 md:py-3 rounded-lg border border-gray-300 text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"/>
                              <div className="col-span-1 md:col-span-2 flex items-center space-x-3 mt-1 md:mt-2">
                                <button type="submit" className="bg-purple-900 text-white px-6 py-2 rounded-lg font-bold text-xs md:text-sm hover:bg-purple-800 transition-colors shadow-sm">Save</button>
                                <button type="button" onClick={() => setEditingAddressId(null)} className="text-gray-500 font-bold text-xs md:text-sm px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                              </div>
                            </form>
                          </div>
                        ) : (
                          <div key={addr._id || idx} className="border border-gray-200 rounded-xl p-4 md:p-5 hover:border-purple-300 hover:shadow-sm transition-all group relative bg-gray-50/50">
                            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                              <button onClick={() => { setEditingAddressId(addr._id); setEditAddressData(addr); }} className="p-1 text-gray-400 hover:text-purple-600"><Edit2 size={14}/></button>
                              <button onClick={() => handleDeleteAddress(addr._id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                            </div>
                            
                            <div className="flex items-center space-x-2 mb-2 pr-12">
                              <span className="font-bold text-gray-900 text-sm whitespace-nowrap truncate block min-w-0">{addr.name}</span>
                              {addr.isDefault && <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">Default</span>}
                            </div>
                            <p className="text-xs text-gray-600 mb-1 leading-relaxed truncate">{addr.address}</p>
                            <p className="text-xs text-gray-600 mb-2 truncate">{addr.city} - <span className="font-semibold text-gray-800">{addr.pincode}</span></p>
                            <p className="text-xs text-gray-600 whitespace-nowrap">Mobile: <span className="font-semibold text-gray-800">{addr.phone}</span></p>
                          </div>
                        )
                      ))}

                      {(!user.addresses || user.addresses.length === 0) && !isAddingAddress && (
                        <div className="md:col-span-2 py-8 flex flex-col items-center justify-center text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 mb-2 shadow-sm">
                            <MapPin size={18}/>
                          </div>
                          <p className="text-gray-600 text-sm font-bold mb-1">No addresses saved yet</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Logout for mobile only */}
                  <div className="pt-2 md:hidden">
                     <button onClick={handleLogout} className="w-full bg-white p-3 rounded-lg border border-red-100 flex items-center justify-center space-x-2 text-red-500 font-semibold shadow-sm text-sm">
                       <LogOut size={16}/>
                       <span>Logout</span>
                     </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 md:p-6 border-b border-gray-100 bg-white">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">My Orders</h3>
                  </div>
                  
                  <div className="p-0">
                    {myOrders.length > 0 ? myOrders.map((order) => (
                      <div key={order._id} className="border-b border-gray-100 last:border-b-0 p-4 md:p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row gap-4 md:gap-6">
                        
                        <div className="flex-1 space-y-3 md:space-y-4">
                          <div className="flex items-center space-x-2 md:space-x-3 mb-1">
                            <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${order.orderStatus === 'delivered' ? 'bg-green-500' : order.orderStatus === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                            <span className="text-xs md:text-sm font-bold text-gray-900 uppercase tracking-wide">{order.orderStatus}</span>
                            <span className="text-gray-300">•</span>
                            <span className="text-[10px] md:text-xs font-semibold text-gray-500">ID: {order._id.slice(-8)}</span>
                          </div>
                          
                          <div className="space-y-2 md:space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex space-x-3 md:space-x-4">
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                  <img src={item.image || '/images/placeholder.png'} className="w-full h-full object-cover"/>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                  <h5 className="text-xs md:text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</h5>
                                  <p className="text-[10px] md:text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                  {order.orderStatus === 'delivered' && (
                                    <button 
                                      onClick={() => setReviewingItem({ productId: item.product, name: item.name })}
                                      className="text-[10px] text-purple-700 font-black uppercase tracking-widest mt-2 flex items-center space-x-1 hover:text-purple-900 transition-colors"
                                    >
                                      <Star size={10} fill="currentColor" />
                                      <span>Rate & Review Product</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="md:w-48 md:border-l md:border-gray-100 md:pl-6 flex flex-col justify-center space-y-3 pt-3 border-t border-gray-100 md:border-t-0 md:pt-0">
                          <div className="flex justify-between md:block items-center">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 md:mb-1">Total Paid</p>
                            <p className="text-sm md:text-lg font-black text-purple-900 whitespace-nowrap">₹{order.totalAmount.toLocaleString()}</p>
                          </div>
                          <button 
                            disabled={order.orderStatus === 'cancelled'}
                            onClick={() => setTrackingOrder(order)}
                            className={`flex w-full justify-center items-center space-x-1.5 py-1.5 md:py-2 rounded-lg transition-colors text-xs md:text-sm font-bold shadow-sm border ${
                              order.orderStatus === 'cancelled' 
                                ? 'bg-red-50 text-red-500 border-red-100 cursor-not-allowed'
                                : order.orderStatus === 'delivered'
                                ? 'bg-white text-green-600 border-green-200 hover:bg-green-50'
                                : order.orderStatus === 'shipped' || order.orderStatus === 'out-for-delivery'
                                ? 'bg-purple-900 text-white border-purple-900 hover:bg-purple-800'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:text-purple-800'
                            }`}
                          >
                            <span>
                              {order.orderStatus === 'cancelled' ? 'Cancelled' 
                              : order.orderStatus === 'delivered' ? 'Delivered' 
                              : order.orderStatus === 'shipped' ? 'Track Order'
                              : order.orderStatus === 'out-for-delivery' ? 'Track Order'
                              : 'Processing'}
                            </span>
                            {order.orderStatus !== 'cancelled' && order.orderStatus !== 'delivered' && (
                              <ChevronRight size={14}/>
                            )}
                            {order.orderStatus === 'delivered' && (
                              <CheckCircle2 size={14}/>
                            )}
                            {order.orderStatus === 'cancelled' && (
                              <XCircle size={14}/>
                            )}
                          </button>
                        </div>
                      </div>
                    )) : (
                      <div className="py-12 md:py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3 md:mb-4 border border-gray-100">
                          <ShoppingBag size={20}/>
                        </div>
                        <h4 className="text-base md:text-lg font-bold text-gray-900 mb-1">No Orders Found</h4>
                        <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">Looks like you haven't made your first purchase yet.</p>
                        <button onClick={() => router.push('/products')} className="bg-purple-900 text-white px-5 py-2 md:px-6 md:py-2.5 rounded-lg font-bold text-xs md:text-sm hover:bg-purple-800 transition-colors shadow-sm">Start Shopping</button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setReviewingItem(null)}
              className="absolute inset-0 bg-purple-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gold-50 rounded-xl flex items-center justify-center text-gold-600">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-purple-900">Share Your Experience</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Reviewing: {reviewingItem.name}</p>
                  </div>
                </div>

                <form onSubmit={submitReview} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 block">Your Rating</label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewData({ ...reviewData, rating: star })}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${reviewData.rating >= star ? 'bg-gold-50 text-gold-600' : 'bg-gray-50 text-gray-300'}`}
                        >
                          <Star size={20} fill={reviewData.rating >= star ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 block">Review Comment</label>
                    <textarea 
                      required
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      rows={4}
                      placeholder="What did you love about this item? Was the quality as expected? Our botanical experts appreciate your feedback."
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="submit"
                      className="flex-1 bg-purple-900 text-white font-bold py-4 rounded-2xl hover:bg-purple-800 shadow-luxury transition-all"
                    >
                      Submit Review
                    </button>
                    <button 
                      type="button"
                      onClick={() => setReviewingItem(null)}
                      className="px-6 py-4 rounded-2xl border border-gray-100 text-gray-500 font-bold hover:bg-gray-50 transition-all text-sm"
                    >
                      Skip
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Tracking Modal */}
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setTrackingOrder(null)}
              className="absolute inset-0 bg-purple-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="p-6 md:p-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-900">
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Order Tracking</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-purple-600">ID: #{trackingOrder._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="flex flex-col md:items-end gap-2">
                     <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expected Arrival</span>
                        <span className="bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                          {new Date(new Date(trackingOrder.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </span>
                     </div>
                     <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tracking ID</span>
                        <span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                          {trackingOrder._id.split('').reverse().join('').slice(0, 8).toUpperCase()}
                        </span>
                     </div>
                  </div>
                </div>

                <div className="relative pt-12 pb-20">
                  {/* Progress Line */}
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ 
                        width: trackingOrder.orderStatus === 'delivered' ? '100%' 
                               : trackingOrder.orderStatus === 'out-for-delivery' ? '66%' 
                               : trackingOrder.orderStatus === 'shipped' ? '33%' 
                               : '0%' 
                      }}
                      className="h-full bg-green-500 transition-all duration-1000"
                    />
                  </div>

                  {/* Points */}
                  <div className="relative flex justify-between">
                    {[
                      { id: 'placed', label: 'Order Confirmed', icon: CheckCircle2, color: 'text-blue-500', iconBg: 'bg-blue-50' },
                      { id: 'shipped', label: 'Order Shipped', icon: Package, color: 'text-yellow-500', iconBg: 'bg-yellow-50' },
                      { id: 'out-for-delivery', label: 'Out for Delivery', icon: Truck, color: 'text-cyan-500', iconBg: 'bg-cyan-50' },
                      { id: 'delivered', label: 'Order Delivered', icon: CheckCircle2, color: 'text-green-500', iconBg: 'bg-green-50' }
                    ].map((step, index) => {
                      const statuses = ['placed', 'shipped', 'out-for-delivery', 'delivered'];
                      const currentIdx = statuses.indexOf(trackingOrder.orderStatus);
                      const isCompleted = index <= currentIdx;
                      const isActive = index === currentIdx;

                      return (
                        <div key={step.id} className="flex flex-col items-center relative z-10 w-1/4">
                          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            <CheckCircle2 size={16} className={isCompleted ? 'opacity-100' : 'opacity-0'} />
                          </div>
                          
                          <div className="mt-6 flex flex-col items-center text-center">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors ${isCompleted ? step.iconBg : 'bg-gray-50'}`}>
                              <step.icon size={20} className={isCompleted ? step.color : 'text-gray-300'} />
                            </div>
                            <span className={`text-[9px] md:text-[11px] font-bold uppercase tracking-widest leading-tight px-1 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step.label}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => setTrackingOrder(null)}
                    className="bg-purple-900 text-white font-bold px-10 py-4 rounded-2xl hover:bg-purple-800 transition-all text-sm shadow-luxury"
                  >
                    Close Tracking
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
