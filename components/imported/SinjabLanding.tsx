'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SINJAB SPORTS TECH LANDING PAGE
 * Mobile-First, High-Performance Design
 * Next.js 14 App Router Compatible
 * Dependencies: framer-motion, tailwindcss
 */

// --- THEME CONSTANTS ---
const COLORS = {
  navyDeep: '#0C125C',
  black: '#000000',
  sinjabBlue: '#1B5BCC',
  white: '#FFFFFF',
  lightGray: '#E5E7EB',
};

// --- NAV ITEMS ---
const NAV_ITEMS = [
  { id: 'hero', label: 'Home' },
  { id: 'feeds', label: 'Updates' },
  { id: 'b2b', label: 'Partners' },
  { id: 'features', label: 'Features' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
];

// --- HEADER WITH SCROLL SPY ---
const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll spy logic
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`w-full px-4 md:px-8 py-3 md:py-4 transition-all duration-500 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center group">
            <img 
              src="/Logopluswordmark%20white%20no%20background.svg" 
              alt="Sinjab" 
              className="h-[35px] w-auto group-hover:opacity-90 transition-opacity"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="relative px-4 py-2 text-sm font-medium transition-colors"
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 bg-[#1B5BCC] rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className={`relative z-10 ${
                    activeSection === item.id ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </span>
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#pricing"
              className="px-5 py-2.5 bg-[#1B5BCC] text-white text-sm font-bold rounded-full hover:bg-[#1B5BCC]/90 transition-all min-h-[44px] flex items-center"
            >
              Partner With Us
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 flex items-center justify-center bg-white/10 rounded-full"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <span
                className={`block h-0.5 bg-white transition-transform ${
                  mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-white transition-opacity ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 bg-white transition-transform ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="p-4 space-y-2">
                {NAV_ITEMS.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeSection === item.id
                        ? 'bg-[#1B5BCC] text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <a
                    href="https://apps.apple.com/us/app/setpoint-app/id1596309430"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-black text-sm font-bold rounded-xl min-h-[44px]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    App Store
                  </a>
                  <a
                    href="https://play.google.com/store/apps/details?id=com.setpoint.android&hl=en&gl=US"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-black text-sm font-bold rounded-xl min-h-[44px]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
                    </svg>
                    Google Play
                  </a>
                  <a
                    href="#pricing"
                    className="block w-full px-4 py-3 bg-[#1B5BCC] text-white text-sm font-bold rounded-xl text-center min-h-[44px]"
                  >
                    Partner With Us
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
};

// --- ODOMETER DIGIT COMPONENT ---
const OdometerDigit = ({ digit, prevDigit }: { digit: string; prevDigit: string }) => {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayDigit, setDisplayDigit] = useState(digit);

  useEffect(() => {
    if (digit !== prevDigit && prevDigit !== '') {
      const currentNum = parseInt(digit) || 0;
      const prevNum = parseInt(prevDigit) || 0;
      
      // Determine direction: increase = slide down, decrease = slide up
      if (currentNum > prevNum || (prevNum === 9 && currentNum === 0)) {
        setDirection('down');
      } else if (currentNum < prevNum || (prevNum === 0 && currentNum === 9)) {
        setDirection('up');
      }
      
      setIsAnimating(true);
      
      // Update display after animation starts
      const timeout = setTimeout(() => {
        setDisplayDigit(digit);
        setIsAnimating(false);
      }, 300);
      
      return () => clearTimeout(timeout);
    } else {
      setDisplayDigit(digit);
    }
  }, [digit, prevDigit]);

  // Handle comma separately
  if (digit === ',') {
    return <span className="text-white font-semibold" style={{ fontFamily: 'ui-monospace, monospace' }}>,</span>;
  }

  return (
    <span 
      className="inline-block overflow-hidden relative"
      style={{ 
        width: '0.6em',
        height: '1.2em',
        fontFamily: 'ui-monospace, monospace'
      }}
    >
      <span
        className="absolute inset-0 flex items-center justify-center text-white font-semibold transition-transform duration-300 ease-out"
        style={{
          transform: isAnimating
            ? direction === 'down'
              ? 'translateY(-100%)'
              : 'translateY(100%)'
            : 'translateY(0)',
        }}
      >
        {prevDigit !== '' && prevDigit !== ',' ? prevDigit : displayDigit}
      </span>
      <span
        className="absolute inset-0 flex items-center justify-center text-white font-semibold transition-transform duration-300 ease-out"
        style={{
          transform: isAnimating
            ? 'translateY(0)'
            : direction === 'down'
              ? 'translateY(100%)'
              : 'translateY(-100%)',
        }}
      >
        {displayDigit}
      </span>
    </span>
  );
};

// --- ODOMETER COUNTER COMPONENT ---
const OdometerCounter = ({ value }: { value: number }) => {
  const [prevValue, setPrevValue] = useState(value);
  const formattedValue = value.toLocaleString().padStart(7, ' '); // "XXX,XXX" format
  const formattedPrevValue = prevValue.toLocaleString().padStart(7, ' ');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPrevValue(value);
    }, 350);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <span className="inline-flex items-center" style={{ fontFamily: 'ui-monospace, monospace' }}>
      {formattedValue.split('').map((char, idx) => (
        <OdometerDigit 
          key={idx} 
          digit={char} 
          prevDigit={formattedPrevValue[idx] || ''} 
        />
      ))}
    </span>
  );
};

// --- HERO SECTION ---
const Hero = () => {
  // Initialize with a random starting point between 120,000 and 121,000
  const [playerCount, setPlayerCount] = useState(() => {
    return Math.floor(Math.random() * (121000 - 120000 + 1)) + 120000;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerCount(prev => {
        // Random change between 8-12 players
        const change = Math.floor(Math.random() * 5) + 8; // 8 to 12
        // Randomly decide to increase or decrease (slightly favor increase for growth feel)
        const direction = Math.random() > 0.45 ? 1 : -1;
        let newCount = prev + (change * direction);
        
        // Keep within reasonable bounds (soft limits)
        if (newCount > 121500) newCount = prev - change;
        if (newCount < 119500) newCount = prev + change;
        
        return newCount;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '370+', label: 'Partner Clubs' },
    { value: '250k+', label: 'App Downloads' },
    { value: '20+', label: 'Cities Covered' },
    { value: '90%', label: 'Padel Market Share' },
  ];

  return (
    <div className="container mx-auto px-5 md:px-6 pt-24 md:pt-32 pb-16">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-gray-300 flex items-center gap-1">
            <OdometerCounter value={playerCount} />
            <span> players active this month</span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.1] text-white"
        >
          The Operating System for{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B5BCC] to-blue-400">
            Modern Sports Clubs
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg md:text-xl text-[#E5E7EB] max-w-2xl mx-auto leading-relaxed"
        >
          Manage bookings, maximize court utilization, and connect with Saudi Arabia&apos;s largest
          community of players.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <a
            href="https://apps.apple.com/us/app/setpoint-app/id1596309430"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all min-h-[52px] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            App Store
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.setpoint.android&hl=en&gl=US"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-all min-h-[52px] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
            </svg>
            Google Play
          </a>
          <a
            href="#pricing"
            className="px-6 py-4 bg-[#1B5BCC] text-white font-bold rounded-xl hover:bg-[#1B5BCC]/90 transition-all min-h-[52px] flex items-center justify-center"
          >
            Partner With Us
          </a>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-12 mt-8 border-t border-white/10"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-4">
              <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-500 uppercase tracking-wider font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

// --- FEEDS / UPDATES MARQUEE ---
const Feeds = () => {
  const updates = [
    { title: 'New Partnership', desc: 'Noon integration complete', color: 'green' },
    { title: 'Platform Update', desc: 'Split payments now live', color: 'blue' },
    { title: '99.99% Uptime', desc: 'System reliability maintained', color: 'purple' },
    { title: 'Expansion', desc: 'Now active in 20+ cities', color: 'yellow' },
    { title: 'App Update', desc: 'v4.2 released with new features', color: 'blue' },
    { title: 'Milestone', desc: '250k downloads achieved', color: 'green' },
  ];

  const colorMap: Record<string, string> = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
  };

  const doubledUpdates = [...updates, ...updates];

  return (
    <div className="relative flex whitespace-nowrap overflow-hidden py-6">
      <motion.div
        animate={{ x: [0, -1500] }}
        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        className="flex gap-6 items-center"
      >
        {doubledUpdates.map((item, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 bg-white/5 backdrop-blur-md px-6 py-4 rounded-xl border border-white/5 flex items-start gap-3 hover:border-white/20 transition-all cursor-default"
          >
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${colorMap[item.color]} shadow-lg`} />
            <div>
              <div className="text-sm font-bold text-white mb-0.5">{item.title}</div>
              <div className="text-xs text-gray-500">{item.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// --- B2B TRUST SECTION ---
const B2BTrust = () => {
  const partners = ["Monsha'at", 'Roshn', 'WeBook'];

  return (
    <div className="container mx-auto px-5 md:px-6">
      <div className="flex flex-col items-center gap-8 md:gap-12">
        <h3 className="text-gray-500 text-xs md:text-sm font-bold uppercase tracking-[0.15em] text-center">
          Trusted by Industry Leaders
        </h3>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="grid grid-cols-3 gap-6 md:gap-12 w-full max-w-3xl">
          {partners.map((partner) => (
            <motion.div
              key={partner}
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center p-4 md:p-6 bg-white/[0.02] rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer"
            >
              <div className="text-lg md:text-xl font-bold text-white/60 hover:text-white transition-colors">
                {partner.toUpperCase()}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
};

// --- FEATURES GRID ---
const Features = () => {
  const features = [
    {
      title: 'Smart Bookings',
      description: 'Prevent double-booking with our real-time centralized calendar.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      color: 'blue',
    },
    {
      title: 'Player App',
      description: 'Direct exposure to 250k+ players looking for courts nearby.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      color: 'green',
    },
    {
      title: 'Split Payments',
      description: 'Let players split the bill instantly. Automated & hassle-free.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: 'purple',
    },
    {
      title: 'Dynamic Pricing',
      description: 'Set peak/off-peak rates to maximize revenue.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      color: 'yellow',
    },
  ];

  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    blue: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
    green: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' },
    purple: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
    yellow: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  };

  return (
    <div className="container mx-auto px-5 md:px-6">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Everything Your Club Needs
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Powerful tools designed specifically for modern sports facility management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/20 transition-all group"
          >
            <div
              className={`w-12 h-12 ${colorClasses[feature.color].bg} rounded-xl flex items-center justify-center ${colorClasses[feature.color].text} ${colorClasses[feature.color].border} border mb-4 group-hover:scale-110 transition-transform`}
            >
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
            <p className="text-[#E5E7EB] text-sm leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- PRICING SECTION ---
const Pricing = () => {
  const tiers = [
    {
      name: 'Basic',
      tagline: 'Essential Management Tools',
      priceSmall: '800',
      priceLarge: '1,200',
      commission: { strikethrough: '8%', actual: '4.9%' },
      features: [
        'Customizable Scheduling System',
        'All-in-One Dashboard',
        'Monthly Operations Reports',
        'Integrated Invoicing System',
        'Apple Pay & POS Support',
      ],
      recommended: false,
      comingSoon: false,
      cta: 'Get Started',
    },
    {
      name: 'Advanced',
      tagline: 'Complete Business Solution',
      priceSmall: '1,000',
      priceLarge: '1,700',
      commission: { strikethrough: '8%', actual: '4.9%' },
      features: [
        'Everything in Basic, plus:',
        'Training Management',
        'Advanced Booking Packages',
        'Peak-hours Dynamic Pricing',
        'Split Payment Engine',
        'Built-in Accounting Software',
        'Statistical Performance Tracking',
      ],
      recommended: true,
      comingSoon: false,
      cta: 'Get Started',
    },
    {
      name: 'Growth',
      tagline: 'Enterprise Features',
      priceSmall: null,
      priceLarge: null,
      commission: null,
      features: [
        'Everything in Advanced, plus:',
        'Full Tournament Management',
        'Match Making Engine',
      ],
      recommended: false,
      comingSoon: true,
      cta: 'Coming Soon',
    },
  ];

  return (
    <div className="container mx-auto px-5 md:px-6">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto">
          Choose the plan that fits your club&apos;s needs. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
        {tiers.map((tier) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`relative p-6 md:p-8 rounded-2xl md:rounded-3xl border transition-all duration-500 backdrop-blur-xl ${
              tier.comingSoon
                ? 'bg-white/5 border-white/10 grayscale opacity-60'
                : tier.recommended
                ? 'bg-[#1B5BCC]/10 border-[#1B5BCC]/50 shadow-[0_0_40px_rgba(27,91,204,0.15)]'
                : 'bg-white/5 border-white/10 hover:border-white/30'
            }`}
          >
            {tier.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#1B5BCC] text-[10px] font-black uppercase tracking-widest rounded-full text-white whitespace-nowrap">
                Most Recommended
              </div>
            )}
            {tier.comingSoon && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-600 text-[10px] font-black uppercase tracking-widest rounded-full text-white whitespace-nowrap">
                Coming Soon
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">
                {tier.name}
              </h4>
              <p className="text-[#E5E7EB] text-sm mb-4">{tier.tagline}</p>
              
              {tier.comingSoon ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">Coming Soon</span>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">{tier.priceSmall}</span>
                      <span className="text-gray-500 text-sm">SAR/mo</span>
                      <span className="text-gray-500 text-xs ml-1">(≤3 courts)</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">{tier.priceLarge}</span>
                      <span className="text-gray-500 text-sm">SAR/mo</span>
                      <span className="text-gray-500 text-xs ml-1">(&gt;3 courts)</span>
                    </div>
                  </div>
                  {tier.commission && (
                    <p className="text-xs text-gray-500 mt-3">
                      Commission: <span className="line-through text-gray-600">{tier.commission.strikethrough}</span>{' '}
                      <span className="text-[#1B5BCC] font-semibold">{tier.commission.actual}</span>
                    </p>
                  )}
                </>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              {tier.features.map((feature, idx) => (
                <li key={feature} className={`flex items-center gap-3 text-sm text-[#E5E7EB] ${idx === 0 && feature.includes('Everything') ? 'font-semibold text-white' : ''}`}>
                  <svg
                    className={`w-5 h-5 flex-shrink-0 ${tier.recommended ? 'text-[#1B5BCC]' : tier.comingSoon ? 'text-gray-500' : 'text-gray-600'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              disabled={tier.comingSoon}
              className={`w-full py-4 font-bold rounded-xl transition-all min-h-[52px] ${
                tier.comingSoon
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : tier.recommended
                  ? 'bg-[#1B5BCC] text-white shadow-[0_0_20px_rgba(27,91,204,0.4)] hover:bg-[#1B5BCC]/90'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
              }`}
            >
              {tier.cta}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- FAQ SECTION ---
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does Sinjab help my club get more bookings?',
      a: 'Your club gets listed on our player app with 250k+ active users. Players can discover and book your courts directly, bringing you new customers without any marketing effort.',
    },
    {
      q: 'What payment methods do you support?',
      a: 'We support all major payment methods including Mada, Visa, Mastercard, Apple Pay, and STC Pay. Players can also split payments among themselves.',
    },
    {
      q: 'Can I set different prices for peak and off-peak hours?',
      a: 'Yes! Our dynamic pricing engine lets you set custom rates for different time slots, days, and seasons to maximize your revenue.',
    },
    {
      q: 'How quickly can I get started?',
      a: 'Most clubs are onboarded within 24 hours. Our team handles the setup and training so you can start accepting bookings immediately.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-6">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-white">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3 md:space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300"
          >
            <button
              className="w-full px-5 md:px-8 py-5 md:py-6 flex items-center justify-between hover:bg-white/5 text-white min-h-[56px]"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <span className="font-bold text-left text-sm md:text-base pr-4">{faq.q}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                  openIndex === idx ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-5 md:px-8 pb-5 md:pb-6 border-t border-white/5"
                >
                  <p className="text-[#E5E7EB] text-sm md:text-base mt-4 leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- FOOTER ---
const Footer = () => (
  <footer className="py-16 md:py-20 border-t border-white/5">
    <div className="container mx-auto px-5 md:px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16 text-white">
        <div className="col-span-2 md:col-span-1 space-y-6">
          <div className="flex items-center">
            <img 
              src="/Logopluswordmark%20white%20no%20background.svg" 
              alt="Sinjab" 
              className="h-8 w-auto"
            />
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Powering the future of sports facility management in Saudi Arabia and beyond.
          </p>
        </div>
        {[
          { title: 'Product', links: ['Features', 'Pricing', 'Clubs', 'Players'] },
          { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
          { title: 'Legal', links: ['Terms', 'Privacy', 'Cookies', 'Dashboard'] },
        ].map((group) => (
          <div key={group.title}>
            <h5 className="font-bold mb-4 md:mb-6 text-xs uppercase tracking-widest text-gray-300">
              {group.title}
            </h5>
            <ul className="space-y-3 text-sm text-gray-500">
              {group.links.map((link) => (
                <li key={link}>
                  <a 
                    href={link === 'Dashboard' ? '/dashboard' : '#'} 
                    className="hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-gray-600 text-[10px] uppercase font-bold tracking-[0.15em] gap-6 md:gap-8">
        <div>© {new Date().getFullYear()} Sinjab. Made with ♥ in Riyadh.</div>
        <div className="flex gap-6">
          {['Twitter', 'LinkedIn', 'Instagram'].map((s) => (
            <a key={s} href="#" className="hover:text-white transition-colors">
              {s}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// --- MAIN LANDING PAGE COMPONENT ---
export default function SinjabLanding() {
  return (
    <div
      className="min-h-screen text-white font-sans selection:bg-[#1B5BCC]/30 overflow-x-hidden"
      style={{
        background: `linear-gradient(180deg, ${COLORS.navyDeep} 0%, ${COLORS.black} 50%, ${COLORS.black} 100%)`,
      }}
    >
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#0C125C]/30 to-transparent pointer-events-none" />
      <div className="fixed top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#1B5BCC]/10 blur-[150px] pointer-events-none rounded-full" />

      <Header />

      <main className="relative z-10">
        <section id="hero" className="min-h-screen flex items-center">
          <Hero />
        </section>

        <section
          id="feeds"
          className="py-16 md:py-24 overflow-hidden border-y border-white/5 bg-white/[0.01]"
        >
          <Feeds />
        </section>

        <section id="b2b" className="py-16 md:py-24">
          <B2BTrust />
        </section>

        <section id="features" className="py-16 md:py-24">
          <Features />
        </section>

        <section id="pricing" className="py-16 md:py-32 border-y border-white/5">
          <Pricing />
        </section>

        <section id="faq" className="py-16 md:py-24">
          <FAQ />
        </section>
      </main>

      <Footer />
    </div>
  );
}
