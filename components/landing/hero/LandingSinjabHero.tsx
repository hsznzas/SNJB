'use client';

import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/shared/ui/button';
import { Play } from 'lucide-react';

interface LandingSinjabHeroProps {
  className?: string;
}

export const LandingSinjabHero = ({ className }: LandingSinjabHeroProps) => {
  return (
    <section
      id="hero"
      className={clsx(
        'relative w-full min-h-screen flex flex-col justify-center',
        'bg-[#080808] text-white',
        'overflow-hidden',
        className,
      )}
    >
      {/* Subtle gradient overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
        }}
      />

      {/* Version Tag */}
      <div className="absolute top-24 left-8 z-20">
        <div className="px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
          <span className="text-xs font-medium text-blue-400">V4.0 LIVE NOW</span>
        </div>
      </div>

      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="relative z-10 space-y-8">
            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              <span className="block">Integrated Value.</span>
              <span className="block">Scalable Growth.</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-300 max-w-xl leading-relaxed">
              The all-in-one financial operating system for modern teams.
              Consolidate your banking, treasury, and accounting into one
              high-performance interface.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* Download App Button - with glowing gradient border */}
              <Link
                href="#download"
                className={clsx(
                  'glow-border-button',
                  'inline-flex items-center justify-center',
                  'px-8 py-6',
                  'font-semibold text-base',
                  'rounded-lg',
                  'hover:bg-gray-100',
                  'transition-all duration-300',
                  'shadow-lg hover:shadow-xl',
                )}
              >
                Download App
              </Link>

              {/* Watch Demo Button */}
              <Button
                asChild
                size="xl"
                variant="outline"
                className={clsx(
                  'border-white/20 bg-white/5 backdrop-blur-sm',
                  'text-white hover:bg-white/10 hover:border-white/30',
                  'px-8 py-6',
                  'font-semibold',
                  'rounded-lg',
                  'transition-all duration-300',
                )}
              >
                <Link href="#demo" className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Watch Demo
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div>
                <div className="text-3xl md:text-4xl font-bold">120K+</div>
                <div className="text-sm text-gray-400 mt-1">ACTIVE NODES</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold">$4.2B+</div>
                <div className="text-sm text-gray-400 mt-1">ASSET FLOW</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative z-10">
            <div className="relative rounded-2xl overflow-hidden">
              {/* Glassmorphic card effect */}
              <div
                className={clsx(
                  'absolute inset-0 rounded-2xl',
                  'bg-gradient-to-br from-white/5 to-white/0',
                  'backdrop-blur-sm',
                  'border border-white/10',
                  '-z-10',
                )}
              />

              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden">
                <Image
                  src="/static/images/1.jpg"
                  alt="Sinjab Financial Operating System"
                  width={800}
                  height={600}
                  className="w-full h-auto rounded-2xl object-cover"
                  priority
                />

                {/* LIVE PROFIT Overlay */}
                <div
                  className={clsx(
                    'absolute top-4 right-4',
                    'px-4 py-3 rounded-xl',
                    'bg-black/60 backdrop-blur-md',
                    'border border-white/10',
                    'shadow-lg',
                  )}
                >
                  <div className="text-xs text-gray-400 mb-1">LIVE PROFIT</div>
                  <div className="text-2xl font-bold text-green-400">
                    +$2,481.00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

