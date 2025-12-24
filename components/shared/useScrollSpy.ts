'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect which section is currently in the viewport using Intersection Observer.
 * Returns the ID of the active section.
 */
export const useScrollSpy = (sectionIds: string[], offset: number = 100) => {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    if (sectionIds.length === 0) return;

    // Get all section elements
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el) => el !== null) as HTMLElement[];

    if (elements.length === 0) return;

    // Intersection Observer for more accurate detection
    const observerOptions = {
      root: null,
      rootMargin: `-${offset}px 0px -50% 0px`,
      threshold: [0, 0.1, 0.5, 1],
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // Find the entry that's most visible in the viewport
      let maxRatio = 0;
      let activeId = '';

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const ratio = entry.intersectionRatio;
          if (ratio > maxRatio) {
            maxRatio = ratio;
            activeId = entry.target.id;
          }
        }
      });

      if (activeId) {
        setActiveSection(activeId);
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    elements.forEach((el) => observer.observe(el));

    // Fallback scroll handler for edge cases
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      // Check from bottom to top to get the most recent section
      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;

          if (scrollPosition >= elementTop - offset) {
            setActiveSection(element.id);
            break;
          }
        }
      }
    };

    // Throttled scroll handler
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [sectionIds, offset]);

  return activeSection;
};

