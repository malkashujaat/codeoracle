import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Network, Database, GitBranch, Info, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import PremiumBackground from '../PremiumBackground';
import FloatingParticles from '../FloatingParticles';

const C = { cyan: '#00f5ff', purple: '#9b59ff', orange: '#ff6b2b', green: '#00ff88', teal: '#00e5d4', red: '#ff3355' };

/* ── Real module names from CodeOracle ── */
const MODULES = ['Core', 'Factory', 'Builder', 'Adapter', 'Chain', 'Bridge', 'Composite', 'Repository'];

/* ── Dependency strength:
   0 = none, 1 = weak, 2 = uses, 3 = strong dependency ── */
const BASE_MATRIX = [
//             Core  Fact  Build Adapt Chain Bridge Comp  Repo
/* Core       */ [0,    3,    2,    3,    3,    0,    3,    0],
/* Factory    */ [0,    0,    0,    2,    0,    0,    0,    0],
/* Builder    */ [0,    0,    0,    0,    0,    0,    0,    0],
/* Adapter    */ [0,    0,    0,    0,    0,    0,    0,    0],
/* Chain      */ [0,    0,    0,    1,    0,    0,    0,    0],
/* Bridge     */ [3,    0,    0,    0,    0,    0,    0,    0],
/* Composite  */ [1,    0,    0,    0,    0,    0,    0,    0],
/* Repository */ [0,    0,    0,    1,    0,    0,    0,    0],
];

const STRENGTH_CONFIG = {
  0: { label: 'None',      color: 'transparent',       border: 'rgba(255,255,255,0.05)', text: 'rgba(255,255,255,0.1)',  bg: 'rgba(255,255,255,0.02)' },
  1: { label: 'Weak',      color: C.cyan,               border: `${C.cyan}30`,           text: `${C.cyan}70`,           bg: `${C.cyan}08` },
  2: { label: 'Uses',      color: C.purple,             border: `${C.purple}40`,         text: `${C.purple}90`,         bg: `${C.purple}12` },
  3: { label: 'Strong',    color: C.orange,             border: `${C.orange}50`,         text: C.orange,               bg: `${C.orange}18` },
};

const STRENGTH_LABELS = { 0: '—', 1: 'weak', 2: 'uses', 3: 'strong' };

/* ── Summary stats derived from matrix ── */
function getStats(matrix) {
  let total = 0, strong = 0, weak = 0;
  matrix.forEach(row => row.forEach(v => {
    if (v > 0) total++;
    if (v === 3) strong++;
    if (v === 1) weak++;
  }));
  return { total, strong, weak, coupling: ((total / (MODULES.length ** 2 - MODULES.length)) * 100).toFixed(0) };
}

