
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SINJAB PREMIUM FINTECH LANDING PAGE
 * Next.js 14 App Router Compatible
 * Dependencies: framer-motion, lucide-react (optional), tailwindcss
 */

// --- COMPONENTS ---

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Hero', href: '#hero' },
    { name: 'Feeds', href: '#feeds' },
    { name: 'B2B', href: '#b2b' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-8 left-0 right-0 z-50 px-4">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`max-w-fit mx-auto rounded-full px-2 py-2 flex items-center gap-2 md:gap-8 shadow-2xl transition-all duration-500 ${
          scrolled ? 'bg-black/60 backdrop-blur-xl border border-white/10' : 'bg-white/5 backdrop-blur-md border border-white/5'
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
          <div className="w-5 h-5 bg-blue-500 rounded-sm rotate-45 group-hover:rotate-90 transition-transform duration-500" />
          <span className="font-bold text-lg tracking-tight text-white">Sinjab</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        <button className="bg-white text-black text-sm font-bold px-5 py-2.5 rounded-full hover:bg-gray-200 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          Partners
        </button>
      </motion.nav>
    </header>
  );
};

const Hero = () => {
  return (
    <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="space-y-8 text-center lg:text-left"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          v4.0 Live Now
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.05] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
          Integrated Value.<br />
          Scalable Growth.
        </h1>
        
        <p className="text-gray-400 text-xl max-w-xl leading-relaxed mx-auto lg:mx-0">
          The all-in-one financial operating system for modern teams. Consolidate your banking, treasury, and accounting into one high-performance interface.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <button className="relative group px-8 py-4 bg-white text-black font-bold rounded-xl overflow-hidden hover:scale-[1.02] transition-all">
            Download App
          </button>
          
          <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all">
            Watch Demo
          </button>
        </div>

        <div className="flex items-center justify-center lg:justify-start gap-8 pt-8">
          <div className="space-y-1 text-white">
            <div className="text-2xl font-bold">120K+</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Active Nodes</div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="space-y-1 text-white">
            <div className="text-2xl font-bold">$4.2B+</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">Asset Flow</div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        viewport={{ once: true }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-3xl opacity-50 group-hover:opacity-70 transition duration-1000"></div>
        <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <img 
            src="/static/images/hero-dashboard.png" 
            alt="Sinjab Dashboard" 
            className="w-full h-auto object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-700"
          />
          <div className="absolute top-8 right-8 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 animate-bounce transition-all duration-1000">
             <div className="text-[10px] text-gray-400 uppercase font-bold">Live Profit</div>
             <div className="text-xl font-bold text-green-400">+$2,481.00</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Feeds = () => {
  const updates = [
    { title: "Network Upgrade", desc: "Latency reduced by 40ms", color: "blue" },
    { title: "New Partnership", desc: "Noon integration complete", color: "green" },
    { title: "System Stability", desc: "99.99% Uptime maintained", color: "purple" },
    { title: "Global Expansion", desc: "Now active in UAE region", color: "yellow" },
  ];

  const socialCards = [
    { image: "https://picsum.photos/seed/feed1/400/400", user: "@sinjab_fintech" },
    { image: "https://picsum.photos/seed/feed2/400/400", user: "@sinjab_fintech" },
    { image: "https://picsum.photos/seed/feed3/400/400", user: "@sinjab_fintech" },
    { image: "https://picsum.photos/seed/feed4/400/400", user: "@sinjab_fintech" },
  ];

  const marqueeItems = [...updates, ...socialCards, ...updates, ...socialCards];

  return (
    <div className="relative flex whitespace-nowrap overflow-hidden py-10">
      <motion.div 
        animate={{ x: [0, -2000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        className="flex gap-8 items-center"
      >
        {marqueeItems.map((item, idx) => (
          <div key={idx} className="flex-shrink-0">
            {'title' in item ? (
              <div className="bg-white/5 backdrop-blur-md px-8 py-6 rounded-2xl border border-white/5 flex items-start gap-4 hover:border-white/20 transition-all cursor-default">
                <div className={`w-3 h-3 rounded-full mt-1.5 bg-${item.color}-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]`} />
                <div>
                  <div className="text-sm font-bold text-white mb-1">{item.title}</div>
                  <div className="text-xs text-gray-500">{item.desc}</div>
                </div>
              </div>
            ) : (
              <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:scale-105 transition-all">
                <img src={item.image} alt="Social Feed" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <span className="text-[10px] font-bold text-white/50 tracking-widest">{item.user}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const B2BTrust = () => {
  const partners = ['Monsha’at', 'Noon', 'Roshn', 'Aramco', 'STC'];

  return (
    <div className="container mx-auto px-6">
      <div className="flex flex-col items-center gap-12">
        <h3 className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em]">Trusted by Global Industry Leaders</h3>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
          {partners.map((partner) => (
            <motion.div 
              key={partner} 
              whileHover={{ scale: 1.1, filter: 'grayscale(0%)' }}
              className="grayscale opacity-30 hover:opacity-100 transition-all duration-500 cursor-pointer"
            >
              <div className="text-2xl md:text-3xl font-black text-white">{partner.toUpperCase()}</div>
            </motion.div>
          ))}
        </div>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <div className="grid grid-cols-12 gap-4 h-auto md:h-[800px]">
      <motion.div 
        whileHover={{ scale: 0.99 }}
        className="col-span-12 md:col-span-8 row-span-1 bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-all"
      >
        <div className="z-10 relative space-y-4 max-w-sm">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 border border-blue-500/30">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white">Real-time Analytics Engine</h3>
          <p className="text-gray-400">Process millions of transactions with sub-second latency. Get insights as they happen.</p>
        </div>
        <img src="https://picsum.photos/seed/analytics/600/400" className="absolute bottom-[-10%] right-[-5%] w-2/3 opacity-20 group-hover:opacity-40 transition-opacity rounded-2xl rotate-[-5deg]" alt="feature" />
      </motion.div>

      <motion.div 
        whileHover={{ scale: 0.99 }}
        className="col-span-12 md:col-span-4 row-span-1 bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col justify-between group hover:border-white/20 transition-all"
      >
        <div className="space-y-4">
          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 border border-purple-500/30">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8-0v4h8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white">Biometric Vault</h3>
        </div>
        <div className="space-y-2">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div initial={{ width: 0 }} whileInView={{ width: '95%' }} transition={{ duration: 2 }} className="h-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
          </div>
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Security Level: Enterprise</div>
        </div>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 0.99 }}
        className="col-span-12 md:col-span-4 row-span-1 bg-white/[0.02] border border-white/5 rounded-3xl p-8 flex flex-col justify-center text-center group hover:border-white/20 transition-all"
      >
         <div className="mb-8 relative mx-auto w-32 h-32 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute inset-0 border border-dashed border-white/20 rounded-full" />
            <div className="text-4xl font-bold text-white">SAR</div>
         </div>
         <h3 className="text-2xl font-bold text-white mb-2">Global Liquidity</h3>
         <p className="text-gray-400 text-sm">Transact in 140+ currencies with institutional-grade FX rates.</p>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 0.99 }}
        className="col-span-12 md:col-span-8 row-span-1 bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-white/20 transition-all"
      >
        <div className="grid grid-cols-2 gap-8 h-full items-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Developer API</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Restful APIs that developers love. Integrate Sinjab into your workflow in minutes.</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-white/5 rounded text-[10px] border border-white/10 font-mono text-gray-400">POST /payment</span>
            </div>
          </div>
          <div className="bg-black/40 rounded-2xl border border-white/10 p-4 font-mono text-[10px] text-blue-300">
             <pre>{`{
  "id": "sj_821",
  "status": "success",
  "amount": 12500,
  "node": "central"
}`}</pre>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Pricing = () => {
  const tiers = [
    { name: 'Starter', price: '99', features: ['5 Business Nodes', 'Real-time Feeds', 'Standard Support'], active: false },
    { name: 'Growth', price: '299', features: ['25 Business Nodes', 'Advanced API Access', 'Priority Support', 'Custom Branding'], active: true },
    { name: 'Enterprise', price: 'Custom', features: ['Unlimited Nodes', 'Dedicated Infrastructure', '24/7 Phone Support', 'On-premise Options'], active: false },
  ];

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">Flexible Plans. Precise Value.</h2>
        <p className="text-gray-500 mt-4">Transparent pricing designed for organizations of all sizes.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <motion.div 
            key={tier.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`relative p-8 rounded-3xl border transition-all duration-500 group ${
              tier.active 
                ? 'bg-white/5 border-blue-500/50 scale-105 shadow-[0_0_40px_rgba(59,130,246,0.1)]' 
                : 'bg-white/[0.02] border-white/10 hover:border-white/30'
            }`}
          >
            {tier.active && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full text-white">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h4 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">{tier.name}</h4>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white">${tier.price}</span>
                {tier.price !== 'Custom' && <span className="text-gray-500 text-sm">/mo</span>}
              </div>
            </div>
            
            <ul className="space-y-4 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                  <svg className={`w-5 h-5 ${tier.active ? 'text-blue-500' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button className={`w-full py-4 font-bold rounded-xl transition-all ${
              tier.active 
                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500' 
                : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
            }`}>
              Get Started
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: "How secure is the Sinjab platform?", a: "We utilize AES-256 encryption at rest and TLS 1.3 in transit. Our infrastructure is SOC2 Type II compliant." },
    { q: "Can I integrate with existing ERP systems?", a: "Yes, Sinjab provides native connectors for SAP, Oracle, NetSuite, and Microsoft Dynamics." },
    { q: "What regions do you currently support?", a: "We are fully operational across the GCC region, Europe, and North America." },
    { q: "Is there a limit on transaction volume?", a: "No, our architecture is designed to scale horizontally to millions of transactions." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-12 text-center text-white">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
            <button 
              className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/5 text-white"
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <span className="font-bold text-left">{faq.q}</span>
              <svg className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-8 pb-6 border-t border-white/5"
                >
                  <p className="text-gray-400 text-sm mt-4">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="py-20 border-t border-white/5">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-white">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-sm rotate-45" />
            <span className="font-bold text-xl tracking-tight">Sinjab</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">Powering the next generation of financial autonomy globally.</p>
        </div>
        {['Product', 'Resources', 'Company'].map(group => (
          <div key={group}>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-300">{group}</h5>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-white transition-colors">Overview</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-gray-600 text-[10px] uppercase font-bold tracking-[0.2em] gap-8">
        <div>© {new Date().getFullYear()} Sinjab Fintech Inc. Made in Riyadh.</div>
        <div className="flex gap-6">
          {['Twitter', 'LinkedIn', 'Instagram'].map(s => <a key={s} href="#" className="hover:text-white">{s}</a>)}
        </div>
      </div>
    </div>
  </footer>
);

// --- MAIN LANDING PAGE COMPONENT ---

// ... (Your FAQ component above stays the same) ...

const SinjabFooter = () => (
    <footer className="py-20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-white">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded-sm rotate-45" />
              <span className="font-bold text-xl tracking-tight">Sinjab</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">Powering the next generation of financial autonomy globally.</p>
          </div>
          {['Product', 'Resources', 'Company'].map(group => (
            <div key={group}>
              <h5 className="font-bold mb-6 text-sm uppercase tracking-widest text-gray-300">{group}</h5>
              <ul className="space-y-4 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Overview</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-gray-600 text-[10px] uppercase font-bold tracking-[0.2em] gap-8">
          <div>© {new Date().getFullYear()} Sinjab Fintech Inc. Made in Riyadh.</div>
          <div className="flex gap-6">
            {['Twitter', 'LinkedIn', 'Instagram'].map(s => <a key={s} href="#" className="hover:text-white">{s}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
  
  // --- MAIN LANDING PAGE COMPONENT ---
  // MAKE SURE THIS IS THE ONLY EXPORT DEFAULT AT THE BOTTOM
  
  export default function SinjabLanding() {
    return (
      <div className="bg-[#080808] min-h-screen text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] pointer-events-none rounded-full" />
  
        <Header />
        
        <main className="relative z-10 pt-40 md:pt-60">
          <section id="hero" className="mb-40"><Hero /></section>
          <section id="feeds" className="py-24 overflow-hidden border-y border-white/5 bg-white/[0.01] mb-40"><Feeds /></section>
          <section id="b2b" className="mb-40"><B2BTrust /></section>
          <section id="features" className="container mx-auto px-6 mb-40"><Features /></section>
          <section id="pricing" className="py-32 bg-white/[0.01] mb-40 border-y border-white/5"><Pricing /></section>
          <section id="faq" className="mb-40"><FAQ /></section>
        </main>
  
        <Footer />
      </div>
    );
  }
  
  // DELETE ANYTHING AFTER THIS BRACKET "}"

// ... (rest of your code)

