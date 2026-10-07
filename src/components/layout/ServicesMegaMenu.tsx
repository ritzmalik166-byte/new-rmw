"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { SERVICES_LIST } from "@/lib/services-data";
import { cn } from "@/lib/cn";

interface ServicesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function ServicesMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: ServicesMegaMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className={cn("services-mega-overlay", isOpen && "is-open")}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="region"
      aria-label="Services Navigation Menu"
    >
      <div className="services-mega-backdrop" onClick={onClose} aria-hidden />

      <div className="services-mega-container overflow-hidden">
        {/* Truck Background Image */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <Image
            src="/hero-section/truck-drive.png"
            alt=""
            fill
            className="object-cover object-center scale-110"
          />
          <div className="absolute inset-0 bg-[#080b16]/50 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080b16] via-transparent to-[#080b16]" />
        </div>

        {/* Top ambient highlight line */}
        <div className="services-mega-glow z-10" aria-hidden />

        <div className="max-w-[1480px] mx-auto px-6 py-8 lg:px-12 lg:py-12 relative z-10">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1 font-outfit">Our Capabilities</h3>
              <p className="text-white/60 text-sm font-inter">Explore our comprehensive range of services</p>
            </div>
            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-amber-400 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 transition-all cursor-pointer"
              onClick={onClose}
              aria-label="Close services menu"
            >
              ✕
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
            {SERVICES_LIST.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 transition-all duration-300 aspect-[4/3] flex flex-col"
                onClick={onClose}
              >
                {/* Background Image */}
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080b16] via-[#080b16]/70 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                
                {/* Content */}
                <div className="relative z-10 p-4 lg:p-5 mt-auto flex flex-col justify-end h-full">
                  <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1.5 lg:mb-2 font-inter opacity-90 group-hover:opacity-100 transition-opacity">
                    {service.engine.split("·")[0].trim()}
                  </span>
                  <h4 className="text-white font-bold text-base lg:text-lg leading-tight font-outfit group-hover:text-amber-400 transition-colors drop-shadow-md">
                    {service.name}
                  </h4>
                  <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-2 transition-all duration-300 overflow-hidden">
                    <p className="text-white/70 text-xs line-clamp-2 font-inter leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 text-sm text-white/50 font-inter">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f6c431]"></span>
              Need a bespoke integrated campaign?
            </div>
            <Link
              href="/#start-a-project"
              className="text-amber-400 font-semibold text-sm hover:text-white transition-colors font-inter flex items-center gap-2"
              onClick={onClose}
            >
              Book a consultation <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
