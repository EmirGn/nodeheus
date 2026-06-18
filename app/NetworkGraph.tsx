"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./NetworkGraph.module.css";

type Node = { id: string; name: string; desc: string; x: number; y: number };

const HUB: Node = {
  id: "hub",
  name: "nodeheus",
  desc: "The holding company at the center of the network.",
  x: 500,
  y: 305,
};

const NODES: Node[] = [
  { id: "cloud", name: "Cloud", desc: "Planet-scale compute, storage and networking.", x: 170, y: 150 },
  { id: "intel", name: "Intelligence", desc: "Frontier AI research and applied models.", x: 480, y: 90 },
  { id: "silicon", name: "Silicon", desc: "Custom chips, from edge to datacenter.", x: 800, y: 130 },
  { id: "robotics", name: "Robotics", desc: "Autonomous machines for the physical world.", x: 905, y: 300 },
  { id: "energy", name: "Energy", desc: "Grids, storage and clean generation.", x: 800, y: 500 },
  { id: "finance", name: "Finance", desc: "Payments, capital and digital assets.", x: 500, y: 555 },
  { id: "security", name: "Security", desc: "Defending the world's critical systems.", x: 195, y: 515 },
  { id: "health", name: "Health", desc: "Computational biology and care delivery.", x: 95, y: 310 },
  { id: "space", name: "Space", desc: "Launch, orbit and off-world infrastructure.", x: 340, y: 235 },
];

const ALL: Node[] = [HUB, ...NODES];

const SPOKES: [string, string][] = NODES.map((n) => ["hub", n.id]);

const EDGES: [string, string][] = [
  ...SPOKES,
  // outer ring
  ["cloud", "intel"],
  ["intel", "silicon"],
  ["silicon", "robotics"],
  ["robotics", "energy"],
  ["energy", "finance"],
  ["finance", "security"],
  ["security", "health"],
  ["health", "cloud"],
  // cross links
  ["space", "cloud"],
  ["space", "intel"],
  ["space", "finance"],
  ["space", "health"],
  ["silicon", "energy"],
  ["intel", "robotics"],
];

const adj: Record<string, Set<string>> = {};
ALL.forEach((n) => (adj[n.id] = new Set()));
EDGES.forEach(([a, b]) => {
  adj[a].add(b);
  adj[b].add(a);
});

