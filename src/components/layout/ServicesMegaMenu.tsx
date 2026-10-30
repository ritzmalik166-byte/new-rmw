"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { SERVICE_ACCENTS, SERVICE_ICONS } from "@/lib/service-icons";
import { MENU_SERVICES } from "@/lib/services-data";
import { site } from "@/lib/site";
import { SHOW_AI_SERVICES } from "@/lib/feature-flags";

interface ServicesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const STATS = [
  { value: "18+", label: "Years" },
  { value: "300+", label: "Brands" },
  { value: "100+", label: "Experts" },
] as const;

export function ServicesMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: ServicesMegaMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const phone = site.footer.phones[0];

  return (
    <div
      className={cn("smm", isOpen && "is-open")}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="region"
      aria-label="Services menu"
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
      <div className="smm-backdrop" onClick={onClose} aria-hidden />

      <div className="smm-panel" data-lenis-prevent>
        <span className="smm-stripes" aria-hidden />

        <div className="smm-body">
          <aside className="smm-intro">
            <p className="smm-kicker">
              <span className="smm-kicker-pill">Our services</span>
              <span className="smm-kicker-hindi">हमारी सेवाएं</span>
            </p>
            <p className="smm-lede">
              From strategy to execution, we help brands grow with creativity,
              technology and results.
            </p>

            <ul className="smm-stats">
              {STATS.map((stat) => (
                <li key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>

            <div className="smm-intro-actions">
              <Link href="/contact.html" target="_blank" rel="noopener noreferrer" onClick={onClose} className="smm-cta">
                Get a free consultation
                <ArrowIcon />
              </Link>
              <Link href="/services" onClick={onClose} className="smm-all">
                View all services
              </Link>
            </div>

            <span className="smm-intro-mark" aria-hidden>
              <Image src="/logo.png" alt="Ritz Media World logo" fill sizes="220px" />
            </span>
          </aside>

          <ul className="smm-grid">
            {MENU_SERVICES.map((service, index) => {
              const href = `/services/${service.slug}`;
              const icon = SERVICE_ICONS[service.slug];
              return (
                <li
                  key={service.slug}
                  style={
                    {
                      "--i": index,
                      "--accent": SERVICE_ACCENTS[index % SERVICE_ACCENTS.length],
                    } as React.CSSProperties
                  }
                >
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn("smm-card", pathname === href && "is-current")}
                  >
                    <span className="smm-card-num">{String(index + 1).padStart(2, "0")}</span>
                    <span className="smm-card-icon">
                      {icon ? <Image src={icon} alt={`${service.name} icon`} width={160} height={160} sizes="96px" /> : null}
                    </span>
                    <span className="smm-card-text">
                      <span className="smm-card-name">{service.name}</span>
                      <span className="smm-card-desc">{service.shortDescription}</span>
                    </span>
                    <span className="smm-card-go" aria-hidden>
                      <ArrowIcon />
                    </span>
                  </Link>
                </li>
              );
            })}
            {/* Hidden on the live site so the services grid ends cleanly at 9 cards. */}
            {SHOW_AI_SERVICES ? (
              <li className="smm-feature">
                <div className="smm-feature-card">
                  <span className="smm-feature-orbit smm-feature-orbit-one" aria-hidden />
                  <span className="smm-feature-orbit smm-feature-orbit-two" aria-hidden />
                  <span className="smm-feature-spark smm-feature-spark-one" aria-hidden>✦</span>
                  <span className="smm-feature-spark smm-feature-spark-two" aria-hidden>✦</span>
                  <div className="smm-feature-copy">
                    <span className="smm-feature-kicker">Have a bigger idea?</span>
                    <strong>Let’s make it impossible to ignore.</strong>
                    <span>Tell us what you’re building. We’ll bring the right experts to the table.</span>
                  </div>
                  <Link href="/contact.html" target="_blank" rel="noopener noreferrer" onClick={onClose} className="smm-feature-link">
                    Start a conversation
                    <ArrowIcon />
                  </Link>
                </div>
              </li>
            ) : null}
          </ul>
        </div>

        <div className="smm-foot">
          <p className="smm-foot-route">
            <span className="smm-foot-label">{MENU_SERVICES.length} services · one route</span>
            {SHOW_AI_SERVICES ? (
              <Link href="/services/ai-services" onClick={onClose} className="smm-foot-ai">
                Explore our new AI Services
                <ArrowIcon />
              </Link>
            ) : null}
          </p>
          {phone ? (
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="smm-foot-call">
              <span className="smm-foot-horn">Horn OK Please</span>
              Call {phone}
            </a>
          ) : null}
        </div>

        <span className="smm-scallop" aria-hidden />
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}
