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
                <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} className="space-y-3">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center justify-between">
                    <h3 className="text-base font-bold text-gray-900">My Orders</h3>
                    <span className="text-xs text-gray-400 font-medium">{myOrders.length} order{myOrders.length !== 1 ? 's' : ''}</span>
                  </div>

                  {myOrders.length > 0 ? myOrders.map((order) => {
                    const statusMap = {
                      placed:            { label: 'Order Confirmed',    color: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500' },
                      processing:        { label: 'Processing',         color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
                      shipped:           { label: 'Shipped',            color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
                      'out-for-delivery':{ label: 'Out for Delivery',   color: 'bg-cyan-100 text-cyan-700',   dot: 'bg-cyan-500' },
                      delivered:         { label: 'Delivered',          color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
                      cancelled:         { label: 'Cancelled',          color: 'bg-red-100 text-red-600',     dot: 'bg-red-500' },
                    };
                    const s = statusMap[order.orderStatus] || statusMap.placed;
                    return (
                      <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Order Header */}
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${s.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                              <span>{s.label}</span>
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] text-gray-400 font-medium">Order #{order._id.slice(-8).toUpperCase()}</p>
                            <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="divide-y divide-gray-50">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-3 px-4 py-3">
                              <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                                <img src={item.image || '/images/placeholder.png'} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug">{item.name}</p>
                                <p className="text-[11px] text-gray-500 mt-0.5">Qty: {item.quantity} · ₹{item.price?.toLocaleString()}</p>
                                {order.orderStatus === 'delivered' && (
                                  <button
                                    onClick={() => setReviewingItem({ productId: item.product, name: item.name })}
                                    className="mt-1.5 inline-flex items-center space-x-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 transition-colors"
                                  >
                                    <Star size={11} fill="currentColor" />
                                    <span>Rate &amp; Review</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer */}
                        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Total Paid</p>
                            <p className="text-sm font-black text-purple-900">₹{order.totalAmount.toLocaleString()}</p>
                          </div>
                          <button
                            onClick={() => setTrackingOrder(order)}
                            disabled={order.orderStatus === 'cancelled'}
                            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              order.orderStatus === 'cancelled'
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : order.orderStatus === 'delivered'
                                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                : 'bg-purple-900 text-white hover:bg-purple-800'
                            }`}
                          >
                            {order.orderStatus === 'cancelled' ? (
                              <><XCircle size={13} /><span>Cancelled</span></>
                            ) : order.orderStatus === 'delivered' ? (
                              <><CheckCircle2 size={13} /><span>View Details</span></>
                            ) : (
                              <><Truck size={13} /><span>Track Order</span></>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 flex flex-col items-center justify-center text-center">
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-4 border border-gray-100">
                        <Package size={26} />
                      </div>
                      <h4 className="text-base font-bold text-gray-800 mb-1">No Orders Yet</h4>
                      <p className="text-xs text-gray-500 mb-5 max-w-xs">Looks like you haven't placed any orders. Explore our pure botanical collection!</p>
                      <button onClick={() => router.push('/products')} className="bg-purple-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-purple-800 transition-colors">
                        Explore Collection
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewingItem && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setReviewingItem(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              className="w-full md:max-w-md bg-white rounded-t-3xl md:rounded-2xl shadow-2xl relative z-10 overflow-hidden"
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>

              <div className="px-5 pt-3 pb-6 md:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Rate &amp; Review</h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{reviewingItem.name}</p>
                  </div>
                  <button onClick={() => setReviewingItem(null)} className="text-gray-400 hover:text-gray-600 p-1">
                    <XCircle size={20} />
                  </button>
                </div>

                <form onSubmit={submitReview} className="space-y-4">
                  {/* Star Rating */}
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Your Rating</p>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewData({ ...reviewData, rating: star })}
                          className="transition-transform hover:scale-110 active:scale-95"
                        >
                          <Star
                            size={32}
                            className={reviewData.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewData.rating]} · {reviewData.rating}/5
                    </p>
                  </div>

                  {/* Comment */}
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Your Review</p>
                    <textarea
                      required
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      rows={3}
                      placeholder="Share your experience — how did this product transform your routine?"
                      className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-purple-900 text-white font-bold py-3 rounded-xl hover:bg-purple-800 transition-colors text-sm"
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewingItem(null)}
                      className="px-4 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Order Tracking Modal — Vertical Stepper */}
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setTrackingOrder(null)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              className="w-full md:max-w-sm bg-white rounded-t-3xl md:rounded-2xl shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1 md:hidden sticky top-0 bg-white">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>

              <div className="px-5 pt-3 pb-6 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Order Tracking</h3>
                    <p className="text-[11px] text-purple-600 font-bold">#{trackingOrder._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <button onClick={() => setTrackingOrder(null)} className="text-gray-400 hover:text-gray-600 p-1">
                    <XCircle size={20} />
                  </button>
                </div>

                {/* Info pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-3 py-1.5 rounded-full">
                    📅 Ordered: {new Date(trackingOrder.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1.5 rounded-full">
                    🚚 ETA: {new Date(new Date(trackingOrder.createdAt).getTime() + 5 * 86400000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-full">
                    ₹{trackingOrder.totalAmount?.toLocaleString()}
                  </span>
                </div>

                {/* Vertical Stepper */}
                {(() => {
                  const steps = [
                    { id: 'placed',            label: 'Order Confirmed',    desc: 'Your order has been placed & confirmed.',       Icon: CheckCircle2, activeColor: 'text-blue-600',   activeBg: 'bg-blue-100',   line: 'bg-blue-200' },
                    { id: 'shipped',           label: 'Shipped',            desc: 'Your package is on its way to the hub.',        Icon: Package,      activeColor: 'text-yellow-600', activeBg: 'bg-yellow-100', line: 'bg-yellow-200' },
                    { id: 'out-for-delivery',  label: 'Out for Delivery',   desc: 'Delivery partner is heading to your address.',  Icon: Truck,        activeColor: 'text-cyan-600',  activeBg: 'bg-cyan-100',   line: 'bg-cyan-200' },
                    { id: 'delivered',         label: 'Delivered',          desc: 'Package delivered. Enjoy your botanicals! 🌿',  Icon: CheckCircle2, activeColor: 'text-green-600', activeBg: 'bg-green-100',  line: 'bg-green-200' },
                  ];
                  const statuses = ['placed', 'shipped', 'out-for-delivery', 'delivered'];
                  const currentIdx = statuses.indexOf(trackingOrder.orderStatus);

                  return (
                    <div className="space-y-0">
                      {steps.map((step, i) => {
                        const done = i <= currentIdx;
                        const active = i === currentIdx;
                        const Icon = step.Icon;
                        const isLast = i === steps.length - 1;

                        return (
                          <div key={step.id} className="flex items-start">
                            {/* Icon column */}
                            <div className="flex flex-col items-center mr-4">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                done ? step.activeBg : 'bg-gray-100'
                              } ${active ? 'ring-2 ring-offset-1 ring-purple-400' : ''}`}>
                                <Icon size={16} className={done ? step.activeColor : 'text-gray-300'} />
                              </div>
                              {!isLast && (
                                <div className={`w-0.5 h-10 mt-1 rounded-full ${done ? step.line : 'bg-gray-100'}`} />
                              )}
                            </div>

                            {/* Content */}
                            <div className={`flex-1 pb-6 ${isLast ? '' : ''}`}>
                              <div className="flex items-center space-x-2">
                                <p className={`text-sm font-bold ${done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                                {active && (
                                  <span className="text-[9px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full uppercase tracking-wide">Current</span>
                                )}
                              </div>
                              <p className={`text-xs mt-0.5 ${done ? 'text-gray-500' : 'text-gray-300'}`}>{step.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}

                {trackingOrder.orderStatus === 'cancelled' && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
                    <p className="text-sm font-bold text-red-600 flex items-center space-x-2">
                      <XCircle size={16} />
                      <span>Order Cancelled</span>
                    </p>
                    <p className="text-xs text-red-500 mt-1">This order was cancelled. Refund (if applicable) will be processed within 5-7 business days.</p>
                  </div>
                )}

                <button
                  onClick={() => setTrackingOrder(null)}
                  className="w-full bg-purple-900 text-white font-bold py-3 rounded-xl hover:bg-purple-800 transition-colors text-sm mt-2"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
