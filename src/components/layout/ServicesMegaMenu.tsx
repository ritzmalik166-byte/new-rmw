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


  const getIcon = (slug: string) => {
    switch (slug) {
      case 'digital-marketing': return <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688 0-1.37-.256-1.894-.768l-3.8-3.799a2.678 2.678 0 010-3.788l3.8-3.799c.524-.512 1.206-.768 1.894-.768h8.907c1.378 0 2.5 1.122 2.5 2.5v6.586c0 1.378-1.122 2.5-2.5 2.5h-8.907zM11.5 6v6m-4-3h1" /></svg>;
      case 'creative-services': return <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
      case 'print-advertising': return <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>;
      case 'radio-advertising': return <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
      case 'content-marketing': return <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
      case 'web-development': return <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>;
      case 'celebrity-endorsements': return <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
      default: return <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
    }
  }

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

      <div className="services-mega-container overflow-hidden rounded-b-[24px]">
        {/* Top ambient highlight line */}
        <div className="services-mega-glow z-10" aria-hidden />

        <div className="max-w-[1480px] mx-auto p-4 lg:p-6 relative z-10 flex flex-col md:flex-row gap-4 lg:gap-6 items-stretch">
          
          {/* Left Panel - Branding */}
          <div className="w-full md:w-[320px] lg:w-[340px] rounded-2xl bg-[#0a0c12] border border-white/5 p-6 lg:p-8 relative overflow-hidden flex flex-col items-start justify-start shadow-[inset_0_0_80px_rgba(246,196,49,0.03)] shrink-0">
            <span className="text-[10px] font-bold text-amber-500 tracking-widest uppercase mb-4">Our Services</span>
            <h3 className="text-2xl lg:text-[28px] font-bold text-white leading-[1.1] mb-4 font-outfit">Creative Solutions<br/>for Modern Brands</h3>
            <p className="text-zinc-400 text-sm font-inter leading-relaxed max-w-[240px]">From strategy to execution, we help brands grow with creativity, technology and results.</p>
            
            {/* R logo placeholder background */}
            <div className="absolute -bottom-16 -left-10 w-[300px] h-[300px] opacity-30 pointer-events-none mix-blend-screen">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-full blur-3xl" />
              <Image src="/logo.png" fill className="object-contain drop-shadow-[0_0_30px_rgba(246,196,49,0.3)]" alt="" priority />
            </div>
          </div>

          {/* Middle Panel - Services Grid */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 lg:gap-x-8 gap-y-2 lg:gap-y-4 py-2 px-1 items-center content-center">
            {SERVICES_LIST.slice(0, 8).map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                onClick={onClose}
                className="group flex items-center gap-3 lg:gap-4 hover:bg-white/[0.03] p-2.5 rounded-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-[14px] bg-[#11141d] border border-white/5 flex items-center justify-center shrink-0 group-hover:border-amber-500/30 group-hover:bg-[#1a1d27] transition-all duration-300 shadow-sm">
                  {getIcon(service.slug)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm lg:text-[15px] font-outfit group-hover:text-amber-400 transition-colors">{service.name}</h4>
                  <p className="text-zinc-500 text-[11px] lg:text-xs font-inter line-clamp-1 mt-0.5">{service.shortDescription}</p>
                </div>
                <svg className="w-4 h-4 text-zinc-600 group-hover:text-amber-500 transition-colors shrink-0 -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>

          {/* Right Panel - CTA */}
          <div className="w-full md:w-[320px] lg:w-[340px] rounded-2xl overflow-hidden relative group p-6 lg:p-8 flex flex-col justify-end border border-white/10 shrink-0 min-h-[300px]">
            <Image 
              src="https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800" 
              fill 
              className="object-cover transition-transform duration-1000 group-hover:scale-110" 
              alt="Workspace" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/80 to-transparent opacity-95" />
            
            <div className="relative z-10 mt-auto">
              <h3 className="text-xl lg:text-[22px] font-bold text-white mb-5 font-outfit leading-tight drop-shadow-md">
                Let's build something<br/>great together.
              </h3>
              <Link 
                href="/#start-a-project" 
                onClick={onClose} 
                className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-full border border-amber-500/70 text-amber-400 hover:bg-amber-500 hover:text-black transition-all duration-300 text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(246,196,49,0.1)] hover:shadow-[0_0_20px_rgba(246,196,49,0.3)]"
              >
                Get a Free Consultation
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
