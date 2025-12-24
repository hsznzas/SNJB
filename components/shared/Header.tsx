'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { headerNavLinks } from '@/data/config/headerNavLinks';
import { useScrollSpy } from '@/components/shared/useScrollSpy';
import { Button } from '@/components/shared/ui/button';
import { clsx } from 'clsx';
import { Lock } from 'lucide-react';

export const Header = ({ className }: { className?: string }) => {
  const sectionIds = headerNavLinks
    .map((link) => link.sectionId)
    .filter((id): id is string => !!id);
  const activeSection = useScrollSpy(sectionIds);
  const navRef = useRef<HTMLDivElement>(null);

  // Mobile horizontal sync scroll
  useEffect(() => {
    if (!navRef.current || !activeSection) return;

    const navContainer = navRef.current;

    // Only sync scroll on mobile
    if (window.innerWidth >= 768) return;

    // Find the active link element
    const activeLink = navContainer.querySelector(
      `a[href="#${activeSection}"]`,
    ) as HTMLAnchorElement;

    if (!activeLink) return;

    const scrollToCenter = () => {
      const containerWidth = navContainer.offsetWidth;
      const linkLeft = activeLink.offsetLeft;
      const linkWidth = activeLink.offsetWidth;
      const scrollPosition = linkLeft - containerWidth / 2 + linkWidth / 2;

      navContainer.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    };

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToCenter, 100);

    return () => clearTimeout(timeoutId);
  }, [activeSection]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }
  };

  return (
    <nav
      className={clsx(
        'sticky top-0 z-50 w-full',
        'backdrop-blur-xl bg-black/40 dark:bg-black/60',
        'border-b border-white/10 dark:border-white/5',
        'transition-all duration-300',
        className,
      )}
    >
      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/static/images/logo.png"
              alt="Sinjab logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
            <span className="font-bold text-lg text-white dark:text-white">
              Sinjab
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {headerNavLinks.map((link) => {
              const isActive = activeSection === link.sectionId;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={clsx(
                    'text-sm font-medium transition-all duration-200',
                    'text-gray-300 dark:text-gray-400',
                    'hover:text-white dark:hover:text-white',
                    isActive && 'text-white dark:text-white font-bold',
                  )}
                >
                  {link.title}
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation - Horizontal Scroll */}
          <div
            ref={navRef}
            className="md:hidden flex-1 overflow-x-auto scrollbar-hide mx-4"
          >
            <div className="flex items-center gap-6 min-w-max px-2">
              {headerNavLinks.map((link) => {
                const isActive = activeSection === link.sectionId;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={clsx(
                      'text-sm font-medium transition-all duration-200 whitespace-nowrap',
                      'text-gray-300 dark:text-gray-400',
                      'hover:text-white dark:hover:text-white',
                      isActive && 'text-white dark:text-white font-bold',
                    )}
                  >
                    {link.title}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Partners Tab */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Button
              asChild
              variant="outline"
              className={clsx(
                'border-white/20 dark:border-white/10',
                'bg-white/5 dark:bg-white/5',
                'text-white dark:text-white',
                'hover:bg-white/10 dark:hover:bg-white/10',
                'hover:border-white/30 dark:hover:border-white/20',
                'transition-all duration-200',
              )}
            >
              <Link href="/partners" className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" />
                <span className="text-sm font-medium">Partners</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
