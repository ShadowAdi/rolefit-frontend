"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const introBrandRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const introBrand = introBrandRef.current;
    const content = contentRef.current;
    if (!card || !introBrand || !content) return;

    // Target size for the fully expanded card (~90% of the available area).
    const availableHeight = window.innerHeight - 64; // minus header height
    const fullW = Math.min(window.innerWidth * 0.92, 1280);
    const fullH = availableHeight * 0.9;

    // Items that flow in (staggered) once the card has opened.
    const items = content.querySelectorAll<HTMLElement>("[data-animate]");

    // Initial state: a tiny landscape card at center.
    gsap.set(card, {
      width: 260,
      height: 156,
      borderRadius: 24,
      autoAlpha: 0,
      scale: 0.85,
    });
    gsap.set(introBrand, { autoAlpha: 0 });
    gsap.set(content, { autoAlpha: 0, display: "none" });
    gsap.set(items, { autoAlpha: 0, y: 28 });

    const tl = gsap.timeline({ delay: 0.35 });

    // 1. The small card pops into view at the center.
    tl.to(card, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.5)",
    });

    // 2. "Rolefit" appears inside the small card.
    tl.to(introBrand, { autoAlpha: 1, duration: 0.35 }, "-=0.05");

    // Brief hold so the small card reads as a deliberate beat.
    tl.to({}, { duration: 0.5 });

    // 3. The card expands to ~90% of the screen; the intro wordmark fades out.
    tl.addLabel("expand");
    tl.to(
      card,
      {
        width: fullW,
        height: fullH,
        borderRadius: 32,
        duration: 1,
        ease: "power3.inOut",
      },
      "expand",
    );
    tl.to(introBrand, { autoAlpha: 0, duration: 0.4 }, "expand");

    // Reveal the navbar partway through the expansion.
    tl.add(() => {
      window.dispatchEvent(new Event("rolefit:hero-ready"));
    }, "expand+=0.5");

    // 4. The content flows in, one element after another (no snap).
    tl.set(content, { display: "block", autoAlpha: 1 });
    tl.to(
      items,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      },
      "-=0.1",
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[calc(100vh-64px)] flex items-center justify-center bg-white overflow-hidden px-4"
    >
      {/* Morphing card: starts small at center, expands to fill the screen */}
      <div
        ref={cardRef}
        className="relative overflow-hidden bg-gradient-to-br from-lime-500 to-lime-600"
        style={{ willChange: "width, height" }}
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        {/* Centered wordmark shown during the small-card stage */}
        <div
          ref={introBrandRef}
          className="absolute inset-0 z-20 flex items-center justify-center"
        >
          <span className="text-xl font-semibold tracking-tight text-white">
            Rolefit
          </span>
        </div>

        {/* Full content — flows in after the card is open */}
        <div
          ref={contentRef}
          className="absolute inset-0 z-10 flex items-center"
        >
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-8 py-10 md:px-12 lg:grid-cols-2">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <span
                data-animate
                className="inline-block text-base font-semibold tracking-tight text-white/90"
              >
                Rolefit
              </span>

              <h1
                data-animate
                className="mt-4 text-3xl font-bold leading-tight tracking-tight text-lime-950 md:text-4xl lg:text-5xl"
              >
                Resumes &amp; cover letters,{" "}
                <span className="text-white drop-shadow">tailored to every job</span>
              </h1>

              <p
                data-animate
                className="mx-auto mt-5 max-w-md text-base text-lime-900/90 lg:mx-0"
              >
                Paste a job description, emphasize what matters, and export a
                clean, ATS-ready PDF.
              </p>

              <div
                data-animate
                className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
              >
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-lime-900 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Get Started →
                </Link>
                <Link
                  href="#features"
                  className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3 font-semibold text-lime-950 backdrop-blur-sm transition-colors duration-200 hover:bg-white/20"
                >
                  See how it works
                </Link>
              </div>
            </div>

            <div className="relative mx-auto flex aspect-4/3 w-full max-w-lg items-start justify-start">
              <img
                data-animate
                src="/demo/hero_section_classic_cover_letter.png"
                alt="Cover letter preview"
                className="absolute -left-4 top-[25%] max-h-[90%] w-[60%] -translate-y-1/2 -rotate-6 rounded-lg border border-white/50 object-contain shadow-xl"
              />
              <img
                data-animate
                src="/demo/hero_section_resume_bold.png"
                alt="Resume preview"
                className="absolute -right-5 top-[25%] max-h-full w-[60%] -translate-y-1/2 rotate-3 rounded-lg  border-none bg-transparent object-contain shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
