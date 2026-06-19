import type { FlowGraph } from "./types";

export interface Template {
  id: string;
  name: string;
  blurb: string;
  graph: FlowGraph;
}

export const TEMPLATES: Template[] = [
  {
    id: "url-brief",
    name: "Page → executive brief",
    blurb: "Fetch a live web page, then have Claude turn it into a tight brief.",
    graph: {
      nodes: [
        {
          id: "n1",
          kind: "tool",
          toolKind: "fetch",
          title: "Fetch page",
          value: "https://www.anthropic.com/news",
          x: 40,
          y: 80,
        },
        {
          id: "n2",
          kind: "prompt",
          title: "Summarize",
          value:
            "Write a 4-bullet executive brief of this page. Lead each bullet with a bolded takeaway. Be specific and concrete.",
          x: 370,
          y: 80,
        },
        {
          id: "n3",
          kind: "output",
          title: "Brief",
          value: "",
          x: 700,
          y: 96,
        },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" },
        { id: "e2", from: "n2", to: "n3" },
      ],
    },
  },
  {
    id: "research",
    name: "Research fan-out",
    blurb: "From one topic, generate sharp questions and a structured answer.",
    graph: {
      nodes: [
        {
          id: "n1",
          kind: "input",
          title: "Topic",
          value: "The economics of small modular nuclear reactors",
          x: 40,
          y: 70,
        },
        {
          id: "n2",
          kind: "prompt",
          title: "Frame questions",
          value:
            "List the 5 most important questions an investor must answer about this topic. Numbered, one line each.",
          x: 360,
          y: 40,
        },
        {
          id: "n3",
          kind: "prompt",
          title: "Answer brief",
          value:
            "Answer these questions in a concise analyst memo. Use a heading per question. Flag the biggest uncertainty at the end.",
          x: 680,
          y: 70,
        },
        {
          id: "n4",
          kind: "output",
          title: "Memo",
          value: "",
          x: 1000,
          y: 86,
        },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" },
        { id: "e2", from: "n2", to: "n3" },
        { id: "e3", from: "n3", to: "n4" },
      ],
    },
  },
  {
    id: "extract",
    name: "Unstructured → JSON",
    blurb: "Drop in messy text; pull clean, structured fields out the other side.",
    graph: {
      nodes: [
        {
          id: "n1",
          kind: "input",
          title: "Raw text",
          value:
            "Hey — following up from the call. Acme Corp wants the Enterprise plan, ~120 seats, going live early Q3. Main contact is Dana Reyes (dana@acme.io). They're price-sensitive and asked about SSO.",
          x: 40,
          y: 60,
        },
        {
          id: "n2",
          kind: "prompt",
          title: "Extract fields",
          value:
            "Extract a JSON object with keys: company, plan, seats (number), go_live, contact_name, contact_email, concerns (array of strings). Return only the JSON.",
          x: 380,
          y: 70,
        },
        {
          id: "n3",
          kind: "output",
          title: "Structured",
          value: "",
          x: 710,
          y: 86,
        },
      ],
      edges: [
        { id: "e1", from: "n1", to: "n2" },
        { id: "e2", from: "n2", to: "n3" },
      ],
    },
  },
];
