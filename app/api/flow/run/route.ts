import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
// node executions can take a few seconds; give them room
export const maxDuration = 60;

const MODEL = "claude-opus-4-8";

const SYSTEM = `You are a single node inside an automated AI workflow called nodeheus Flow.
Apply the user's instruction to the provided input and return ONLY the resulting content.
No preamble, no sign-off, no explanation of what you did. Do not wrap the answer in code
fences unless the instruction explicitly asks for code or JSON.`;

interface RunBody {
  kind: "prompt" | "tool";
  toolKind?: "fetch";
  instruction?: string;
  value?: string;
  input?: string;
}

export async function POST(req: Request) {
  let body: RunBody;
  try {
    body = (await req.json()) as RunBody;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  try {
    if (body.kind === "tool") return await runTool(body);
    if (body.kind === "prompt") return await runPrompt(body);
    return Response.json({ error: "Unknown node kind." }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error.";
    return Response.json({ error: message });
  }
}

async function runPrompt(body: RunBody) {
  const instruction = (body.instruction ?? "").trim();
  const input = (body.input ?? "").trim();
  if (!instruction) {
    return Response.json({ error: "This prompt node has no instruction." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({
      output: simulate(instruction, input),
      mode: "simulated",
    });
  }

  const client = new Anthropic({ apiKey });
  const userContent = `Instruction:\n${instruction}\n\nInput:\n${
    input || "(no input was passed into this node)"
  }`;

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 2048,
    system: SYSTEM,
    messages: [{ role: "user", content: userContent }],
  });

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("")
    .trim();

  return Response.json({ output: text, mode: "live" });
}

async function runTool(body: RunBody) {
  // The tool node fetches a URL. Prefer the node's configured URL; otherwise
  // try to pull a URL out of whatever was piped in.
  const configured = (body.value ?? "").trim();
  const piped = (body.input ?? "").trim();
  let url = configured;
  if (!/^https?:\/\//i.test(url)) {
    const match = (configured || piped).match(/https?:\/\/[^\s"'<>]+/i);
    url = match ? match[0] : "";
  }
  if (!url) {
    return Response.json({
      error: "No URL to fetch — set one in the tool node.",
    });
  }

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { "user-agent": "nodeheus-flow/0.1 (+https://nodeheus.com)" },
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    return Response.json({ error: `Could not reach ${url}.` });
  }
  if (!res.ok) {
    return Response.json({ error: `Fetch failed (${res.status}) for ${url}.` });
  }

  const html = await res.text();
  const text = htmlToText(html).slice(0, 6000);
  return Response.json({
    output: text || "(no readable text found at that URL)",
  });
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Offline fallback so the canvas still "runs" with no API key configured.
 * Clearly tagged as simulated so it's never mistaken for real model output.
 */
function simulate(instruction: string, input: string): string {
  const lower = instruction.toLowerCase();
  const snippet = input.replace(/\s+/g, " ").trim().slice(0, 90);
  const tag = "\n\n— simulated (set ANTHROPIC_API_KEY for live output)";

  if (lower.includes("json") || lower.includes("extract")) {
    return (
      JSON.stringify(
        {
          status: "ok",
          fields_detected: 4,
          preview: snippet || null,
          note: "simulated extraction",
        },
        null,
        2
      ) + tag
    );
  }
  if (lower.includes("question")) {
    return (
      "1. What is the core mechanism at work here?\n" +
      "2. Who are the incumbents and what is the wedge?\n" +
      "3. What has to be true for this to scale?\n" +
      "4. Where does the cost curve bend?\n" +
      "5. What is the single biggest risk?" +
      tag
    );
  }
  if (lower.includes("summar") || lower.includes("brief") || lower.includes("memo")) {
    return (
      "• **Premise** — the source argues a clear, defensible thesis.\n" +
      "• **Evidence** — it cites concrete figures and named examples.\n" +
      "• **Tension** — one assumption carries most of the weight.\n" +
      "• **So what** — actionable if the key uncertainty resolves favorably." +
      tag
    );
  }
  return `Processed input${snippet ? ` ("${snippet}…")` : ""} per the instruction.${tag}`;
}
