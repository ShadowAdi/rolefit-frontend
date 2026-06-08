'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';

interface GooeyTransitionProps {
  children: React.ReactNode;
}

export default function GooeyTransition({ children }: GooeyTransitionProps) {
  const pathname = usePathname();
  const gooey1Ref = useRef<HTMLDivElement[]>([]);
  const gooey2Ref = useRef<HTMLDivElement[]>([]);
  const isTransitioning = useRef(false);

  const gooeyEntry = (): Promise<void> => {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: resolve,
      });

      tl.to(
        gooey1Ref.current,
        {
          yPercent: 0,
          duration: 1.2,
          ease: "power3.inOut",
          stagger: {
            amount: 0.6,
            from: "random",
          },
        },
        0,
      );

      tl.to(
        gooey2Ref.current,
        {
          yPercent: 0,
          duration: 1.2,
          ease: "power4.inOut",
          stagger: {
            amount: 0.6,
            from: "random",
          },
        },
        0,
      );
    });
  };

  const gooeyExit = (): Promise<void> => {
    return new Promise((resolve) => {
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            isTransitioning.current = false;
            resolve();
          }, 100);
        },
      });

      tl.to(
        gooey1Ref.current,
        {
          yPercent: -100,
          delay: 0.5,
          duration: 1.1,
          ease: "power3.inOut",
          stagger: {
            amount: 0.6,
            from: "random",
          },
        },
        0,
      );

      tl.to(
        gooey2Ref.current,
        {
          yPercent: 100,
          delay: 0.35,
          duration: 1.1,
          ease: "power4.inOut",
          stagger: {
            amount: 0.6,
            from: "random",
          },
        },
        0,
      );
    });
  };

  useEffect(() => {
    // Create gooey elements dynamically
    const createGooeyElements = () => {
      const upperWrapper = document.getElementById("gooey-upper");
      const bottomWrapper = document.getElementById("gooey-bottom");

      if (!upperWrapper || !bottomWrapper) return;

      // Clear existing
      upperWrapper.innerHTML = "";
      bottomWrapper.innerHTML = "";

      // Create 40 elements for top
      for (let i = 0; i < 40; i++) {
        const div = document.createElement("div");
        div.className = "gooey-1";
        upperWrapper.appendChild(div);
      }

      // Create 40 elements for bottom
      for (let i = 0; i < 40; i++) {
        const div = document.createElement("div");
        div.className = "gooey-2";
        bottomWrapper.appendChild(div);
      }

      gooey1Ref.current = Array.from(document.querySelectorAll(".gooey-1")) as HTMLDivElement[];
      gooey2Ref.current = Array.from(document.querySelectorAll(".gooey-2")) as HTMLDivElement[];

      // Set initial positions
      gsap.set(gooey1Ref.current, { yPercent: -100 });
      gsap.set(gooey2Ref.current, { yPercent: 100 });
    };

    createGooeyElements();

    // Handle navigation
    const handleLinkClick = async (e: MouseEvent, href: string) => {
      e.preventDefault();
      if (isTransitioning.current || href === window.location.pathname) return;
      
      isTransitioning.current = true;
      await gooeyEntry();
      window.location.href = href;
    };

    // Attach click handlers to all internal links
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.getAttribute('href')?.startsWith('/') && !link.getAttribute('target')) {
        const href = link.getAttribute('href');
        if (href && href !== window.location.pathname) {
          handleLinkClick(e, href);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  // Reset gooey positions after page load
  useEffect(() => {
    const resetGooey = async () => {
      if (gooey1Ref.current.length && gooey2Ref.current.length) {
        await gooeyExit();
      }
    };

    resetGooey();
  }, [pathname]);

  return (
    <>
      <div id="gooey-wrapper" className="fixed inset-0 z-[9999] w-full h-screen flex items-center justify-between flex-col pointer-events-none overflow-hidden">
        <div id="gooey-upper" className="w-full h-[50vh] overflow-hidden flex items-center justify-between flex-row"></div>
        <div id="gooey-bottom" className="w-full h-[50vh] overflow-hidden flex items-center justify-between flex-row"></div>
      </div>
      {children}
    </>
  );
}