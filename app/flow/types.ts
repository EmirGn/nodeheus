export type NodeKind = "input" | "prompt" | "tool" | "output";

export type NodeStatus = "idle" | "running" | "done" | "error";

export interface FlowNode {
  id: string;
  kind: NodeKind;
  title: string;
  x: number;
  y: number;
  /** input: literal text · prompt: the instruction · tool: a URL · output: unused */
  value: string;
  /** for tool nodes — only "fetch" is wired up in the MVP */
  toolKind?: "fetch";
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
}

export interface FlowGraph {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface NodeRuntime {
  status: NodeStatus;
  output: string;
}

/** geometry shared between the canvas and the edge layer */
export const NODE_W = 250;
/** vertical offset (from a node's top) of its input/output ports */
export const PORT_Y = 26;
