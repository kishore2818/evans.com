import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Lock, User, Mail, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [forgotStep, setForgotStep] = useState('none'); // 'none', 'request', 'verify', 'reset'
  const [forgotMobile, setForgotMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { login, register, logout, loading, error, clearError, forgotPassword, verifyOTP, resetPassword } = useAuthStore();

  const handleForgotRequest = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(forgotMobile);
      setForgotStep('verify');
    } catch (err) {}
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await verifyOTP(forgotMobile, otp);
      setForgotStep('reset');
    } catch (err) {}
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({ mobile: forgotMobile, otp, newPassword });
      setForgotStep('none');
      setIsLogin(true);
      toast.success('Password reset successful! Please login.');
    } catch (err) {}
  };

  const from = '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      logout();
      if (isLogin) {
        await login(formData.mobile, formData.password);
      } else {
        await register(formData.username, formData.email, formData.mobile, formData.password);
      }
      router.replace(from);
    } catch (err) {}
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setForgotStep('none');
    clearError();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-luxury p-8 md:p-12 border border-purple-50"
      >
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl font-bold text-purple-900 mb-2">
            {forgotStep !== 'none' ? 'Recover Password' : (isLogin ? 'Welcome Back' : 'Join Evans Luxe')}
          </h2>
          <p className="text-gray-500 text-sm">
            {forgotStep === 'request' && 'Enter your mobile number to receive a 6-digit OTP'}
            {forgotStep === 'verify' && 'We have sent an OTP to your mobile number'}
            {forgotStep === 'reset' && 'Set a strong new password for your account'}
            {forgotStep === 'none' && (isLogin ? 'Sign in to access your cart and wishlist' : 'Create an account for a premium botanical experience')}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl mb-6 flex items-start space-x-3 text-sm"
            >
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {forgotStep === 'request' && (
          <form onSubmit={handleForgotRequest} className="space-y-5">
            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                placeholder="Registered Mobile Number"
                required
                className="w-full pl-12 pr-4 py-4 bg-beige-50 border border-beige-100 rounded-2xl text-base focus:outline-none focus:border-purple-300 transition-colors"
                value={forgotMobile}
                onChange={(e) => setForgotMobile(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-purple-800 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <span>Send OTP</span>}
            </button>
            <button onClick={() => setForgotStep('none')} className="w-full text-gray-500 text-sm font-semibold">Back to Login</button>
          </form>
        )}

        {forgotStep === 'verify' && (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                required
                maxLength={6}
                className="w-full pl-12 pr-4 py-4 bg-beige-50 border border-beige-100 rounded-2xl text-sm focus:outline-none focus:border-purple-300 transition-colors tracking-[0.5em] text-center font-bold"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-purple-800 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <span>Verify OTP</span>}
            </button>
            <button onClick={() => setForgotStep('request')} className="w-full text-gray-500 text-sm font-semibold">Resend OTP</button>
          </form>
        )}

        {forgotStep === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                required
                className="w-full pl-12 pr-12 py-4 bg-beige-50 border border-beige-100 rounded-2xl text-base focus:outline-none focus:border-purple-300 transition-colors"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-purple-800 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : <span>Update Password</span>}
            </button>
          </form>
        )}

        {forgotStep === 'none' && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-beige-50 border border-beige-100 rounded-2xl text-sm focus:outline-none focus:border-purple-300 transition-colors"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            )}

            {!isLogin && (
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-beige-50 border border-beige-100 rounded-2xl text-sm focus:outline-none focus:border-purple-300 transition-colors"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            )}

            <div className="relative">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="tel"
                placeholder="Mobile Number"
                required
                className="w-full pl-12 pr-4 py-4 bg-beige-50 border border-beige-100 rounded-2xl text-sm focus:outline-none focus:border-purple-300 transition-colors"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="w-full pl-12 pr-12 py-4 bg-beige-50 border border-beige-100 rounded-2xl text-base focus:outline-none focus:border-purple-300 transition-colors"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {isLogin && (
              <div className="text-right">
                <button 
                  type="button" 
                  onClick={() => setForgotStep('request')}
                  className="text-xs font-bold text-purple-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-purple-800 transition-colors disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm">
          <p className="text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={toggleMode}
              className="ml-2 text-purple-700 font-bold hover:underline"
            >
              {isLogin ? 'Create one now' : 'Sign in here'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
