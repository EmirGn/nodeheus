import Link from "next/link";
import styles from "./page.module.css";
import NetworkGraph from "./NetworkGraph";

const divisions = [
  { name: "Cloud", desc: "Planet-scale compute, storage and networking." },
  { name: "Intelligence", desc: "Frontier AI research and applied models." },
  { name: "Silicon", desc: "Custom chips, from edge to datacenter." },
  { name: "Robotics", desc: "Autonomous machines for the physical world." },
  { name: "Energy", desc: "Grids, storage and clean generation." },
  { name: "Finance", desc: "Payments, capital and digital assets." },
  { name: "Security", desc: "Defending the world's critical systems." },
  { name: "Health", desc: "Computational biology and care delivery." },
  { name: "Space", desc: "Launch, orbit and off-world infrastructure." },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.nav}>
        <span className={styles.brand}>nodeheus</span>
        <span className={styles.est}>Est. MMXXVI</span>
        <nav className={styles.links}>
          <Link href="/flow">Flow</Link>
          <a href="#network">Network</a>
          <a href="#divisions">Divisions</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>A privately held technology conglomerate</p>
          <h1 className={styles.title}>
            The infrastructure
            <br />
            of <em>everything</em>.
          </h1>
          <p className={styles.lede}>
            nodeheus founds, acquires and operates the companies building the
            foundations of modern life — across compute, intelligence, silicon,
            finance and beyond. One holding company. Every layer of the stack.
          </p>
          <p className={styles.measure}>We measure success in decades, not quarters.</p>
          <Link className={styles.cta} href="/flow">
            Now building — nodeheus Flow →
          </Link>
        </section>

        <section id="network" className={styles.networkSection}>
          <NetworkGraph />
        </section>

        <section id="divisions" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>§ Divisions</span>
            <span className={styles.count}>{divisions.length} operating companies</span>
          </div>
          <ol className={styles.ledger}>
            {divisions.map((d, i) => (
              <li key={d.name} className={styles.row}>
                <span className={styles.rowNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.rowName}>{d.name}</span>
                <span className={styles.rowDesc}>{d.desc}</span>
              </li>
            ))}
          </ol>
        </section>

        <section id="about" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>§ Doctrine</span>
          </div>
          <p className={styles.prose}>
            We believe the most important companies of the next century will be
            the ones that own the <em>foundations</em> — the compute, the models,
            the silicon, the rails. nodeheus exists to build and hold those
            companies, granting each the autonomy to operate and the patience to
            compound. We are not a fund. We are an owner.
          </p>
        </section>

        <section id="contact" className={styles.section}>
          <div className={styles.sectionHead}>
            <span className={styles.sectionLabel}>§ Contact</span>
          </div>
          <p className={styles.prose}>For partnerships, press and inquiries.</p>
          <a className={styles.mail} href="mailto:hello@nodeheus.com">
            hello@nodeheus.com
          </a>
        </section>
      </main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} nodeheus</span>
        <span>The infrastructure of everything</span>
        <span>nodeheus.com</span>
      </footer>
    </div>
  );
}
