import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg0: "#080B0F",
  bg1: "#0D1117",
  bg2: "#131920",
  bg3: "#1A2332",
  bg4: "#1E2A3A",
  border: "#1F2D40",
  borderHi: "#2A3F58",
  text0: "#E8F4FF",
  text1: "#9AB5CC",
  text2: "#5A7A94",
  text3: "#3A5A74",
  accent: "#0EA5E9",
  accentDim: "#0C4A6E",
  green: "#22C55E",
  greenDim: "#14532D",
  red: "#EF4444",
  redDim: "#7F1D1D",
  orange: "#F97316",
  orangeDim: "#7C2D12",
  purple: "#A855F7",
  purpleDim: "#3B0764",
  gold: "#EAB308",
  goldDim: "#713F12",
};

// ─── ICONS (inline SVG) ────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const paths = {
    dashboard: "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 3h2v2h-2zm0-3h2v2h-2zm3 0h2v2h-2zm0 3h2v2h-2z",
    build: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
    governance: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    agents: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 4a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    policy: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    hitl: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    logs: "M4 6h16M4 12h16M4 18h7",
    settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    plus: "M12 5v14M5 12h14",
    play: "M5 3l14 9-14 9V3z",
    folder: "M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z",
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18M6 6l12 12",
    refresh: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15",
    terminal: "M4 17l6-6-6-6m8 14h8",
    git: "M6 3a3 3 0 110 6 3 3 0 010-6zm12 12a3 3 0 110 6 3 3 0 010-6zm-12 0a3 3 0 110 6 3 3 0 010-6zm12-12a3 3 0 110 6 3 3 0 010-6zM6 9v6M18 9v2a4 4 0 01-4 4h-4a4 4 0 01-4-4V9",
    giu: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.86 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z",
    chevronRight: "M9 18l6-6-6-6",
    chevronDown: "M6 9l6 6 6-6",
    circle: "M12 2a10 10 0 100 20A10 10 0 0012 2z",
    warning: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
    info: "M12 2a10 10 0 100 20A10 10 0 0012 2zM12 16v-4M12 8h.01",
    cpu: "M9 3H5a2 2 0 00-2 2v4m6-6h6M9 3v18m6-18v18m0-18h4a2 2 0 012 2v4m-6-6v18M3 9h18M3 15h18",
    network: "M8.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM15.5 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM12 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8.5 9v4M15.5 9v4M8.5 13l3.5 3M15.5 13l-3.5 3",
    upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name] || paths.circle} />
    </svg>
  );
};

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK = {
  user: { name: "James K.", authority: "Builder L3", giuBalance: 14820.5 },
  health: "green",
  modules: [
    { id: "mod-001", name: "KYC Compliance Engine", version: "2.4.1", type: "Compliance", status: "active", giuCost: 420, lastBurn: "2m ago" },
    { id: "mod-002", name: "Risk Scoring Agent", version: "1.2.0", type: "Agent", status: "pending", giuCost: 310, lastBurn: "8m ago" },
    { id: "mod-003", name: "AML Governance Pack", version: "3.0.0", type: "Governance", status: "active", giuCost: 870, lastBurn: "1h ago" },
    { id: "mod-004", name: "Data Transform Workflow", version: "1.0.2", type: "Workflow", status: "error", giuCost: 120, lastBurn: "15m ago" },
  ],
  envelopeSteps: [
    { id: "s1", name: "Authority Gate", status: "complete", icon: "governance", detail: "L3 Builder authority verified. GIU reserve sufficient." },
    { id: "s2", name: "Proposal Template", status: "complete", icon: "policy", detail: "Template BL-PROP-v3 applied. Schema validated." },
    { id: "s3", name: "Regulus Orchestration", status: "active", icon: "cpu", detail: "Orchestrating pipeline. 3/7 steps complete." },
    { id: "s4", name: "Creation Council", status: "pending", icon: "agents", detail: "Awaiting 3 of 5 council votes." },
    { id: "s5", name: "Red Team Alpha", status: "pending", icon: "warning", detail: "Adversarial review not started." },
    { id: "s6", name: "Guardian Council", status: "pending", icon: "agents", detail: "Pending Red Team A clearance." },
    { id: "s7", name: "Red Team Beta", status: "pending", icon: "warning", detail: "Deep adversarial pass queued." },
    { id: "s8", name: "Human Sovereign Gate", status: "pending", icon: "hitl", detail: "HITL approval required. Assignee: J.Mercer" },
    { id: "s9", name: "Mechanical Compiler", status: "pending", icon: "build", detail: "Deterministic compilation pending." },
    { id: "s10", name: "Code Reviewer", status: "pending", icon: "policy", detail: "Automated + manual review pending." },
    { id: "s11", name: "Final Output", status: "pending", icon: "check", detail: "Awaiting all gates." },
  ],
  substrateChecks: [
    { label: "Determinism Check", status: "pass" },
    { label: "Replayability Check", status: "pass" },
    { label: "Safety Check", status: "warn" },
    { label: "Schema Integrity", status: "pass" },
    { label: "GIU Reserve", status: "pass" },
  ],
};

