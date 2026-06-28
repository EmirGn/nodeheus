import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import s from "./studio.module.css";
import FluidArt, { Sparkle } from "./FluidArt";
import { ServicesAccordion, ContactForm } from "./Interactive";

const display = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-studio",
  display: "swap",
});

export const metadata: Metadata = {
  title: "nodeheus studio — design & engineering for the things you ship",
  description:
    "nodeheus studio is the product, brand and engineering studio of nodeheus. We design and build software, brands and the interfaces in between.",
  openGraph: {
    title: "nodeheus studio",
    description: "Design & engineering for the things you ship.",
    type: "website",
  },
};

const tags = [
  "SaaS",
  "eCommerce",
  "Cloud Computing",
  "AI Solutions",
  "Blockchain Technology",
  "Mobile Apps",
  "Data Analytics",
  "Cybersecurity Services",
  "Remote Work Tools",
];

const approach = [
  {
    label: "Services",
    head: "Strategy",
    body: "We connect with your aspirations and goals — designing tools and products that have a real, lasting impact. Strategy first, then everything that follows it earns its place.",
  },
  {
    label: "Technology",
    head: "Platform",
    body: "We leverage real-time dashboards and a modern, type-safe platform to keep delivery transparent. The build is exposed, node by node — no black boxes, no surprises at the end.",
  },
  {
    label: "Difference",
    head: "Team",
    body: "We are a small, senior team that operates as one with yours. Designers and engineers in the same room, shipping together, accountable for the same outcome from day one.",
  },
  {
    label: "Analytics",
    head: "Growth",
    body: "We instrument what we ship and read what it tells us — finding the necessary improvements, then making them before anyone else sees the cracks. Growth is the proof.",
  },
];

export default function StudioPage() {
  return (
    <div className={`${display.variable} ${s.page}`}>
      {/* ───────── nav ───────── */}
      <header className={s.nav}>
        <a className={s.brand} href="#top">
          nodeheus<span className={s.brandDim}> studio</span>
        </a>
        <nav className={s.navLinks}>
          <a href="#approach">About</a>
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className={s.bookBtn} href="#contact">
          Book a Call
        </a>
      </header>

      <main id="top">
        {/* ───────── hero card ───────── */}
        <section className={s.heroWrap}>
          <div className={s.heroCard}>
            <div className={s.heroArt}>
              <FluidArt seed={7} freq="0.0045 0.0075" scale={64} />
            </div>
            <div className={s.heroInner}>
              <div>
                <h1 className={s.heroTitle}>
                  nodeheus
                  <br />
                  Studio
                </h1>
                <div className={s.heroGlyphs}>
                  <Sparkle size={30} />
                  <span className={s.plus}>+</span>
                </div>
              </div>
              <div className={s.heroBottom}>
                <p className={s.poweredBy}>Powered by nodeheus</p>
                <div className={s.tags}>
                  {tags.map((t) => (
                    <span key={t} className={s.tag}>
                      <Sparkle size={11} className={s.tagStar} />
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── statement ───────── */}
        <section className={s.statement}>
          <h2 className={s.statementText}>
            Building something that is bigger than ourselves — and creating
            tools and products that will have a global impact, for good.
          </h2>
          <a className={s.ghostBtn} href="#approach">
            More about us
          </a>
        </section>

        {/* ───────── approach ───────── */}
        <section id="approach" className={s.section}>
          <h2 className={s.sectionTitle}>
            About our
            <br />
            approach to work
          </h2>
          <div className={s.approachGrid}>
            {approach.map((c) => (
              <div key={c.label} className={s.approachCol}>
                <div className={s.approachTop}>
                  <Sparkle size={13} className={s.approachIcon} />
                  <span className={s.approachLabel}>{c.label}</span>
                </div>
                <h3 className={s.approachHead}>{c.head}</h3>
                <p className={s.approachBody}>{c.body}</p>
              </div>
            ))}
          </div>
          <div className={s.track}>
            <span className={s.trackFill} />
          </div>
        </section>

        {/* ───────── selected works ───────── */}
        <section id="work" className={s.section}>
          <h2 className={s.sectionTitle}>Selected Works</h2>
          <p className={s.sectionLede}>
            Whether you&apos;re rebuilding a SaaS platform, launching a mobile
            app, or validating a new MVP — nodeheus studio is here to help. Let&apos;s
            turn your product vision into a world-class user experience.
          </p>
          <div className={s.showcase}>
            <div className={s.showcaseMain}>
              <FluidArt seed={5} freq="0.004 0.0065" scale={70} />
              <div className={s.showcaseOverlay}>
                <span className={s.showcaseTag}>Marketing</span>
                <p className={s.showcaseText}>
                  A full-funnel digital marketing system designed to reach your
                  target audience and cut through the noise — built to scale with
                  the team behind it.
                </p>
              </div>
            </div>
            <div className={s.showcaseRail}>
              <div className={s.railCol}>
                <span className={s.railPlus}>+</span>
                <span className={s.railLabel}>Design</span>
              </div>
              <div className={s.railCol}>
                <span className={s.railPlus}>+</span>
                <span className={s.railLabel}>Engineering</span>
              </div>
            </div>
          </div>
        </section>

        {/* ───────── services ───────── */}
        <section id="services" className={s.section}>
          <h2 className={s.sectionTitle}>Services</h2>
          <p className={s.sectionLede}>
            We offer diverse solutions tailored to your needs, ensuring safety
            and efficiency — from consulting through implementation of every
            project we handle.
          </p>
          <ServicesAccordion />
        </section>

        {/* ───────── next project ───────── */}
        <section className={s.nextProject}>
          <FluidArt seed={17} freq="0.0042 0.007" scale={66} />
          <div className={s.nextInner}>
            <span className={s.nextLabel}>Next Project</span>
            <h2 className={s.nextTitle}>MERIDIAN</h2>
            <p className={s.nextSub}>Product Design / Web Concept</p>
            <a className={s.viewBtn} href="#contact">
              View Project
              <span className={s.viewArrow} aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </section>

        {/* ───────── connect ───────── */}
        <section id="contact" className={s.connect}>
          <h2 className={s.connectTitle}>LET&apos;S CONNECT</h2>
          <ContactForm />
        </section>
      </main>

      {/* ───────── footer ───────── */}
      <footer className={s.footer}>
        <div className={s.footerMain}>
          <p className={s.getInTouch}>Get in touch</p>
          <a className={s.footerMail} href="mailto:hello@nodeheus.studio">
            HELLO@NODEHEUS.STUDIO
          </a>
          <p className={s.rights}>All rights reserved © {new Date().getFullYear()}</p>
        </div>
        <div className={s.footerLinks}>
          <div className={s.linkCol}>
            <a href="#top">Home</a>
            <a href="#approach">About</a>
            <a href="#work">Projects</a>
          </div>
          <div className={s.linkCol}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href="https://t.me" target="_blank" rel="noreferrer">
              Telegram
            </a>
          </div>
          <div className={s.linkCol}>
            <a href="https://behance.net" target="_blank" rel="noreferrer">
              Behance
            </a>
            <a href="https://dribbble.com" target="_blank" rel="noreferrer">
              Dribbble
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
