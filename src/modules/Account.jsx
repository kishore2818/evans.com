import React from 'react';
import { ChevronLeft, Key, User, Shield, Bell, HelpCircle, Edit3, ChevronRight, LogOut } from 'lucide-react';
import { useNavigate, Navigate, useLocation } from '@/router-shim';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Account = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const accountSections = [
    { icon: Edit3, label: 'Personal Info', desc: `Manage your details`, value: user.username, action: 'Edit' },
    { icon: User, label: 'Mobile Number', desc: `Communication preferences`, value: user.mobile, action: 'Verify' },
    { icon: Key, label: 'Change Password', desc: 'Secure your account with a new password' },
    { icon: Shield, label: 'Privacy Settings', desc: 'Control your data and visibility' },
    { icon: Bell, label: 'Notification Preferences', desc: 'Manage alerts and marketing emails' },
    { icon: HelpCircle, label: 'Contact Support', desc: 'Get help from our customer service team' },
  ];

  return (
    <div className="px-6 md:px-12 pt-8 md:pt-16 pb-24 md:pb-12 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center space-x-2 text-purple-600 hover:text-purple-900 font-semibold mb-6 md:mb-10 transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>

      <div className="mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-purple-900 mb-3">My Account Details</h1>
        <p className="text-gray-500 font-medium">Manage your personal information and account preferences.</p>
      </div>

      <div className="space-y-4 mb-10">
        {accountSections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div 
              key={idx} 
              className="bg-white p-5 md:p-6 rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between shadow-sm hover:shadow-md transition-shadow border border-beige-100/50 group cursor-pointer"
            >
              <div className="flex items-center space-x-5 mb-4 sm:mb-0">
                <div className="w-12 h-12 bg-beige-50 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-purple-50 group-hover:text-purple-700 text-gray-400">
                  <Icon size={22} className="stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-gray-900 mb-1">{section.label}</h3>
                  <p className="text-sm text-gray-500">{section.value ? <span className="font-semibold text-purple-600 mr-2">{section.value}</span> : null}{section.desc}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-end sm:justify-start">
                {section.action ? (
                  <button className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs px-5 py-2.5 rounded-xl uppercase tracking-widest transition-colors flex items-center space-x-2">
                    <Icon size={14} />
                    <span>{section.action}</span>
                  </button>
                ) : (
                  <button className="text-gray-300 group-hover:text-purple-500 p-2 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={handleLogout}
        className="w-full md:w-auto flex items-center justify-center space-x-2 text-red-500 hover:text-red-700 font-semibold py-3 px-6 rounded-xl hover:bg-red-50 transition-colors mx-auto"
      >
        <LogOut size={18} />
        <span>Log Out Completely</span>
      </button>

    </div>
  );
};

export default Account;