export default function DataMatricesPage({ onBack }) {
  const [matrix,   setMatrix]   = useState(BASE_MATRIX);
  const [hovered,  setHovered]  = useState(null);   // { row, col }
  const [selected, setSelected] = useState(null);   // { row, col }
  const [analyzing, setAnalyzing] = useState(false);

  const stats = getStats(matrix);

  /* Highlight row/col on hover */
  const isRowHighlighted = (ri) => hovered && hovered.row === ri;
  const isColHighlighted = (ci) => hovered && hovered.col === ci;

  /* Selected cell info */
  const selInfo = selected ? {
    from:     MODULES[selected.row],
    to:       MODULES[selected.col],
    strength: matrix[selected.row][selected.col],
    label:    STRENGTH_LABELS[matrix[selected.row][selected.col]],
    color:    STRENGTH_CONFIG[matrix[selected.row][selected.col]].color,
  } : null;

  /* Simulate a re-analysis run */
  const runAnalysis = () => {
    setAnalyzing(true);
    setSelected(null);
    setTimeout(() => {
      /* Slightly vary coupling strengths to simulate live analysis */
      const next = BASE_MATRIX.map(row => row.map(v => {
        if (v === 0) return 0;
        const jitter = Math.random() > 0.8 ? (v > 1 ? v - 1 : v + 1) : v;
        return Math.min(3, Math.max(0, jitter));
      }));
      setMatrix(next);
      setAnalyzing(false);
    }, 1600);
  };

  return (
    <div className="relative min-h-screen bg-[#020308] text-white overflow-x-hidden flex flex-col items-center">
      <PremiumBackground />
      <FloatingParticles />

      {/* Back button */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-5xl flex items-center pt-8 px-6">
        <motion.button onClick={onBack}
          whileHover={{ scale: 1.07, x: -3, boxShadow: `0 0 24px ${C.purple}55`, borderColor: `${C.purple}80` }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm"
          style={{ background: `${C.purple}10`, border: `2px solid ${C.purple}35`, color: C.purple }}>
          <ArrowLeft size={17} strokeWidth={3} /> Back to Home
        </motion.button>
      </motion.div>

      <div className="relative z-10 w-full max-w-5xl px-6 pb-16 space-y-10 flex flex-col items-center">

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-center pt-10 pb-2">
          <p className="text-xs font-black uppercase tracking-[0.5em] mb-4 font-mono" style={{ color: `${C.purple}70` }}>
            Dependency Intelligence
          </p>
          <h1 className="font-black tracking-tight leading-none mb-5"
            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.4rem,5vw,3.8rem)',
              background: `linear-gradient(135deg,${C.purple} 0%,#cc44ff 50%,#4488ff 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            DATA MATRICES
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
            Instantly see <span style={{ color: C.purple, fontWeight: 700 }}>which modules depend on which</span> — identify
            coupling hotspots, circular risks, and architectural health at a glance. Click any cell for details.
          </p>
        </motion.div>

        {/* Benefit strip */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {[
            { icon: Network,     color: C.purple, label: 'Total Dependencies', value: stats.total },
            { icon: AlertCircle, color: C.orange,  label: 'Strong Couplings',  value: stats.strong },
            { icon: GitBranch,   color: C.cyan,   label: 'Weak References',    value: stats.weak },
            { icon: CheckCircle, color: C.green,  label: 'Coupling Score',     value: `${100 - stats.coupling}%`, sub: 'health' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.07 }}
              whileHover={{ y: -4, borderColor: s.color, boxShadow: `0 12px 40px -10px ${s.color}35` }}
              className="p-5 rounded-2xl text-center transition-all"
              style={{ background: `${s.color}07`, border: `1px solid ${s.color}22`, backdropFilter: 'blur(20px)' }}>
              <s.icon size={20} className="mx-auto mb-2" style={{ color: s.color }} />
              <p className="text-2xl font-black mb-0.5" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-white/35 font-mono uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main matrix */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="w-full rounded-[2rem] overflow-hidden"
          style={{ background: 'rgba(4,8,22,0.75)', border: `1px solid ${C.purple}18`, backdropFilter: 'blur(40px)' }}>

          {/* Card header */}
          <div className="px-8 py-5 border-b flex items-center justify-between"
            style={{ borderColor: `${C.purple}12` }}>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.45em] font-mono mb-0.5" style={{ color: `${C.purple}80` }}>
                Module Dependency Matrix
              </p>
              <p className="text-sm text-white/35">Row → depends on → Column. Darker = stronger coupling.</p>
            </div>
            {/* Legend */}
            <div className="hidden md:flex items-center gap-4">
              {[0,1,2,3].map(v => (
                <div key={v} className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded"
                    style={{ background: STRENGTH_CONFIG[v].bg, border: `1px solid ${STRENGTH_CONFIG[v].border}` }} />
                  <span className="text-xs font-mono capitalize" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {STRENGTH_CONFIG[v].label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 overflow-x-auto">
            {/* Column headers */}
            <div className="flex mb-1" style={{ marginLeft: '6.5rem' }}>
              {MODULES.map((mod, ci) => (
                <div key={ci} className="flex-1 min-w-[52px] text-center">
                  <motion.span
                    className="text-[10px] font-black uppercase tracking-widest font-mono transition-colors"
                    animate={{ color: isColHighlighted(ci) ? C.purple : 'rgba(255,255,255,0.25)' }}>
                    {mod}
                  </motion.span>
                </div>
              ))}
            </div>

            {/* Rows */}
            {MODULES.map((rowMod, ri) => (
              <div key={ri} className="flex items-center mb-1">
                {/* Row label */}
                <div className="w-24 flex-shrink-0 pr-3 text-right">
                  <motion.span
                    className="text-[10px] font-black uppercase tracking-widest font-mono transition-colors"
                    animate={{ color: isRowHighlighted(ri) ? C.purple : 'rgba(255,255,255,0.25)' }}>
                    {rowMod}
                  </motion.span>
                </div>

                {/* Cells */}
                {MODULES.map((colMod, ci) => {
                  const val  = matrix[ri][ci];
                  const cfg  = STRENGTH_CONFIG[val];
                  const isSelf = ri === ci;
                  const isHov  = hovered?.row === ri && hovered?.col === ci;
                  const isSel  = selected?.row === ri && selected?.col === ci;
                  const rowHl  = hovered?.row === ri || selected?.row === ri;
                  const colHl  = hovered?.col === ci || selected?.col === ci;

                  return (
                    <motion.div key={ci}
                      className="flex-1 min-w-[52px] h-11 mx-0.5 rounded-lg flex items-center justify-center cursor-pointer relative"
                      onMouseEnter={() => !isSelf && setHovered({ row: ri, col: ci })}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => !isSelf && setSelected(isSel ? null : { row: ri, col: ci })}
                      animate={{
                        scale: isHov ? 1.1 : isSel ? 1.05 : 1,
                        boxShadow: isHov && val > 0 ? `0 0 16px ${cfg.color}60` : isSel && val > 0 ? `0 0 12px ${cfg.color}40` : 'none',
                      }}
                      transition={{ duration: 0.15 }}
                      style={{
                        background: isSelf
                          ? 'rgba(255,255,255,0.04)'
                          : (rowHl || colHl) && val === 0
                            ? 'rgba(155,89,255,0.05)'
                            : cfg.bg,
                        border: isSelf
                          ? '1px solid rgba(255,255,255,0.06)'
                          : isSel
                            ? `2px solid ${cfg.color}`
                            : `1px solid ${cfg.border}`,
                        opacity: analyzing ? 0.4 : 1,
                        transition: 'background 0.2s, border 0.2s, opacity 0.3s',
                      }}>
                      {isSelf ? (
                        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '14px' }}>◈</span>
                      ) : val > 0 ? (
                        <span className="text-[10px] font-black font-mono" style={{ color: cfg.text }}>
                          {['', '↗', '→→', '⇒⇒'][val]}
                        </span>
                      ) : null}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Selected cell info panel */}
        <AnimatePresence>
          {selInfo && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="w-full p-6 rounded-2xl"
              style={{ background: `${selInfo.color === 'transparent' ? 'rgba(255,255,255,0.02)' : selInfo.color + '0a'}`, border: `1px solid ${selInfo.color === 'transparent' ? 'rgba(255,255,255,0.06)' : selInfo.color + '30'}`, backdropFilter: 'blur(30px)' }}>
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${selInfo.color}15`, border: `1px solid ${selInfo.color}30` }}>
                  <Info size={22} style={{ color: selInfo.color === 'transparent' ? 'rgba(255,255,255,0.3)' : selInfo.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black uppercase tracking-[0.35em] font-mono mb-2"
                    style={{ color: selInfo.color === 'transparent' ? 'rgba(255,255,255,0.3)' : selInfo.color }}>
                    Dependency Detail
                  </p>
                  <p className="text-lg font-black text-white mb-1">
                    <span style={{ color: C.cyan }}>{selInfo.from}</span>
                    {' '}<span className="text-white/30">→</span>{' '}
                    <span style={{ color: C.purple }}>{selInfo.to}</span>
                  </p>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {selInfo.strength === 0 && `${selInfo.from} has no direct dependency on ${selInfo.to}. These modules are decoupled — good architectural separation.`}
                    {selInfo.strength === 1 && `${selInfo.from} has a weak reference to ${selInfo.to}. This is an indirect or optional dependency — low coupling risk.`}
                    {selInfo.strength === 2 && `${selInfo.from} directly uses ${selInfo.to}. A standard dependency — ensure ${selInfo.to} stays stable to avoid breaking ${selInfo.from}.`}
                    {selInfo.strength === 3 && `${selInfo.from} has a strong dependency on ${selInfo.to}. Consider decoupling via an interface or dependency injection to reduce coupling risk.`}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-white/25 font-mono uppercase tracking-widest mb-1">Coupling</p>
                  <p className="text-2xl font-black capitalize" style={{ color: selInfo.color === 'transparent' ? 'rgba(255,255,255,0.25)' : selInfo.color }}>
                    {selInfo.label}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Insight callout */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="w-full p-6 rounded-2xl"
          style={{ background: `${C.cyan}06`, border: `1px solid ${C.cyan}15`, backdropFilter: 'blur(20px)' }}>
          <div className="flex items-start gap-4">
            <CheckCircle size={20} className="flex-shrink-0 mt-0.5" style={{ color: C.green }} />
            <div>
              <p className="text-sm font-black text-white mb-1">Architecture Insight</p>
              <p className="text-sm text-white/45 leading-relaxed">
                <span style={{ color: C.orange, fontWeight: 700 }}>Bridge</span> has the highest coupling (Strong → Core).
                {' '}<span style={{ color: C.cyan, fontWeight: 700 }}>Builder</span> and{' '}
                <span style={{ color: C.cyan, fontWeight: 700 }}>Repository</span> are correctly isolated with zero outgoing dependencies.
                Overall coupling health: <span style={{ color: C.green, fontWeight: 700 }}>{100 - stats.coupling}%</span> — well-architected system.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.05, y: -4, boxShadow: `0 0 55px ${C.purple}65` }}
          whileTap={{ scale: 0.97 }}
          onClick={runAnalysis} disabled={analyzing}
          className="flex items-center gap-3 px-14 py-5 rounded-2xl font-black uppercase tracking-[0.25em] text-lg"
          style={{
            background: analyzing ? `${C.purple}10` : `linear-gradient(135deg,${C.purple},#cc44ff,#4488ff)`,
            color: analyzing ? C.purple : '#fff',
            border: analyzing ? `2px solid ${C.purple}30` : 'none',
            boxShadow: analyzing ? 'none' : `0 0 32px ${C.purple}45`,
            cursor: analyzing ? 'not-allowed' : 'pointer',
          }}>
          {analyzing ? <Loader2 size={22} className="animate-spin" /> : <Network size={22} />}
          {analyzing ? 'Analysing...' : 'Re-Analyse Dependencies'}
        </motion.button>
      </div>
    </div>
  );
}
