"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/cn";
import { SERVICE_ACCENTS, SERVICE_ICONS } from "@/lib/service-icons";
import { SERVICES_LIST } from "@/lib/services-data";
import { site } from "@/lib/site";

interface ServicesMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const FEATURED = SERVICES_LIST.filter((service) => SERVICE_ICONS[service.slug]);
const MORE = SERVICES_LIST.filter((service) => !SERVICE_ICONS[service.slug]);

const STATS = [
  { value: "18+", label: "Years" },
  { value: "500+", label: "Brands" },
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
            <h3 className="smm-title">
              Creative solutions for <em>modern brands.</em>
            </h3>
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
              <Link href="/#start-a-project" onClick={onClose} className="smm-cta">
                Get a free consultation
                <ArrowIcon />
              </Link>
              <Link href="/services" onClick={onClose} className="smm-all">
                View all services
              </Link>
            </div>

            <span className="smm-intro-mark" aria-hidden>
              <Image src="/logo.png" alt="" fill sizes="220px" />
            </span>
          </aside>

          <ul className="smm-grid">
            {FEATURED.map((service, index) => {
              const href = `/services/${service.slug}`;
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
                      <Image
                        src={SERVICE_ICONS[service.slug]!}
                        alt=""
                        width={160}
                        height={160}
                      />
                    </span>
                    <span className="smm-card-name">{service.name}</span>
                    <span className="smm-card-desc">{service.shortDescription}</span>
                    <span className="smm-card-go" aria-hidden>
                      <ArrowIcon />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="smm-foot">
          <p className="smm-foot-route">
            <span className="smm-foot-label">Also on the route</span>
            {MORE.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                onClick={onClose}
                className="smm-chip"
              >
                {service.name}
              </Link>
            ))}
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
