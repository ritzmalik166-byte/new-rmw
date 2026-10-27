import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import "@/styles/not-found/not-found.css";

const DETOURS = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/case-study", label: "Case Studies" },
  { href: "/blog", label: "Blog" },
  { href: "/about.html", label: "About" },
] as const;

const SLOGANS = [
  "Horn OK Please",
  "रास्ता भटक गए?",
  "Use Dipper at Night",
  "आगे रास्ता बंद है",
  "Wrong Route · Page 404",
  "बुरी नज़र वाले तेरा मुँह काला",
  "Keep Distance",
  "फिर मिलेंगे",
] as const;

export default function NotFound() {
  return (
    <section className="nf" aria-labelledby="nf-title">
      <title>{`Page Not Found — ${site.fullName}`}</title>

      <div className="nf-inner">
        <div className="nf-copy">
          <p className="nf-kicker">
            <span className="nf-pill">Error 404</span>
            <span className="nf-kicker-hindi" lang="hi">
              रास्ता भटक गए?
            </span>
          </p>

          <h1 id="nf-title" className="nf-title">
            Wrong turn. This road <span className="nf-title-accent">doesn&apos;t exist.</span>
          </h1>

          <p className="nf-lede">
            The page you were looking for has taken a different highway, or never left the
            depot. Let&apos;s get you back on route.
          </p>

          <div className="nf-actions">
            <Link href="/" className="btn btn-hot">
              Back to Home
              <span className="btn-icon btn-icon-arrow" aria-hidden />
            </Link>
            <Link href="/contact.html" className="btn btn-ink">
              Ask for Directions
            </Link>
          </div>

          <nav className="nf-detours" aria-label="Popular routes">
            <p className="nf-detours-label">Take a detour</p>
            <ul className="nf-detours-list">
              {DETOURS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="nf-detour">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="nf-stage">
          <div className="nf-sign" aria-hidden>
            <span className="nf-sign-board">
              <span className="nf-sign-arrow">↺</span>
              No Through Road
            </span>
            <span className="nf-sign-post" />
          </div>

          <div className="nf-truck theme-keep">
            <Image
              src="/about/truck-back.png"
              alt="Back of a hand-painted Ritz Media World truck showing 404"
              width={810}
              height={668}
              sizes="(max-width: 900px) 88vw, 560px"
              className="nf-truck-img"
              priority
            />

            <div className="nf-panel" aria-hidden>
              <p className="nf-painted">404</p>
              <p className="nf-painted-sub" lang="hi">
                आगे रास्ता बंद है
              </p>
              <p className="nf-painted-en">Page not found</p>
            </div>

            <span className="nf-light is-left" aria-hidden />
            <span className="nf-light is-right" aria-hidden />

            <span className="nf-plate" aria-hidden>
              RMW 404
            </span>
          </div>

          <span className="nf-shadow" aria-hidden />
          <div className="nf-road" aria-hidden />
        </div>
      </div>

      <div className="nf-ribbon" aria-hidden>
        <div className="nf-ribbon-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="nf-ribbon-list">
              {SLOGANS.map((slogan) => (
                <li key={slogan} className="nf-ribbon-item">
                  {slogan}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
