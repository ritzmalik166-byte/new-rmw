import Image from "next/image";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { site } from "@/lib/site";

const COMING_UP = ["Brand campaigns", "SEO case studies", "Websites we've built", "Print & outdoor"];

const PROGRESS = 72;

export function WorkInProgress() {
  const phone = site.footer.phones[0];

  return (
    <section className="work-wip" aria-labelledby="work-wip-title">
      <div className="work-wip-inner">
        <div className="work-wip-copy">
          <p className="work-wip-kicker">
            <span className="work-wip-pill">Our Work</span>
            <span className="work-wip-hindi" lang="hi">
              काम चालू है
            </span>
          </p>

          <h1 id="work-wip-title" className="work-wip-title">
            Work in <span>progress.</span>
          </h1>

          <p className="work-wip-lede">
            We&rsquo;re painting our case studies onto the back of the truck: real campaigns,
            real dashboards and real numbers. The portfolio pulls in soon.
          </p>

          <div
            className="work-wip-meter"
            role="progressbar"
            aria-label="Portfolio build progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={PROGRESS}
          >
            <div className="work-wip-meter-head">
              <span>Portfolio loading</span>
              <strong>{PROGRESS}%</strong>
            </div>
            <div className="work-wip-meter-track">
              <span
                className="work-wip-meter-fill"
                style={{ "--wip-progress": `${PROGRESS}%` } as React.CSSProperties}
              />
            </div>
          </div>

          <p className="work-wip-soon">On the truck soon</p>
          <ul className="work-wip-chips">
            {COMING_UP.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>

          <div className="work-wip-actions">
            <a href="#start-a-project" className="work-wip-btn is-hot">
              Start a project <span aria-hidden>→</span>
            </a>
            <TransitionLink href="/services" className="work-wip-btn">
              Explore our services
            </TransitionLink>
          </div>
          <p className="work-wip-call">
            Want to see work right now? Call{" "}
            <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a> and we&rsquo;ll walk you
            through it.
          </p>
        </div>

        <div className="work-wip-scene" aria-hidden>
          <span className="work-wip-glow" />

          <div className="work-wip-sign">
            <div className="work-wip-sign-board">
              <span className="work-wip-sign-hi" lang="hi">
                काम चालू है
              </span>
              <strong>Work in progress</strong>
              <span className="work-wip-sign-sub">Portfolio under construction</span>
            </div>
            <span className="work-wip-pole is-l" />
            <span className="work-wip-pole is-r" />
          </div>

          <div className="work-wip-barrier">
            <span className="work-wip-lamp is-l" />
            <span className="work-wip-lamp is-r" />
            <span className="work-wip-barrier-bar" />
            <span className="work-wip-barrier-leg is-l" />
            <span className="work-wip-barrier-leg is-r" />
          </div>

          <span className="work-wip-cone is-a" />
          <span className="work-wip-cone is-b" />

          <p className="work-wip-bubble" lang="hi">
            रुको ज़रा, सब्र करो
          </p>

          <div className="work-wip-road">
            <span className="work-wip-lane" />
          </div>

          <Image
            className="work-wip-truck"
            src="/loader/textures/truck-side.webp"
            alt=""
            width={521}
            height={287}
            sizes="(max-width: 900px) 40vw, 240px"
            priority
          />
        </div>
      </div>
    </section>
  );
}
