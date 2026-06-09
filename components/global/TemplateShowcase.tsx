"use client";

import { useState } from "react";
import { motion, PanInfo } from "framer-motion";

const templates = [
  {
    id: 1,
    type: "resume",
    style: "Bold",
    image: "/demo/hero_section_resume_bold.png",
  },
  {
    id: 2,
    type: "resume",
    style: "Minimalistic",
    image: "/demo/hero_section_classic_cover_letter.png",
  },
  {
    id: 3,
    type: "resume",
    style: "Classic",
    image: "/demo/hero_section_resume_bold.png",
  },
  {
    id: 4,
    type: "cover",
    style: "Bold",
    image: "/demo/hero_section_classic_cover_letter.png",
  },
  {
    id: 5,
    type: "cover",
    style: "Minimalistic",
    image: "/demo/hero_section_resume_bold.png",
  },
  {
    id: 6,
    type: "cover",
    style: "Classic",
    image: "/demo/hero_section_classic_cover_letter.png",
  },
];

// How many cards fan out on each side of the center card.
const VISIBLE_SIDE = 2;

export default function TemplateShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = templates.length;

  const goTo = (dir: number) =>
    setCurrentIndex((prev) => (prev + dir + total) % total);

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x < -60) goTo(1);
    else if (info.offset.x > 60) goTo(-1);
  };

  // Signed distance from the current card, wrapped to the shortest direction.
  const offsetFor = (index: number) => {
    let diff = index - currentIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section className="w-full bg-gradient-to-b from-gray-50 to-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-950 mb-4">
            Your story.{" "}
            <span className="bg-gradient-to-r from-lime-600 to-lime-500 bg-clip-text text-transparent">
              Their language.
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Three distinct styles for resumes and cover letters — tailored to
            every role
          </p>
        </div>

        <motion.div
          className="relative flex items-center justify-center h-[460px] md:h-[560px] cursor-grab active:cursor-grabbing select-none"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={handleDragEnd}
        >
          {templates.map((item, index) => {
            const offset = offsetFor(index);
            const distance = Math.abs(offset);
            const isVisible = distance <= VISIBLE_SIDE;
            const isCenter = offset === 0;

            return (
              <motion.div
                key={item.id}
                className="absolute left-1/2 top-1/2 w-[240px] md:w-[300px] lg:w-[340px]"
                initial={false}
                animate={{
                  x: `calc(-50% + ${offset * 130}px)`,
                  y: `calc(-50% + ${distance * 34}px)`,
                  rotate: offset * 8,
                  scale: isCenter ? 1 : 1 - distance * 0.07,
                  opacity: isVisible ? 1 : 0,
                  zIndex: 20 - distance,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
                style={{ pointerEvents: isCenter ? "auto" : "none" }}
              >
                {/* Image card with style name overlaid */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                  <img
                    src={item.image}
                    alt={`${item.style} ${item.type}`}
                    className="h-full w-full object-cover object-top"
                    draggable={false}
                  />
                  {/* Subtle gradient so the overlaid text stays legible */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="font-serif italic text-white text-3xl md:text-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                      {item.style}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6"
        >
          <p className="text-gray-500 text-sm uppercase tracking-wide">
            {templates[currentIndex].type === "resume"
              ? "Resume Template"
              : "Cover Letter Template"}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {templates[currentIndex].style} Style
          </p>
        </motion.div>

        <div className="text-center mt-8">
          <button className="px-8 py-3 bg-lime-500 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-lime-600 transition-all duration-300">
            Try {templates[currentIndex].style} Style →
          </button>
        </div>
      </div>
    </section>
  );
}
