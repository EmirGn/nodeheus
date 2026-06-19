import type { Metadata } from "next";
import Link from "next/link";
import site from "../page.module.css";
import FlowCanvas from "./FlowCanvas";

export const metadata: Metadata = {
  title: "nodeheus Flow — the orchestration layer for AI",
  description:
    "Wire models, tools and data into a living graph and watch it run. The first product from the nodeheus intelligence division.",
};

export default function FlowPage() {
  return (
    <div className={site.page}>
      <header className={site.nav}>
        <Link className={site.brand} href="/">
          nodeheus
        </Link>
        <span className={site.est}>Flow</span>
        <nav className={site.links}>
          <Link href="/">← Home</Link>
          <a href="#how">How it works</a>
        </nav>
      </header>

      <main>
        <section className={site.hero} style={{ padding: "60px 0 26px" }}>
          <p className={site.eyebrow}>Intelligence Division · Product 01</p>
          <h1 className={site.title}>Flow</h1>
          <p className={site.lede}>
            The orchestration layer for AI. Wire models, tools and data into a
            living graph — then watch it run, node by node, in real time.
          </p>
        </section>

        <FlowCanvas />

        <section id="how" className={site.section} style={{ marginTop: 40 }}>
          <div className={site.sectionHead}>
            <span className={site.sectionLabel}>§ Why it matters</span>
            <span className={site.count}>Fig. 02 — The Nodeheus Network, executable</span>
          </div>
          <p className={site.prose}>
            Every company is becoming a network of AI agents. Today that network
            is glued together by hand. <em>nodeheus Flow</em> makes it a single
            canvas: each node is a model call, a tool, or a piece of data, and
            the graph is the program. The same network that holds our divisions
            together becomes the substrate every business runs on.
          </p>
          <p className={site.prose} style={{ marginTop: 22 }}>
            This is a working prototype — the prompt nodes call Claude live. Drop
            in your own steps, wire them up, and run.
          </p>
        </section>
      </main>

      <footer className={site.footer}>
        <span>© {new Date().getFullYear()} nodeheus</span>
        <span>Flow · intelligence division</span>
        <Link href="/">nodeheus.com</Link>
      </footer>
    </div>
  );
}
