import { motion } from "framer-motion";

type Status = "idle" | "loading" | "approved" | "blocked";

const CENTER = { x: 200, y: 120 };
const OUTER_NODES = [
  { x: 80, y: 45, label: "Hist-1" },
  { x: 320, y: 50, label: "Hist-2" },
  { x: 60, y: 170, label: "Hist-3" },
  { x: 340, y: 165, label: "Hist-4" },
  { x: 200, y: 215, label: "Hist-5" },
];

const CROSS_EDGES = [
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 4],
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

// Deterministic pseudo-random generator so each analysis yields a reproducible graph.
function seededRandom(seed: number) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function edgeColor(status: Status) {
  if (status === "approved") return "hsl(157,100%,50%)";
  if (status === "blocked") return "hsl(0,80%,60%)";
  return "hsl(232,12%,28%)";
}

function centerFill(status: Status) {
  if (status === "approved") return "hsl(157,100%,50%)";
  if (status === "blocked") return "hsl(0,80%,60%)";
  return "hsl(68,100%,50%)";
}

function glowFilter(status: Status) {
  const color = status === "blocked" ? "0,80%,60%" : status === "approved" ? "157,100%,50%" : "68,100%,50%";
  return `drop-shadow(0 0 8px hsla(${color},0.6))`;
}

type NetworkGraphProps = {
  status: Status;
  anomalyScore?: number;
  threshold?: number;
  signal?: number;
};

export default function NetworkGraph({ status, anomalyScore = 0, threshold = 1, signal = 0 }: NetworkGraphProps) {
  const isLoading = status === "loading";
  const resolved = status === "approved" || status === "blocked";
  const ratio = threshold > 0 ? clamp(anomalyScore / threshold, 0, 2) : 0;

  const baseSeed = Math.floor((anomalyScore + 1) * 10000) + Math.floor((threshold + 1) * 1000) + signal * 97;
  const rand = seededRandom(baseSeed);

  const nodes = OUTER_NODES.map((node) => {
    const jitterX = (rand() - 0.5) * 28;
    const jitterY = (rand() - 0.5) * 24;
    return {
      ...node,
      x: clamp(node.x + jitterX, 30, 370),
      y: clamp(node.y + jitterY, 25, 220),
    };
  });

  const edgeWeights = nodes.map(() => clamp(0.45 + rand() * 0.35 + (resolved ? ratio * 0.2 : 0), 0.35, 1));

  // Highlight strongest neighborhood edges when analysis is complete.
  const highlighted = edgeWeights
    .map((w, i) => ({ w, i }))
    .sort((a, b) => b.w - a.w)
    .slice(0, resolved ? (status === "blocked" ? 5 : 3) : 0)
    .map((item) => item.i);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h4 className="text-sm font-semibold text-foreground mb-3">Network Graph</h4>
      <div className="h-60 rounded-xl bg-muted/30 border border-border flex items-center justify-center relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 240">
          <defs>
            <linearGradient id="pulse-grad-green" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(157,100%,50%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(157,100%,50%)" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="pulse-grad-red" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(0,80%,60%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(0,80%,60%)" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Cross edges between outer nodes */}
          {CROSS_EDGES.map(([a, b], i) => (
            <motion.line
              key={`cross-${i}`}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke="hsl(232,12%,20%)"
              strokeWidth="0.5"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: isLoading ? [0.2, 0.5, 0.2] : 0.3 }}
              transition={isLoading ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : {}}
            />
          ))}

          {/* Main edges from center to outer */}
          {nodes.map((node, i) => (
            <motion.line
              key={`edge-${i}`}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={node.x}
              y2={node.y}
              stroke={edgeColor(status)}
              strokeWidth={resolved ? 1 + edgeWeights[i] * 2 : 1}
              initial={{ opacity: 0.4, pathLength: 0 }}
              animate={{
                opacity: isLoading ? [0.3, 1, 0.3] : resolved ? (highlighted.includes(i) ? 0.9 : 0.45) : 0.4,
                pathLength: 1,
              }}
              transition={
                isLoading
                  ? { opacity: { duration: 1, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }, pathLength: { duration: 0.5 } }
                  : { pathLength: { duration: 0.6 }, opacity: { duration: 0.4 } }
              }
              style={resolved ? { filter: glowFilter(status) } : undefined}
            />
          ))}

          {/* Outer nodes */}
          {nodes.map((node, i) => (
            <g key={`node-${i}`}>
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={6}
                fill="hsl(228,5%,40%)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: isLoading ? [0.5, 1, 0.5] : 1,
                }}
                transition={
                  isLoading
                    ? { opacity: { duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }, scale: { duration: 0.4, delay: i * 0.05 } }
                    : { scale: { duration: 0.4, delay: i * 0.05 } }
                }
              />
              <text
                x={node.x}
                y={node.y - 12}
                textAnchor="middle"
                fill="hsl(228,5%,45%)"
                fontSize="8"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                {node.label}
              </text>
            </g>
          ))}

          {/* Center glow ring */}
          <motion.circle
            cx={CENTER.x}
            cy={CENTER.y}
            r={18}
            fill="none"
            stroke={centerFill(status)}
            strokeWidth={1.5}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isLoading ? [0.15, 0.4, 0.15] : resolved ? [0.2, 0.45, 0.2] : 0.15,
              scale: isLoading ? [1, 1.3, 1] : resolved ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: `${CENTER.x}px ${CENTER.y}px` }}
          />

          {/* Center node */}
          <motion.circle
            cx={CENTER.x}
            cy={CENTER.y}
            r={12}
            fill={centerFill(status)}
            initial={{ scale: 0 }}
            animate={{ scale: 1, opacity: isLoading ? [0.6, 1, 0.6] : 1 }}
            transition={
              isLoading
                ? { opacity: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0.3, type: "spring" } }
                : { scale: { duration: 0.3, type: "spring" } }
            }
            style={resolved ? { filter: glowFilter(status) } : undefined}
          />

          {/* Center label */}
          <text
            x={CENTER.x}
            y={CENTER.y - 20}
            textAnchor="middle"
            fill="hsl(0,0%,75%)"
            fontSize="9"
            fontWeight="600"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            New Tx
          </text>
        </svg>

        <span className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-muted-foreground">
          {isLoading ? "Analyzing connections…" : resolved ? "Analysis complete" : "Mapping transaction network topology..."}
        </span>
      </div>
    </div>
  );
}
