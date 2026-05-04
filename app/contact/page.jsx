'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Mail, Send, Loader2, CheckCircle } from 'lucide-react';


const contactDetails = [
  {
    icon: MapPin,
    label: 'Store Address',
    value: "2F6H+8HV, Bhagavathi Amman Kovil St,\nNRT Nagar, Theni,\nTamil Nadu 625531",
    color: 'text-purple-700',
    bg: 'bg-purple-50',
  },
  {
    icon: Clock,
    label: 'Store Hours',
    value: 'Mon – Sat: 9:00 AM – 8:00 PM\nSunday: 10:00 AM – 6:00 PM',
    color: 'text-gold-600',
    bg: 'bg-gold-50',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 89037 77150',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    href: 'tel:+918903777150',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@evansluxe.com',
    color: 'text-gold-600',
    bg: 'bg-gold-50',
    href: 'mailto:hello@evansluxe.com',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate send delay
    await new Promise((r) => setTimeout(r, 1500));
    setStatus('success');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="pb-8">
      {/* Hero Banner */}
      <div className="relative py-12 md:py-16 px-6 md:px-16 bg-purple-900 text-white rounded-b-[2.5rem] md:rounded-[3rem] md:mx-6 overflow-hidden shadow-2xl mb-12 md:mb-20">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-300 text-[10px] md:text-sm font-semibold tracking-[0.3em] uppercase mb-4"
          >
            We'd Love to Hear From You
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-purple-200 text-sm md:text-base max-w-md mx-auto"
          >
            Visit our store, drop us a message, or simply say hello — we're always happy to help.
          </motion.p>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="px-6 md:px-16 mb-14 md:mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contactDetails.map((item, idx) => {
            const Icon = item.icon;
            const content = (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-[2rem] p-6 shadow-card border border-beige-100 hover:shadow-luxury transition-all duration-300 flex flex-col"
              >
                <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center mb-4`}>
                  <Icon size={22} className={item.color} strokeWidth={2} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800 leading-relaxed whitespace-pre-line">{item.value}</p>
              </motion.div>
            );

            return item.href ? (
              <a key={idx} href={item.href} className="block">{content}</a>
            ) : (
              <div key={idx}>{content}</div>
            );
          })}
        </div>
      </div>

      {/* Map + Form side by side */}
      <div className="px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">

        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[2rem] overflow-hidden shadow-card border border-beige-100"
        >
          <div className="p-5 border-b border-beige-100">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center">
                <MapPin size={18} className="text-purple-700" />
              </div>
              <div>
                <p className="font-bold text-purple-900 text-sm">Find Us Here</p>
                <p className="text-xs text-gray-400">Evan's Luxe Beauty, Theni</p>
              </div>
            </div>
          </div>
          <div className="w-full h-[350px] md:h-[420px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0726040450477!2d77.47635507539985!3d10.01086169009511!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b07150051a28181%3A0x50d5c17788c51e43!2sEvan&#39;s%20Luxe%20Beauty!5e0!3m2!1sen!2sin!4v1777861520141!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Evans Luxe Beauty Location"
            />
          </div>
          <div className="p-5">
            <a
              href="https://maps.google.com/?q=Evan's+Luxe+Beauty+Theni+Tamil+Nadu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 w-full bg-purple-900 text-white py-3 rounded-2xl font-bold text-sm hover:bg-purple-800 transition-colors"
            >
              <MapPin size={16} />
              <span>Get Directions</span>
            </a>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[2rem] p-6 md:p-8 shadow-card border border-beige-100"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-purple-900 mb-2">Send a Message</h2>
          <p className="text-sm text-gray-500 mb-8">Fill in the form below and we'll get back to you within 24 hours.</p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-purple-900 mb-2">Message Sent!</h3>
              <p className="text-gray-500 text-sm max-w-xs">Thank you for reaching out. Our team will contact you shortly.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-8 text-purple-700 font-bold text-sm hover:underline"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  id="contact-name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-4 bg-beige-50 border border-beige-100 rounded-2xl text-sm focus:outline-none focus:border-purple-300 transition-colors placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  id="contact-email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-4 bg-beige-50 border border-beige-100 rounded-2xl text-sm focus:outline-none focus:border-purple-300 transition-colors placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Message</label>
                <textarea
                  name="message"
                  id="contact-message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help you today?"
                  className="w-full px-4 py-4 bg-beige-50 border border-beige-100 rounded-2xl text-sm focus:outline-none focus:border-purple-300 transition-colors resize-none placeholder:text-gray-300"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-purple-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-purple-800 transition-colors disabled:opacity-70"
              >
                {status === 'loading' ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      {/* Bottom tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-6 md:px-16 mt-20"
      >
        <div className="bg-gradient-to-br from-purple-50 to-gold-50 rounded-[3rem] p-8 md:p-12 text-center border border-purple-100/50 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-purple-400 mb-3">Our Promise</p>
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-purple-900 mb-3">
            Beauty That Cares
          </h3>
          <p className="text-sm md:text-base text-purple-800/70 max-w-lg mx-auto">
            Every product is crafted with love, sourced sustainably, and designed to make you feel your most radiant self.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
