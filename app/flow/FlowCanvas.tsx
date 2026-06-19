"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./flow.module.css";
import { TEMPLATES } from "./templates";
import {
  type FlowEdge,
  type FlowNode,
  type NodeKind,
  type NodeRuntime,
  NODE_W,
  PORT_Y,
} from "./types";

type Runtime = Record<string, NodeRuntime>;
type Mode = "live" | "simulated" | null;

type Drag =
  | { mode: "node"; id: string; dx: number; dy: number }
  | { mode: "link"; from: string };

const KIND_GLYPH: Record<NodeKind, string> = {
  input: "✎",
  prompt: "✦",
  tool: "⚙",
  output: "▣",
};

const KIND_LABEL: Record<NodeKind, string> = {
  input: "input",
  prompt: "claude",
  tool: "tool",
  output: "output",
};

let idCounter = 100;
const genId = (p: string) => `${p}${idCounter++}`;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function FlowCanvas() {
  const initial = TEMPLATES[0].graph;
  const [nodes, setNodes] = useState<FlowNode[]>(initial.nodes);
  const [edges, setEdges] = useState<FlowEdge[]>(initial.edges);
  const [runtime, setRuntime] = useState<Runtime>({});
  const [running, setRunning] = useState(false);
  const [runningNode, setRunningNode] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [linkPos, setLinkPos] = useState<{ x: number; y: number } | null>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<Drag | null>(null);

  // ---- geometry -----------------------------------------------------------
  const toBoard = useCallback((clientX: number, clientY: number) => {
    const r = boardRef.current?.getBoundingClientRect();
    return {
      x: clientX - (r?.left ?? 0) + (boardRef.current?.scrollLeft ?? 0),
      y: clientY - (r?.top ?? 0) + (boardRef.current?.scrollTop ?? 0),
    };
  }, []);

  const nodeById = useCallback(
    (id: string) => nodes.find((n) => n.id === id),
    [nodes]
  );

  // ---- drag + link wiring -------------------------------------------------
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const p = toBoard(e.clientX, e.clientY);
      if (drag.mode === "node") {
        const nx = Math.max(0, p.x - drag.dx);
        const ny = Math.max(0, p.y - drag.dy);
        setNodes((ns) =>
          ns.map((n) => (n.id === drag.id ? { ...n, x: nx, y: ny } : n))
        );
      } else {
        setLinkPos(p);
      }
    };

    const onUp = (e: PointerEvent) => {
      const drag = dragRef.current;
      dragRef.current = null;
      setLinkPos(null);
      document.body.classList.remove(styles.dragging);
      if (!drag || drag.mode !== "link") return;

      const el = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest("[data-node-in]");
      const to = el?.getAttribute("data-node-in");
      if (!to || to === drag.from) return;
      setEdges((es) => {
        if (es.some((x) => x.from === drag.from && x.to === to)) return es;
        if (es.some((x) => x.from === to && x.to === drag.from)) return es; // no 2-cycles
        return [...es, { id: genId("e"), from: drag.from, to }];
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [toBoard]);

  const startNodeDrag = (e: React.PointerEvent, node: FlowNode) => {
    const p = toBoard(e.clientX, e.clientY);
    dragRef.current = { mode: "node", id: node.id, dx: p.x - node.x, dy: p.y - node.y };
    document.body.classList.add(styles.dragging);
  };

  const startLink = (e: React.PointerEvent, from: string) => {
    e.stopPropagation();
    dragRef.current = { mode: "link", from };
    setLinkPos(toBoard(e.clientX, e.clientY));
    document.body.classList.add(styles.dragging);
  };

  // ---- graph mutation -----------------------------------------------------
  const loadTemplate = (id: string) => {
    const t = TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    setTemplateId(id);
    setNodes(t.graph.nodes.map((n) => ({ ...n })));
    setEdges(t.graph.edges.map((e) => ({ ...e })));
    setRuntime({});
    setMode(null);
    setRunningNode(null);
  };

  const updateNode = (id: string, value: string) =>
    setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, value } : n)));

  const deleteNode = (id: string) => {
    setNodes((ns) => ns.filter((n) => n.id !== id));
    setEdges((es) => es.filter((e) => e.from !== id && e.to !== id));
    setRuntime((r) => {
      const { [id]: _drop, ...rest } = r;
      return rest;
    });
  };

  const removeEdge = (id: string) =>
    setEdges((es) => es.filter((e) => e.id !== id));

  const addNode = (kind: NodeKind) => {
    const n = nodes.length;
    const node: FlowNode = {
      id: genId("n"),
      kind,
      title:
        kind === "prompt"
          ? "New step"
          : kind === "tool"
          ? "Fetch"
          : kind === "input"
          ? "Input"
          : "Output",
      x: 60 + (n % 4) * 30,
      y: 360 + (n % 3) * 24,
      value: "",
      ...(kind === "tool" ? { toolKind: "fetch" as const } : {}),
    };
    if (kind === "prompt") node.value = "Describe what this step should do…";
    setNodes((ns) => [...ns, node]);
  };

  // ---- execution ----------------------------------------------------------
  const setStatus = (id: string, status: NodeRuntime["status"]) =>
    setRuntime((r) => ({
      ...r,
      [id]: { status, output: r[id]?.output ?? "" },
    }));

  const setOutput = (id: string, output: string) =>
    setRuntime((r) => ({
      ...r,
      [id]: { status: r[id]?.status ?? "running", output },
    }));

  const typeInto = (id: string, text: string) =>
    new Promise<void>((resolve) => {
      if (!text) {
        setOutput(id, "");
        resolve();
        return;
      }
      const ticks = Math.min(36, Math.max(1, text.length));
      const per = Math.ceil(text.length / ticks);
      let i = 0;
      const t = setInterval(() => {
        i += per;
        setOutput(id, text.slice(0, i));
        if (i >= text.length) {
          clearInterval(t);
          resolve();
        }
      }, 18);
    });

  const topoSort = (ns: FlowNode[], es: FlowEdge[]): string[] => {
    const ids = ns.map((n) => n.id);
    const indeg: Record<string, number> = {};
    ids.forEach((id) => (indeg[id] = 0));
    es.forEach((e) => {
      if (e.to in indeg) indeg[e.to]++;
    });
    const queue = ids.filter((id) => indeg[id] === 0);
    const order: string[] = [];
    while (queue.length) {
      const id = queue.shift()!;
      order.push(id);
      es.filter((e) => e.from === id).forEach((e) => {
        if (e.to in indeg && --indeg[e.to] === 0) queue.push(e.to);
      });
    }
    // any leftovers (cycles) appended so they still render a state
    ids.forEach((id) => order.includes(id) || order.push(id));
    return order;
  };

  const run = async () => {
    if (running) return;
    setRunning(true);
    setMode(null);
    setRuntime(
      Object.fromEntries(nodes.map((n) => [n.id, { status: "idle", output: "" }]))
    );

    const order = topoSort(nodes, edges);
    const outputs: Record<string, string> = {};
    let current = "";

    try {
      for (const id of order) {
        const node = nodes.find((n) => n.id === id);
        if (!node) continue;
        current = id;

        const input = edges
          .filter((e) => e.to === id)
          .map((e) => outputs[e.from])
          .filter(Boolean)
          .join("\n\n");

        setRunningNode(id);
        setStatus(id, "running");
        await wait(220);

        let output = "";
        if (node.kind === "input") {
          output = node.value;
        } else if (node.kind === "output") {
          output = input;
        } else {
          const res = await fetch("/api/flow/run", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              kind: node.kind,
              toolKind: node.toolKind,
              instruction: node.value,
              value: node.value,
              input,
            }),
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          output = data.output ?? "";
          if (data.mode) setMode(data.mode);
        }

        outputs[id] = output;
        await typeInto(id, output);
        setStatus(id, "done");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Run failed.";
      setRuntime((r) => ({
        ...r,
        [current]: { status: "error", output: `⚠ ${message}` },
      }));
    } finally {
      setRunningNode(null);
      setRunning(false);
    }
  };

  // ---- edge rendering -----------------------------------------------------
  const edgePath = (a: FlowNode, b: FlowNode) => {
    const x1 = a.x + NODE_W;
    const y1 = a.y + PORT_Y;
    const x2 = b.x;
    const y2 = b.y + PORT_Y;
    const dx = Math.max(40, Math.abs(x2 - x1) / 2);
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };

  const linkPreview = () => {
    const drag = dragRef.current;
    if (!drag || drag.mode !== "link" || !linkPos) return null;
    const a = nodeById(drag.from);
    if (!a) return null;
    const x1 = a.x + NODE_W;
    const y1 = a.y + PORT_Y;
    const dx = Math.max(40, Math.abs(linkPos.x - x1) / 2);
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${linkPos.x - dx} ${linkPos.y}, ${linkPos.x} ${linkPos.y}`;
  };

  const tpl = TEMPLATES.find((t) => t.id === templateId);

  return (
    <div className={styles.wrap}>
      {/* toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.tplGroup}>
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              className={`${styles.tpl} ${
                t.id === templateId ? styles.tplActive : ""
              }`}
              onClick={() => loadTemplate(t.id)}
              disabled={running}
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className={styles.addGroup}>
          {(["input", "prompt", "tool", "output"] as NodeKind[]).map((k) => (
            <button
              key={k}
              className={styles.add}
              onClick={() => addNode(k)}
              disabled={running}
              title={`Add ${k} node`}
            >
              + {k}
            </button>
          ))}
        </div>

        <div className={styles.runGroup}>
          {mode && (
            <span
              className={`${styles.mode} ${
                mode === "live" ? styles.modeLive : styles.modeSim
              }`}
            >
              {mode === "live" ? "● live · opus 4.8" : "○ simulated"}
            </span>
          )}
          <button className={styles.run} onClick={run} disabled={running}>
            {running ? "running…" : "▶ run"}
          </button>
        </div>
      </div>

      {tpl && <p className={styles.blurb}>{tpl.blurb}</p>}

      {/* canvas */}
      <div className={styles.board} ref={boardRef}>
        <div className={styles.surface}>
          <svg className={styles.wires} width={1500} height={640}>
            {edges.map((e) => {
              const a = nodeById(e.from);
              const b = nodeById(e.to);
              if (!a || !b) return null;
              const active = runningNode === e.to;
              const done =
                runtime[e.from]?.status === "done" &&
                runtime[e.to]?.status === "done";
              return (
                <g key={e.id} className={styles.wireGroup}>
                  <path
                    d={edgePath(a, b)}
                    className={`${styles.wire} ${active ? styles.wireActive : ""} ${
                      done ? styles.wireDone : ""
                    }`}
                  />
                  <path
                    d={edgePath(a, b)}
                    className={styles.wireHit}
                    onClick={() => !running && removeEdge(e.id)}
                  >
                    <title>click to disconnect</title>
                  </path>
                </g>
              );
            })}
            {linkPreview() && (
              <path d={linkPreview()!} className={styles.wirePreview} />
            )}
          </svg>

          {nodes.map((node) => {
            const rt = runtime[node.id];
            const status = rt?.status ?? "idle";
            return (
              <div
                key={node.id}
                className={`${styles.node} ${styles[`k_${node.kind}`]} ${
                  runningNode === node.id ? styles.nodeRunning : ""
                }`}
                style={{ left: node.x, top: node.y, width: NODE_W }}
              >
                <div
                  className={styles.head}
                  onPointerDown={(e) => startNodeDrag(e, node)}
                >
                  <span className={styles.glyph}>{KIND_GLYPH[node.kind]}</span>
                  <span className={styles.title}>{node.title}</span>
                  <span className={styles.kind}>{KIND_LABEL[node.kind]}</span>
                  <span className={`${styles.dot} ${styles[`dot_${status}`]}`} />
                  <button
                    className={styles.del}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => deleteNode(node.id)}
                    title="delete node"
                  >
                    ×
                  </button>
                </div>

                {/* ports */}
                {node.kind !== "input" && (
                  <span
                    className={`${styles.port} ${styles.portIn}`}
                    data-node-in={node.id}
                  />
                )}
                {node.kind !== "output" && (
                  <span
                    className={`${styles.port} ${styles.portOut}`}
                    onPointerDown={(e) => startLink(e, node.id)}
                    title="drag to connect"
                  />
                )}

                <div className={styles.body}>
                  {node.kind === "input" && (
                    <textarea
                      className={styles.field}
                      value={node.value}
                      placeholder="Type the starting text…"
                      onChange={(e) => updateNode(node.id, e.target.value)}
                      rows={3}
                    />
                  )}
                  {node.kind === "prompt" && (
                    <textarea
                      className={styles.field}
                      value={node.value}
                      placeholder="Instruction for Claude…"
                      onChange={(e) => updateNode(node.id, e.target.value)}
                      rows={3}
                    />
                  )}
                  {node.kind === "tool" && (
                    <input
                      className={styles.url}
                      value={node.value}
                      placeholder="https://…"
                      onChange={(e) => updateNode(node.id, e.target.value)}
                    />
                  )}
                  {rt?.output !== undefined && rt.output !== "" && (
                    <pre
                      className={`${styles.result} ${
                        status === "error" ? styles.resultError : ""
                      }`}
                    >
                      {rt.output}
                    </pre>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className={styles.hint}>
        Drag a node by its header · drag the right port onto another node&rsquo;s
        left port to wire them · click a wire to disconnect · then hit{" "}
        <strong>run</strong>.
      </p>
    </div>
  );
}
