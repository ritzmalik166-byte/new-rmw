"use client";

import { useState } from "react";
import Image from "next/image";
import DriftWall from "@/components/ui/DriftWall";
import { site } from "@/lib/site";
import { AnimatePresence, motion } from "framer-motion";

export function Awards() {
  const [selectedAwardIndex, setSelectedAwardIndex] = useState<number | null>(null);

  const driftItems = site.awards.items.map((item, index) => ({
    image: item.src,
    title: item.heading,
    originalIndex: index,
  }));

  const activeAward = selectedAwardIndex !== null ? site.awards.items[selectedAwardIndex] : null;

  return (
    <section className="awards" aria-label="Awards">
      <div className="awards-bg-overlay"></div>
      <div className="awards-showcase-full">
        <DriftWall
          items={driftItems}
          columns={6}
          tileWidth={240}
          tileHeight={360}
          gap={0}
          tilt={16}
          turn={-14}
          perspective={1200}
          depth={120}
          speed={42}
          direction="up"
          variance={0.45}
          parallax={0.6}
          lift={64}
          fade={0}
          dim={1}
          overlayColor="transparent"
          radius={0}
          roll={0}
          pauseOnHover={false}
          grayscale={false}
          onItemClick={(item) => {
            if (item.originalIndex !== undefined) {
              setSelectedAwardIndex(item.originalIndex);
            }
          }}
        />
      </div>

      <AnimatePresence>
        {activeAward && (
          <motion.div
            className="carousel-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAwardIndex(null)}
          >
            <motion.div
              className="carousel-modal"
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="carousel-modal-close"
                onClick={() => setSelectedAwardIndex(null)}
                aria-label="Close modal"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div className="carousel-modal-image">
                <Image
                  src={activeAward.src}
                  alt={activeAward.alt ?? activeAward.heading}
                  fill
                  sizes="(max-width: 768px) 90vw, 500px"
                />
              </div>
              
              <div className="carousel-modal-details">
                {activeAward.year && (
                  <p className="carousel-modal-year">{activeAward.year}</p>
                )}
                {activeAward.subtitle && (
                  <p className="carousel-modal-subtitle">{activeAward.subtitle}</p>
                )}
                <h3 className="carousel-modal-title">{activeAward.heading}</h3>
                <p className="carousel-modal-desc">{activeAward.copy}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