const LOG_SOURCES = ["Regulus", "Council", "RedTeam", "Compiler", "Reviewer", "Substrate"];
const LOG_LEVELS = ["INFO", "WARN", "ERROR", "GOVERNANCE", "HITL"];
const LOG_MESSAGES = [
  ["INFO", "Regulus", "Pipeline stage 3/7 complete — Transform node validated"],
  ["GOVERNANCE", "Council", "Creation Council vote cast (2/5) — Member: agent-4a2f"],
  ["INFO", "Substrate", "BaseLayerOS heartbeat OK — latency 12ms"],
  ["WARN", "RedTeam", "Red Team Alpha flagged potential schema ambiguity in node #7"],
  ["INFO", "Regulus", "Deterministic hash computed: 0xA3F2...9C01"],
  ["ERROR", "Compiler", "Compile failed: missing dependency in compliance module"],
  ["GOVERNANCE", "Council", "Guardian Council quorum check — 4/5 present"],
  ["HITL", "Reviewer", "HITL gate opened — awaiting J.Mercer approval"],
  ["INFO", "Substrate", "Replay buffer flush complete — 847 events archived"],
  ["INFO", "Regulus", "Agent mod-002 heartbeat received"],
  ["WARN", "Substrate", "Safety check flagged: elevated entropy in input stream"],
  ["GOVERNANCE", "RedTeam", "Red Team Beta scheduled — T+4h"],
];

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────
const Badge = ({ label, color = T.accent, bg }) => (
  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", padding: "2px 7px", borderRadius: 4, color, background: bg || `${color}18`, border: `1px solid ${color}30`, fontFamily: "monospace", textTransform: "uppercase" }}>
    {label}
  </span>
);

const Dot = ({ color = T.green, pulse = false }) => (
  <span style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", width: 10, height: 10 }}>
    {pulse && <span style={{ position: "absolute", width: 10, height: 10, borderRadius: "50%", background: color, opacity: 0.3, animation: "ping 1.5s infinite" }} />}
    <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
  </span>
);

const Btn = ({ children, onClick, variant = "primary", small, disabled, icon }) => {
  const styles = {
    primary: { background: T.accent, color: "#fff", border: `1px solid ${T.accent}` },
    secondary: { background: T.bg3, color: T.text1, border: `1px solid ${T.border}` },
    ghost: { background: "transparent", color: T.text1, border: `1px solid ${T.border}` },
    danger: { background: T.redDim, color: T.red, border: `1px solid ${T.red}40` },
    success: { background: T.greenDim, color: T.green, border: `1px solid ${T.green}40` },
    gold: { background: T.goldDim, color: T.gold, border: `1px solid ${T.gold}40` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...styles[variant], display: "inline-flex", alignItems: "center", gap: 6, padding: small ? "5px 10px" : "7px 14px", borderRadius: 6, fontSize: small ? 11 : 12, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap", transition: "all 0.15s", letterSpacing: "0.02em" }}>
      {icon && <Icon name={icon} size={12} />}
      {children}
    </button>
  );
};

const Card = ({ children, style = {}, title, badge, action }) => (
  <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", ...style }}>
    {(title || action) && (
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: T.text1, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>{title}</span>
          {badge && badge}
        </div>
        {action && action}
      </div>
    )}
    {children}
  </div>
);

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "build", label: "Build Modules", icon: "build" },
  { id: "governance", label: "Governance", icon: "governance" },
  { id: "agents", label: "Councils & Agents", icon: "agents" },
  { id: "policy", label: "Policy Bindings", icon: "policy" },
  { id: "hitl", label: "HITL Approvals", icon: "hitl" },
  { id: "logs", label: "Substrate Logs", icon: "logs" },
  { id: "settings", label: "Settings", icon: "settings" },
];

