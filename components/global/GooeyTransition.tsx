'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

interface GooeyTransitionProps {
  children: React.ReactNode;
}

export default function GooeyTransition({ children }: GooeyTransitionProps) {
  const pathname = usePathname();
  const router = useRouter();
  // Keep a stable ref so the once-mounted click handler always uses the live router.
  const routerRef = useRef(router);
  routerRef.current = router;

  const gooey1Ref = useRef<HTMLDivElement[]>([]);
  const gooey2Ref = useRef<HTMLDivElement[]>([]);
  const isTransitioning = useRef(false);
  const pendingReveal = useRef(false);
  const isFirstLoad = useRef(true);

  // Cover the screen (gooey slides into view).
  const gooeyEntry = (): Promise<void> => {
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });
      tl.to(
        gooey1Ref.current,
        { yPercent: 0, duration: 1.0, ease: 'power3.inOut', stagger: { amount: 0.5, from: 'random' } },
        0,
      );
      tl.to(
        gooey2Ref.current,
        { yPercent: 0, duration: 1.0, ease: 'power4.inOut', stagger: { amount: 0.5, from: 'random' } },
        0,
      );
    });
  };

  // Reveal the new page (gooey slides back out).
  const gooeyExit = (): Promise<void> => {
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: resolve });
      tl.to(
        gooey1Ref.current,
        { yPercent: -100, duration: 1.0, ease: 'power3.inOut', stagger: { amount: 0.5, from: 'random' } },
        0,
      );
      tl.to(
        gooey2Ref.current,
        { yPercent: 100, duration: 1.0, ease: 'power4.inOut', stagger: { amount: 0.5, from: 'random' } },
        0,
      );
    });
  };

  // Instantly place the gooey off-screen (no animation).
  const resetGooeyToHidden = () => {
    if (gooey1Ref.current.length && gooey2Ref.current.length) {
      gsap.set(gooey1Ref.current, { yPercent: -100 });
      gsap.set(gooey2Ref.current, { yPercent: 100 });
    }
  };

  // Build the gooey columns and intercept internal-link clicks (once).
  useEffect(() => {
    const upperWrapper = document.getElementById('gooey-upper');
    const bottomWrapper = document.getElementById('gooey-bottom');

    if (upperWrapper && bottomWrapper) {
      upperWrapper.innerHTML = '';
      bottomWrapper.innerHTML = '';

      for (let i = 0; i < 40; i++) {
        const div = document.createElement('div');
        div.className = 'gooey-1';
        upperWrapper.appendChild(div);
      }
      for (let i = 0; i < 40; i++) {
        const div = document.createElement('div');
        div.className = 'gooey-2';
        bottomWrapper.appendChild(div);
      }

      gooey1Ref.current = Array.from(document.querySelectorAll('.gooey-1')) as HTMLDivElement[];
      gooey2Ref.current = Array.from(document.querySelectorAll('.gooey-2')) as HTMLDivElement[];

      resetGooeyToHidden();
    }

    const handleGlobalClick = (e: MouseEvent) => {
      // Let the browser handle modified clicks (open in new tab, etc.).
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const link = (e.target as HTMLElement).closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      const targetAttr = link.getAttribute('target');

      // Only internal, same-window navigations to a different path.
      if (!href || !href.startsWith('/') || targetAttr || href === window.location.pathname) {
        return;
      }

      // Capture phase: run BEFORE Next's <Link> onClick so we own the navigation.
      e.preventDefault();
      e.stopPropagation();

      if (isTransitioning.current) return;
      isTransitioning.current = true;

      // Cover first, then navigate (client-side, no full reload).
      gooeyEntry().then(() => {
        pendingReveal.current = true;
        routerRef.current.push(href);
      });
    };

    document.addEventListener('click', handleGlobalClick, true); // capture phase
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, []);

  // React to route changes: reveal the freshly-mounted page.
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      resetGooeyToHidden();
      return;
    }

    if (pendingReveal.current) {
      // Wait two frames so the new page paints under the cover before revealing.
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => {
          gooeyExit().then(() => {
            pendingReveal.current = false;
            isTransitioning.current = false;
          });
        });
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    // Navigation that bypassed our handler (e.g. browser back/forward): just stay hidden.
    resetGooeyToHidden();
  }, [pathname]);

  return (
    <>
      <div
        id="gooey-wrapper"
        className="fixed inset-0 z-[9999] w-full h-screen flex items-center justify-between flex-col pointer-events-none overflow-hidden"
      >
        <div
          id="gooey-upper"
          className="w-full h-[50vh] overflow-hidden flex items-center justify-between flex-row"
        ></div>
        <div
          id="gooey-bottom"
          className="w-full h-[50vh] overflow-hidden flex items-center justify-between flex-row"
        ></div>
      </div>
      {children}
    </>
  );
}