export default function NetworkGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const activeRef = useRef<string | null>(null);
  const [active, setActive] = useState<Node | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const circles = svg.querySelectorAll<SVGCircleElement>("[data-node]");
    const hits = svg.querySelectorAll<SVGCircleElement>("[data-hit]");
    const labels = svg.querySelectorAll<SVGTextElement>("[data-label]");
    const lines = svg.querySelectorAll<SVGLineElement>("[data-edge]");
    const packets = svg.querySelectorAll<SVGCircleElement>("[data-packet]");
    const pings = svg.querySelectorAll<SVGCircleElement>("[data-ping]");

    const base: Record<
      string,
      { x: number; y: number; ph: number; ax: number; ay: number; sp: number }
    > = {};
    ALL.forEach((n, i) => {
      base[n.id] = {
        x: n.x,
        y: n.y,
        ph: i * 1.7,
        ax: n.id === "hub" ? 2 : 5 + (i % 3) * 2,
        ay: n.id === "hub" ? 2 : 6 + (i % 2) * 3,
        sp: 0.35 + (i % 4) * 0.05,
      };
    });

    const cur: Record<string, { x: number; y: number }> = {};
    let raf = 0;

    const frame = (t: number) => {
      const time = t / 1000;
      for (const n of ALL) {
        const b = base[n.id];
        cur[n.id] = {
          x: reduce ? b.x : b.x + Math.sin(time * b.sp + b.ph) * b.ax,
          y: reduce ? b.y : b.y + Math.cos(time * b.sp * 0.9 + b.ph) * b.ay,
        };
      }

      const act = activeRef.current;

      hits.forEach((c) => {
        const p = cur[c.dataset.hit!];
        c.setAttribute("cx", p.x.toFixed(2));
        c.setAttribute("cy", p.y.toFixed(2));
      });

      lines.forEach((ln) => {
        const f = ln.dataset.from!;
        const tt = ln.dataset.to!;
        const a = cur[f];
        const b = cur[tt];
        ln.setAttribute("x1", a.x.toFixed(2));
        ln.setAttribute("y1", a.y.toFixed(2));
        ln.setAttribute("x2", b.x.toFixed(2));
        ln.setAttribute("y2", b.y.toFixed(2));
        const related = !act || f === act || tt === act;
        ln.setAttribute("opacity", act ? (related ? "0.85" : "0.06") : "0.28");
        ln.setAttribute("stroke", act && related ? "var(--accent)" : "var(--fg)");
      });

      // radar pings from the core
      pings.forEach((pg) => {
        const i = Number(pg.dataset.ping);
        const period = 3.4;
        const phase = reduce ? 0 : (((time + i * 1.7) % period) / period);
        pg.setAttribute("cx", cur.hub.x.toFixed(2));
        pg.setAttribute("cy", cur.hub.y.toFixed(2));
        pg.setAttribute("r", (8 + phase * 78).toFixed(2));
        pg.setAttribute("opacity", reduce ? "0" : (0.32 * (1 - phase)).toFixed(3));
      });

      // signal packets travelling outward along the spokes
      packets.forEach((p) => {
        const from = cur[p.dataset.pfrom!];
        const to = cur[p.dataset.pto!];
        const off = Number(p.dataset.poff);
        const prog = reduce ? 0 : ((time * 0.2 + off) % 1);
        p.setAttribute("cx", (from.x + (to.x - from.x) * prog).toFixed(2));
        p.setAttribute("cy", (from.y + (to.y - from.y) * prog).toFixed(2));
        const related = !act || act === "hub" || act === p.dataset.pto;
        const vis = reduce ? 0 : Math.sin(prog * Math.PI) * (related ? 0.9 : 0.08);
        p.setAttribute("opacity", vis.toFixed(2));
      });

      circles.forEach((c) => {
        const id = c.dataset.node!;
        const p = cur[id];
        c.setAttribute("cx", p.x.toFixed(2));
        c.setAttribute("cy", p.y.toFixed(2));
        const isActive = id === act;
        const neighbor = act ? adj[act].has(id) : false;
        const dim = !!act && !isActive && !neighbor;
        c.setAttribute("opacity", dim ? "0.2" : "1");
        if (isActive) {
          c.setAttribute("r", "8");
          c.setAttribute("fill", "var(--accent)");
          c.setAttribute("stroke", "var(--accent)");
        } else {
          c.setAttribute("r", id === "hub" ? "7" : "5");
          c.setAttribute("fill", id === "hub" ? "var(--fg)" : "var(--paper)");
          c.setAttribute("stroke", neighbor ? "var(--accent)" : "var(--fg)");
        }
      });

      labels.forEach((l) => {
        const id = l.dataset.label!;
        const p = cur[id];
        l.setAttribute("x", p.x.toFixed(2));
        l.setAttribute("y", (p.y - 18).toFixed(2));
        const isActive = id === act;
        const neighbor = act ? adj[act].has(id) : false;
        const dim = !!act && !isActive && !neighbor;
        l.setAttribute("opacity", dim ? "0.18" : isActive ? "1" : "0.75");
        l.setAttribute("fill", isActive ? "var(--accent)" : "var(--fg)");
      });

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const setHover = (n: Node | null) => {
    activeRef.current = n ? n.id : null;
    setActive(n);
  };

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.head}>
        <span>Fig. 01</span>
        <span>The Nodeheus Network</span>
        <span>{NODES.length} divisions / 1 holding co.</span>
      </figcaption>

      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox="0 0 1000 620"
        role="img"
        aria-label="Diagram of the Nodeheus network of divisions"
      >
        {/* edges */}
        {EDGES.map(([a, b], i) => (
          <line
            key={`e-${i}`}
            data-edge=""
            data-from={a}
            data-to={b}
            strokeWidth={1}
          />
        ))}

        {/* radar pings from the core */}
        {[0, 1].map((i) => (
          <circle
            key={`ping-${i}`}
            data-ping={i}
            r={8}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={1}
            opacity={0}
          />
        ))}

        {/* signal packets along the spokes */}
        {SPOKES.map(([from, to], i) => (
          <circle
            key={`p-${to}`}
            data-packet=""
            data-pfrom={from}
            data-pto={to}
            data-poff={(i / SPOKES.length).toFixed(3)}
            r={2.6}
            fill="var(--accent)"
            opacity={0}
          />
        ))}

        {/* nodes */}
        {ALL.map((n) => (
          <g key={n.id}>
            <circle
              data-node={n.id}
              r={n.id === "hub" ? 7 : 5}
              stroke="var(--fg)"
              strokeWidth={1.4}
              fill={n.id === "hub" ? "var(--fg)" : "var(--paper)"}
            />
            <text
              data-label={n.id}
              className={n.id === "hub" ? styles.hubLabel : styles.label}
              textAnchor="middle"
            >
              {n.id === "hub" ? "nodeheus" : n.name}
            </text>
            <circle
              data-hit={n.id}
              r={30}
              fill="transparent"
              className={styles.hit}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
            />
          </g>
        ))}
      </svg>

      <div className={styles.caption}>
        <span className={styles.captionKey}>
          {active ? (active.id === "hub" ? "CORE" : active.name) : "—"}
        </span>
        <span className={styles.captionText}>
          {active ? active.desc : "Hover a node to trace the network."}
        </span>
      </div>
    </figure>
  );
}