// ─── GRAPH NODE EDITOR ─────────────────────────────────────────────────────────
const NODE_TYPES = {
  Input: { color: T.green, x: 60, y: 100 },
  Transform: { color: T.accent, x: 200, y: 60 },
  Validate: { color: T.orange, x: 200, y: 160 },
  Route: { color: T.purple, x: 340, y: 100 },
  Compile: { color: T.gold, x: 460, y: 60 },
  Output: { color: T.green, x: 460, y: 160 },
};
const EDGES = [["Input","Transform"],["Input","Validate"],["Transform","Route"],["Validate","Route"],["Route","Compile"],["Route","Output"]];

const GraphEditor = ({ onNodeClick }) => {
  const [nodes, setNodes] = useState(() =>
    Object.entries(NODE_TYPES).map(([name, d]) => ({ id: name, ...d }))
  );
  const [dragging, setDragging] = useState(null);
  const [selected, setSelected] = useState(null);
  const svgRef = useRef(null);
  const W = 560, H = 260;

  const getNodeById = (id) => nodes.find(n => n.id === id);

  const handleMouseDown = (e, id) => {
    e.stopPropagation();
    setSelected(id);
    const svg = svgRef.current.getBoundingClientRect();
    setDragging({ id, ox: e.clientX - getNodeById(id).x, oy: e.clientY - getNodeById(id).y, svgX: svg.left, svgY: svg.top });
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;
    const nx = Math.max(30, Math.min(W - 30, e.clientX - dragging.ox));
    const ny = Math.max(20, Math.min(H - 20, e.clientY - dragging.oy));
    setNodes(ns => ns.map(n => n.id === dragging.id ? { ...n, x: nx, y: ny } : n));
  }, [dragging]);

  const handleMouseUp = () => setDragging(null);

  return (
    <div style={{ position: "relative", userSelect: "none" }}>
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${W} ${H}`} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
        style={{ background: "transparent", display: "block" }}>
        <defs>
          <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={T.text3} />
          </marker>
        </defs>
        {EDGES.map(([a, b], i) => {
          const A = getNodeById(a), B = getNodeById(b);
          if (!A || !B) return null;
          const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
          return <path key={i} d={`M${A.x},${A.y} C${mx},${A.y} ${mx},${B.y} ${B.x},${B.y}`}
            stroke={T.border} strokeWidth="1.5" fill="none" markerEnd="url(#arr)" />;
        })}
        {nodes.map(n => (
          <g key={n.id} onMouseDown={e => handleMouseDown(e, n.id)}
            onContextMenu={e => { e.preventDefault(); onNodeClick(n); }}
            style={{ cursor: "grab" }}>
            <rect x={n.x - 38} y={n.y - 14} width={76} height={28} rx={6}
              fill={selected === n.id ? `${n.color}22` : `${T.bg3}`}
              stroke={selected === n.id ? n.color : T.borderHi} strokeWidth={selected === n.id ? 1.5 : 1} />
            <circle cx={n.x - 26} cy={n.y} r={4} fill={n.color} />
            <text x={n.x - 16} y={n.y + 4} fontSize="10" fill={T.text0} fontFamily="'IBM Plex Mono', monospace" fontWeight="600">{n.id}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function BuilderDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [selectedStep, setSelectedStep] = useState(null);
  const [selectedModule, setSelectedModule] = useState(MOCK.modules[0]);
  const [logs, setLogs] = useState([]);
  const [logFilter, setLogFilter] = useState("ALL");
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [giuBalance, setGiuBalance] = useState(MOCK.user.giuBalance);
  const [moduleName, setModuleName] = useState("");
  const [moduleVersion, setModuleVersion] = useState("1.0.0");
  const [moduleType, setModuleType] = useState("Compliance");
  const [nodeInspector, setNodeInspector] = useState(null);
  const [notification, setNotification] = useState(null);
  const logRef = useRef(null);
  const [tick, setTick] = useState(0);

  // Simulated live log stream
  useEffect(() => {
    const interval = setInterval(() => {
      const msg = LOG_MESSAGES[Math.floor(Math.random() * LOG_MESSAGES.length)];
      const ts = new Date().toLocaleTimeString("en-US", { hour12: false });
      setLogs(prev => [...prev.slice(-199), { id: Date.now(), level: msg[0], source: msg[1], msg: msg[2], ts }]);
      setTick(t => t + 1);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  // GIU trickle simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setGiuBalance(b => parseFloat((b - (Math.random() * 0.8)).toFixed(2)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const notify = (msg, type = "info") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const levelColor = (lvl) => ({ INFO: T.text1, WARN: T.orange, ERROR: T.red, GOVERNANCE: T.purple, HITL: T.gold }[lvl] || T.text2);

  const filteredLogs = logFilter === "ALL" ? logs : logs.filter(l => l.level === logFilter);

  const statusColor = { complete: T.green, active: T.accent, pending: T.text3, error: T.red };
  const statusBg = { complete: T.greenDim, active: T.accentDim, pending: T.bg3, error: T.redDim };

  const checkColor = { pass: T.green, warn: T.orange, fail: T.red };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: T.bg0, color: T.text0, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: ${T.bg1}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        input, select { outline: none; }
        @keyframes ping { 0%,100% { transform:scale(1); opacity:0.3; } 50% { transform:scale(2.2); opacity:0; } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes slideIn { from { transform:translateY(-8px); opacity:0; } to { transform:translateY(0); opacity:1; } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        .nav-item:hover { background: ${T.bg3} !important; color: ${T.text0} !important; }
        .log-row:hover { background: ${T.bg3} !important; }
        .step-row:hover { background: ${T.bg3} !important; cursor:pointer; }
        .mod-row:hover { background: ${T.bg3} !important; cursor:pointer; }
        .btn-hover:hover { filter: brightness(1.15); }
      `}</style>

      {/* ── TOP STATUS BAR ── */}
      <div style={{ height: 48, background: T.bg1, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", padding: "0 16px", gap: 16, flexShrink: 0, zIndex: 100 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
          <div style={{ width: 26, height: 26, background: `linear-gradient(135deg, ${T.accent}, ${T.purple})`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="cpu" size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 13, color: T.text0, letterSpacing: "0.04em" }}>BaseLayerOS</span>
          <span style={{ fontSize: 10, color: T.text3, letterSpacing: "0.06em" }}>BUILDER</span>
        </div>

        <div style={{ width: 1, height: 24, background: T.border }} />

        {/* System Health */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Dot color={T.green} pulse />
          <span style={{ fontSize: 11, color: T.text1 }}>System Healthy</span>
        </div>

        <div style={{ width: 1, height: 24, background: T.border }} />

        {/* Substrate */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="network" size={13} color={T.accent} />
          <span style={{ fontSize: 11, color: T.text2 }}>Substrate:</span>
          <span style={{ fontSize: 11, color: T.text0, fontWeight: 600 }}>BaseLayerOS v4.2</span>
          <Dot color={T.green} />
        </div>

        <div style={{ flex: 1 }} />

        {/* GIU Balance */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.goldDim, border: `1px solid ${T.gold}40`, borderRadius: 6, padding: "4px 10px" }}>
          <Icon name="giu" size={13} color={T.gold} />
          <span style={{ fontSize: 11, color: T.gold, fontWeight: 700 }}>{giuBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} GIU</span>
        </div>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 26, height: 26, background: `linear-gradient(135deg, ${T.accent}60, ${T.purple}60)`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: T.text0 }}>
            {MOCK.user.name.split(" ").map(w => w[0]).join("")}
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: 11, color: T.text0, fontWeight: 600 }}>{MOCK.user.name}</div>
            <div style={{ fontSize: 10, color: T.accent }}>{MOCK.user.authority}</div>
          </div>
        </div>

        <div style={{ width: 1, height: 24, background: T.border }} />

        {/* Quick Actions */}
        <div style={{ display: "flex", gap: 6 }}>
          <Btn small icon="plus" onClick={() => notify("New Module dialog opened", "info")}>New Module</Btn>
          <Btn small variant="ghost" icon="play" onClick={() => notify("Running validation suite…", "info")}>Run Validation</Btn>
          <Btn small variant="ghost" icon="folder" onClick={() => notify("Opening governance envelope…", "info")}>Open Envelope</Btn>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── LEFT NAV ── */}
        <div style={{ width: 200, background: T.bg1, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", padding: "12px 0", flexShrink: 0 }}>
          {NAV.map(item => (
            <button key={item.id} className="nav-item" onClick={() => setActiveNav(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 16px", background: activeNav === item.id ? T.bg3 : "transparent", color: activeNav === item.id ? T.text0 : T.text2, border: "none", cursor: "pointer", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", fontWeight: activeNav === item.id ? 600 : 400, transition: "all 0.12s", borderLeft: activeNav === item.id ? `2px solid ${T.accent}` : "2px solid transparent", letterSpacing: "0.02em", textAlign: "left" }}>
              <Icon name={item.icon} size={14} color={activeNav === item.id ? T.accent : T.text3} />
              {item.label}
            </button>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${T.border}` }}>
            <div style={{ fontSize: 10, color: T.text3, marginBottom: 6 }}>REGULUS ENGINE</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Dot color={T.accent} pulse />
              <span style={{ fontSize: 10, color: T.text2 }}>Orchestrating</span>
            </div>
            <div style={{ fontSize: 10, color: T.text3, marginTop: 4 }}>Envelope #KSE-4412</div>
          </div>
        </div>

        {/* ── WORKSPACE ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Main panels */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "340px 1fr", gridTemplateRows: "1fr 1fr", gap: 1, background: T.border, overflow: "hidden" }}>

            {/* ─ Panel 1: Builder Tools ─ */}
            <div style={{ background: T.bg0, padding: 14, overflow: "auto" }}>
              <Card title="Builder Tools" badge={<Badge label="Regulus" color={T.accent} />}
                action={<Btn small variant="ghost" icon="refresh" onClick={() => notify("Synced with Regulus", "info")}>Sync</Btn>}>
                <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* Module type */}
                  <div>
                    <label style={{ fontSize: 10, color: T.text2, display: "block", marginBottom: 4, letterSpacing: "0.06em" }}>MODULE TYPE</label>
                    <select value={moduleType} onChange={e => setModuleType(e.target.value)}
                      style={{ width: "100%", background: T.bg3, border: `1px solid ${T.border}`, color: T.text0, borderRadius: 6, padding: "7px 10px", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                      {["Compliance","Governance","Agent","Workflow","Transform"].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  {/* Name & version */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8 }}>
                    <div>
                      <label style={{ fontSize: 10, color: T.text2, display: "block", marginBottom: 4, letterSpacing: "0.06em" }}>MODULE NAME</label>
                      <input value={moduleName} onChange={e => setModuleName(e.target.value)} placeholder="e.g. KYC Engine v2"
                        style={{ width: "100%", background: T.bg3, border: `1px solid ${T.border}`, color: T.text0, borderRadius: 6, padding: "7px 10px", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: T.text2, display: "block", marginBottom: 4, letterSpacing: "0.06em" }}>VERSION</label>
                      <input value={moduleVersion} onChange={e => setModuleVersion(e.target.value)}
                        style={{ width: 80, background: T.bg3, border: `1px solid ${T.border}`, color: T.text0, borderRadius: 6, padding: "7px 10px", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }} />
                    </div>
                  </div>
                  {/* Action buttons */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    <Btn small icon="build" onClick={() => notify("Creating Workflow module…")}>Create Workflow</Btn>
                    <Btn small variant="secondary" icon="governance" onClick={() => notify("Creating Governance Pack…")}>Gov Pack</Btn>
                    <Btn small variant="secondary" icon="policy" onClick={() => notify("Creating Compliance Module…")}>Compliance Mod</Btn>
                    <Btn small variant="secondary" icon="agents" onClick={() => notify("Creating Agent Module…")}>Agent Module</Btn>
                  </div>
                  <Btn icon="terminal" onClick={() => notify("Opening in Regulus IDE…")} style={{ width: "100%" }}>Open in Regulus</Btn>
                </div>
              </Card>

              {/* GIU Packs */}
              <Card title="GIU Packs & Resources" style={{ marginTop: 10 }}
                badge={<Badge label={`${giuBalance.toFixed(0)} GIU`} color={T.gold} />}>
                <div style={{ padding: 14 }}>
                  <div style={{ background: `linear-gradient(135deg, ${T.goldDim}, ${T.bg3})`, borderRadius: 8, padding: "12px 14px", marginBottom: 12, border: `1px solid ${T.gold}30` }}>
                    <div style={{ fontSize: 10, color: T.gold, marginBottom: 4 }}>AVAILABLE BALANCE</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: T.text0 }}>{giuBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                    <div style={{ fontSize: 10, color: T.gold }}>GIU tokens</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    <Btn small variant="gold" icon="plus" onClick={() => notify("Opening GIU purchase portal…")}>Purchase GIUs</Btn>
                    <Btn small variant="ghost" icon="giu" onClick={() => notify("Allocate GIUs to module…")}>Allocate</Btn>
                  </div>
                  <div style={{ fontSize: 10, color: T.text3, marginBottom: 6, letterSpacing: "0.06em" }}>GIU USAGE</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                    <thead>
                      <tr>{["Module","Cost","Last Burn","Status"].map(h => <th key={h} style={{ padding: "4px 6px", textAlign: "left", color: T.text3, fontWeight: 600, borderBottom: `1px solid ${T.border}` }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {MOCK.modules.map(m => (
                        <tr key={m.id} className="mod-row" onClick={() => setSelectedModule(m)} style={{ background: selectedModule?.id === m.id ? T.bg3 : "transparent" }}>
                          <td style={{ padding: "5px 6px", color: T.text0, maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.name.split(" ")[0]}</td>
                          <td style={{ padding: "5px 6px", color: T.gold }}>{m.giuCost}</td>
                          <td style={{ padding: "5px 6px", color: T.text2 }}>{m.lastBurn}</td>
                          <td style={{ padding: "5px 6px" }}><Dot color={m.status === "active" ? T.green : m.status === "error" ? T.red : T.orange} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* ─ Panel 2: Marketplace + Code Graph ─ */}
            <div style={{ background: T.bg0, overflow: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
              {/* Marketplace/Module Renderer */}
              <div style={{ padding: 14, flex: "0 0 auto" }}>
                <Card title="Module Renderer" badge={<Badge label={selectedModule?.type || "—"} color={T.purple} />}
                  action={<div style={{ display: "flex", gap: 6 }}>
                    <Btn small variant="success" icon="upload" onClick={() => notify(`Publishing ${selectedModule?.name}…`)}>Publish</Btn>
                    <Btn small variant="ghost" icon="play" onClick={() => notify("Running validation suite…")}>Validate</Btn>
                  </div>}>
                  <div style={{ padding: 14 }}>
                    {selectedModule ? (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                        <div style={{ background: T.bg3, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
                          <div style={{ fontSize: 10, color: T.text3, marginBottom: 6 }}>METADATA</div>
                          <div style={{ fontSize: 12, color: T.text0, fontWeight: 600, marginBottom: 4 }}>{selectedModule.name}</div>
                          <div style={{ fontSize: 10, color: T.text2 }}>v{selectedModule.version}</div>
                          <div style={{ marginTop: 6 }}><Badge label={selectedModule.status} color={selectedModule.status === "active" ? T.green : selectedModule.status === "error" ? T.red : T.orange} /></div>
                        </div>
                        <div style={{ background: T.bg3, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
                          <div style={{ fontSize: 10, color: T.text3, marginBottom: 6 }}>SCHEMA</div>
                          <div style={{ fontSize: 10, color: T.accent, lineHeight: 1.6 }}>
                            {`{\n  id: "${selectedModule.id}",\n  type: "${selectedModule.type}",\n  ver: "${selectedModule.version}"\n}`}
                          </div>
                        </div>
                        <div style={{ background: T.bg3, borderRadius: 8, padding: 12, border: `1px solid ${T.border}` }}>
                          <div style={{ fontSize: 10, color: T.text3, marginBottom: 6 }}>CAPABILITIES</div>
                          {["validate","compile","orchestrate","replay"].map(c => (
                            <div key={c} style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                              <Icon name="check" size={10} color={T.green} /><span style={{ fontSize: 10, color: T.text1 }}>{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : <span style={{ color: T.text3, fontSize: 11 }}>Select a module from GIU table</span>}
                  </div>
                </Card>
              </div>

              {/* Code Graph */}
              <div style={{ padding: "0 14px 14px", flex: 1 }}>
                <Card title="Code Graph — Node Editor"
                  badge={<Badge label="Drag nodes · Right-click inspect" color={T.text3} />}
                  action={<Btn small icon="git" onClick={() => notify("Generating deterministic graph hash…")}>Gen Deterministic Graph</Btn>}>
                  <div style={{ padding: 14 }}>
                    <GraphEditor onNodeClick={n => setNodeInspector(n)} />
                    <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                      {Object.entries(NODE_TYPES).map(([name, d]) => (
                        <div key={name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 10, color: T.text2 }}>{name}</span>
                        </div>
                      ))}
                    </div>
                    {nodeInspector && (
                      <div style={{ marginTop: 10, background: T.bg3, border: `1px solid ${T.borderHi}`, borderRadius: 8, padding: 12, animation: "fadeIn 0.2s" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: T.text0 }}>Node Inspector: {nodeInspector.id}</span>
                          <button onClick={() => setNodeInspector(null)} style={{ background: "none", border: "none", color: T.text3, cursor: "pointer" }}><Icon name="x" size={12} /></button>
                        </div>
                        <div style={{ fontSize: 11, color: T.text2, lineHeight: 1.7 }}>
                          <div>Type: <span style={{ color: nodeInspector.color }}>{nodeInspector.id}</span></div>
                          <div>Position: ({Math.round(nodeInspector.x)}, {Math.round(nodeInspector.y)})</div>
                          <div>Status: <Badge label="Active" color={T.green} /></div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            {/* ─ Panel 3: Governance Envelope ─ */}
            <div style={{ background: T.bg0, padding: 14, overflow: "auto" }}>
              <Card title="Governance Envelope" badge={<Badge label="KSE-4412" color={T.purple} />}
                action={<Badge label="Active" color={T.green} />}>
                <div style={{ padding: "8px 14px 14px" }}>
                  <div style={{ fontSize: 10, color: T.text3, marginBottom: 10 }}>KALI STANDARD GOVERNANCE ENVELOPE · Click step for details</div>
                  <div style={{ position: "relative" }}>
                    {/* Vertical line */}
                    <div style={{ position: "absolute", left: 11, top: 12, bottom: 12, width: 1, background: T.border }} />
                    {MOCK.envelopeSteps.map((step, i) => (
                      <div key={step.id} className="step-row" onClick={() => setSelectedStep(selectedStep?.id === step.id ? null : step)}
                        style={{ display: "flex", gap: 10, padding: "6px 8px", borderRadius: 6, marginBottom: 2, position: "relative", background: selectedStep?.id === step.id ? T.bg3 : "transparent", transition: "background 0.12s" }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: statusBg[step.status], border: `1px solid ${statusColor[step.status]}60`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, zIndex: 1 }}>
                          {step.status === "complete" ? <Icon name="check" size={10} color={T.green} /> :
                           step.status === "active" ? <Dot color={T.accent} pulse /> :
                           step.status === "error" ? <Icon name="x" size={10} color={T.red} /> :
                           <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.text3 }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 600, color: step.status === "pending" ? T.text2 : T.text0 }}>{step.name}</div>
                          {selectedStep?.id === step.id && (
                            <div style={{ fontSize: 10, color: T.text2, marginTop: 4, lineHeight: 1.5, animation: "slideIn 0.15s" }}>{step.detail}</div>
                          )}
                        </div>
                        <Badge label={step.status} color={statusColor[step.status]} />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* ─ Panel 4: Substrate API Connector ─ */}
            <div style={{ background: T.bg0, padding: 14, overflow: "auto" }}>
              <Card title="Substrate API Connector"
                badge={<Badge label="LIVE" color={T.green} />}
                action={<Dot color={T.green} pulse />}>
                <div style={{ padding: 14 }}>
                  {/* Connection info */}
                  <div style={{ background: T.bg3, border: `1px solid ${T.border}`, borderRadius: 8, padding: 12, marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, lineHeight: 1.8 }}>
                    <div style={{ color: T.text3 }}>ENDPOINT</div>
                    <div style={{ color: T.accent }}>wss://substrate.baselayeros.io/v4</div>
                    <div style={{ color: T.text3, marginTop: 4 }}>AUTH</div>
                    <div style={{ color: T.text1 }}>Bearer ••••••••••••9f3a</div>
                    <div style={{ color: T.text3, marginTop: 4 }}>LATENCY</div>
                    <div style={{ color: T.green }}>{8 + (tick % 12)}ms</div>
                  </div>

                  {/* System checks */}
                  <div style={{ fontSize: 10, color: T.text3, marginBottom: 8, letterSpacing: "0.06em" }}>SUBSTRATE CHECKS</div>
                  {MOCK.substrateChecks.map(c => (
                    <div key={c.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", background: T.bg3, borderRadius: 6, marginBottom: 4, border: `1px solid ${T.border}` }}>
                      <span style={{ fontSize: 11, color: T.text1 }}>{c.label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Dot color={checkColor[c.status]} />
                        <Badge label={c.status.toUpperCase()} color={checkColor[c.status]} />
                      </div>
                    </div>
                  ))}

                  <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                    <Btn small icon="logs" onClick={() => notify("Opening substrate logs…")}>Substrate Logs</Btn>
                    <Btn small variant="ghost" icon="refresh" onClick={() => notify("Replaying governance envelope…")}>Replay Envelope</Btn>
                  </div>

                  {/* Module list */}
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 10, color: T.text3, marginBottom: 8, letterSpacing: "0.06em" }}>REGISTERED MODULES</div>
                    {MOCK.modules.map(m => (
                      <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
                        <Dot color={m.status === "active" ? T.green : m.status === "error" ? T.red : T.orange} />
                        <span style={{ flex: 1, fontSize: 11, color: T.text0 }}>{m.name}</span>
                        <span style={{ fontSize: 10, color: T.text3 }}>v{m.version}</span>
                        <Badge label={m.type} color={T.text2} />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* ── BOTTOM CONSOLE ── */}
          <div style={{ borderTop: `1px solid ${T.border}`, background: T.bg1, flexShrink: 0, transition: "height 0.2s", height: consoleOpen ? 180 : 32, overflow: "hidden" }}>
            {/* Console header */}
            <div style={{ height: 32, display: "flex", alignItems: "center", padding: "0 14px", gap: 10, borderBottom: consoleOpen ? `1px solid ${T.border}` : "none" }}>
              <button onClick={() => setConsoleOpen(o => !o)} style={{ background: "none", border: "none", color: T.text2, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name={consoleOpen ? "chevronDown" : "chevronRight"} size={12} />
                <span style={{ fontSize: 11, fontWeight: 600, color: T.text1 }}>EVENT STREAM</span>
              </button>
              <Dot color={T.accent} pulse />
              <span style={{ fontSize: 10, color: T.text3 }}>{logs.length} events</span>
              <div style={{ flex: 1 }} />
              {/* Filters */}
              {["ALL","INFO","WARN","ERROR","GOVERNANCE","HITL"].map(f => (
                <button key={f} onClick={() => setLogFilter(f)}
                  style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, border: `1px solid ${logFilter === f ? T.accent : T.border}`, background: logFilter === f ? T.accentDim : "transparent", color: logFilter === f ? T.accent : T.text3, cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace" }}>
                  {f}
                </button>
              ))}
            </div>
            {/* Log lines */}
            {consoleOpen && (
              <div ref={logRef} style={{ height: 148, overflowY: "auto", padding: "6px 14px" }}>
                {filteredLogs.length === 0 ? (
                  <div style={{ fontSize: 11, color: T.text3, padding: "10px 0" }}>Waiting for events…</div>
                ) : filteredLogs.map(l => (
                  <div key={l.id} className="log-row" style={{ display: "flex", gap: 10, padding: "2px 4px", borderRadius: 3, alignItems: "baseline" }}>
                    <span style={{ fontSize: 10, color: T.text3, flexShrink: 0, width: 68 }}>{l.ts}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: levelColor(l.level), width: 74, flexShrink: 0 }}>{l.level}</span>
                    <span style={{ fontSize: 10, color: T.accent, width: 72, flexShrink: 0 }}>[{l.source}]</span>
                    <span style={{ fontSize: 11, color: T.text1 }}>{l.msg}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── NOTIFICATION TOAST ── */}
      {notification && (
        <div style={{ position: "fixed", bottom: 24, right: 24, background: T.bg2, border: `1px solid ${T.borderHi}`, borderRadius: 8, padding: "10px 16px", fontSize: 12, color: T.text0, display: "flex", alignItems: "center", gap: 8, animation: "slideIn 0.2s", zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <Dot color={notification.type === "error" ? T.red : T.green} />
          {notification.msg}
        </div>
      )}

      {/* ── BACKEND INTEGRATION GUIDE (collapsible) ── */}
    </div>
  );
}
