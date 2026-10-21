import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Activity, ArrowRight, Shield, Zap, Database, Network, Code, Lock, Cpu, BarChart2, LogIn, CheckCircle, TrendingUp, Eye, GitBranch } from 'lucide-react';
import Lenis from '@studio-freight/lenis';
import ArchitectureVisualization from '../ArchitectureVisualization';
import PremiumBackground from '../PremiumBackground';
import FloatingParticles from '../FloatingParticles';

const C = { cyan: '#00f5ff', purple: '#9b59ff', green: '#00ff88', red: '#ff3355', orange: '#ff6b2b', teal: '#00e5d4' };

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Modules', href: '#modules' },
  { label: 'Analytics', href: '#analytics' },
  { label: 'Security', href: '#security' },
];

const STATS = [
  { val: '99.7%', label: 'Pattern Detection', color: C.cyan },
  { val: '< 12ms', label: 'Response Latency', color: C.purple },
  { val: 'A+', label: 'Security Grade', color: C.green },
  { val: '24/7', label: 'System Uptime', color: C.orange },
];

/* â”€â”€ Section heading â”€â”€ */
function SectionLabel({ tag, heading, gradient, sub }) {
  return (
    <div className="text-center mb-20 flex flex-col items-center">
      <motion.span
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.5 }}
        className="inline-block text-xs font-black uppercase tracking-[0.55em] mb-5 font-mono px-5 py-2 rounded-full"
        style={{ color: `${C.cyan}80`, background: `${C.cyan}08`, border: `1px solid ${C.cyan}18` }}>
        {tag}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
        className="font-black tracking-tight leading-[0.95] mb-6"
        style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
        <span className="text-transparent bg-clip-text" style={{ backgroundImage: gradient }}>
          {heading}
        </span>
      </motion.h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto leading-relaxed"
          style={{ color: 'rgba(160,210,230,0.5)', fontSize: '1.1rem', fontWeight: 400 }}>
          {sub}
        </motion.p>
      )}
    </div>
  );
}

/* â”€â”€ AI Illustration â€” Neural Brain â”€â”€ */
function NeuralBrainSVG({ color = C.cyan }) {
  return (
    <motion.svg viewBox="0 0 240 220" fill="none" xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      animate={{ filter: [`drop-shadow(0 0 8px ${color}40)`, `drop-shadow(0 0 20px ${color}70)`, `drop-shadow(0 0 8px ${color}40)`] }}
      transition={{ duration: 3, repeat: Infinity }}>
      {/* Outer ring */}
      <circle cx="120" cy="110" r="90" stroke={color} strokeOpacity="0.12" strokeWidth="1" strokeDasharray="4 8" />
      <circle cx="120" cy="110" r="70" stroke={color} strokeOpacity="0.18" strokeWidth="1" />
      {/* Brain outline simplified */}
      <path d="M80 80 Q60 60 70 45 Q85 30 100 40 Q110 25 125 35 Q140 20 155 38 Q170 30 175 50 Q185 65 170 80 Q180 95 165 108 Q175 125 155 135 Q150 155 130 155 Q120 165 110 155 Q90 155 85 135 Q65 125 75 108 Q60 95 80 80Z"
        stroke={color} strokeOpacity="0.45" strokeWidth="1.5" fill={`${color}05`} />
      {/* Neural lines */}
      {[[100, 60, 140, 60], [80, 90, 160, 90], [75, 115, 165, 115], [85, 138, 155, 138]].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 5" />
      ))}
      {/* Nodes */}
      {[[100, 60], [140, 60], [80, 90], [120, 90], [160, 90], [75, 115], [120, 115], [165, 115], [85, 138], [155, 138]].map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5" fill={color} fillOpacity="0.15" stroke={color} strokeOpacity="0.5" strokeWidth="1" />
          <circle cx={cx} cy={cy} r="2.5" fill={color} fillOpacity="0.8" />
          <motion.circle cx={cx} cy={cy} r="8" fill="none" stroke={color} strokeOpacity="0.3" strokeWidth="1"
            animate={{ r: [8, 14, 8], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.25 }} />
        </g>
      ))}
      {/* Center glow */}
      <circle cx="120" cy="105" r="20" fill={color} fillOpacity="0.05" />
      <circle cx="120" cy="105" r="8" fill={color} fillOpacity="0.2" stroke={color} strokeOpacity="0.6" strokeWidth="1" />
    </motion.svg>
  );
}

/* â”€â”€ AI Illustration â€” Shield â”€â”€ */
function ShieldSVG({ color = C.green }) {
  return (
    <motion.svg viewBox="0 0 240 240" fill="none"
      className="w-full h-full"
      animate={{ filter: [`drop-shadow(0 0 8px ${color}40)`, `drop-shadow(0 0 22px ${color}70)`, `drop-shadow(0 0 8px ${color}40)`] }}
      transition={{ duration: 3.5, repeat: Infinity }}>
      <circle cx="120" cy="120" r="100" stroke={color} strokeOpacity="0.08" strokeWidth="1" strokeDasharray="3 9" />
      <motion.circle cx="120" cy="120" r="80" stroke={color} strokeOpacity="0.15" strokeWidth="1"
        animate={{ r: [78, 82, 78] }} transition={{ duration: 4, repeat: Infinity }} />
      {/* Shield */}
      <path d="M120 45 L165 65 L165 115 Q165 150 120 170 Q75 150 75 115 L75 65 Z"
        fill={`${color}08`} stroke={color} strokeOpacity="0.5" strokeWidth="1.5" />
      {/* Check */}
      <path d="M100 112 L113 125 L142 96" stroke={color} strokeOpacity="0.9" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" />
      {/* Orbit dots */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <motion.circle key={i} cx={120 + 95 * Math.cos(rad)} cy={120 + 95 * Math.sin(rad)}
            r="3" fill={color} fillOpacity="0.6"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.33 }} />
        );
      })}
    </motion.svg>
  );
}

/* â”€â”€ AI Illustration â€” Analytics chart â”€â”€ */
function AnalyticsSVG({ color = C.orange }) {
  const bars = [55, 72, 48, 90, 65, 82, 58, 95, 70, 85];
  return (
    <motion.svg viewBox="0 0 240 200" fill="none"
      className="w-full h-full"
      animate={{ filter: [`drop-shadow(0 0 8px ${color}40)`, `drop-shadow(0 0 20px ${color}70)`, `drop-shadow(0 0 8px ${color}40)`] }}
      transition={{ duration: 3, repeat: Infinity }}>
      {/* Grid lines */}
      {[40, 80, 120, 160].map(y => (
        <line key={y} x1="20" y1={y} x2="220" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {/* Bars */}
      {bars.map((h, i) => {
        const x = 22 + i * 20;
        return (
          <motion.rect key={i} x={x} y={180 - h * 1.4} width="13" rx="3"
            fill={`${color}${i % 3 === 1 ? 'cc' : '55'}`}
            stroke={color} strokeOpacity="0.3" strokeWidth="0.5"
            initial={{ height: 0, y: 180 }}
            whileInView={{ height: h * 1.4, y: 180 - h * 1.4 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: 'easeOut' }} />
        );
      })}
      {/* Trend line */}
      <motion.polyline
        points={bars.map((h, i) => `${28 + i * 20},${180 - h * 1.4}`).join(' ')}
        stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        viewport={{ once: true }} transition={{ duration: 1.5, ease: 'easeOut' }} />
      {bars.map((h, i) => (
        <circle key={i} cx={28 + i * 20} cy={180 - h * 1.4} r="3.5"
          fill={color} stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" />
      ))}
    </motion.svg>
  );
}

/* â”€â”€ AI Illustration â€” Quantum nodes â”€â”€ */
function QuantumSVG({ color = C.purple }) {
  const nodes = [[120, 60], [60, 100], [180, 100], [90, 155], [150, 155], [120, 190]];
  const edges = [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [1, 2], [3, 4]];
  return (
    <motion.svg viewBox="0 0 240 240" fill="none"
      className="w-full h-full"
      animate={{ filter: [`drop-shadow(0 0 8px ${color}40)`, `drop-shadow(0 0 20px ${color}70)`, `drop-shadow(0 0 8px ${color}40)`] }}
      transition={{ duration: 3.2, repeat: Infinity }}>
      <circle cx="120" cy="120" r="105" stroke={color} strokeOpacity="0.07" strokeWidth="1" />
      {edges.map(([a, b], i) => (
        <motion.line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
          stroke={color} strokeOpacity="0.25" strokeWidth="1.5"
          animate={{ strokeOpacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }} />
      ))}
      {nodes.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="10" fill={`${color}12`} stroke={color} strokeOpacity="0.4" strokeWidth="1.5" />
          <circle cx={cx} cy={cy} r="4" fill={color} fillOpacity="0.8" />
          <motion.circle cx={cx} cy={cy} r="16" fill="none" stroke={color} strokeOpacity="0.2" strokeWidth="1"
            animate={{ r: [14, 22, 14], opacity: [0.25, 0, 0.25] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.4 }} />
        </g>
      ))}
    </motion.svg>
  );
}

export default function LandingPage({ onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => { lenis.destroy(); window.removeEventListener('scroll', handler); };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative min-h-screen text-white bg-[#020308] font-sans overflow-x-hidden selection:bg-cyan-500/30">
      <PremiumBackground />
      <FloatingParticles />

      {/* â”€â”€ NAVBAR â”€â”€ */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(2,3,8,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(40px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,245,255,0.07)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-18 flex items-center justify-between py-4">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.03 }} className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,rgba(0,245,255,0.15),rgba(155,89,255,0.15))', border: '1px solid rgba(0,245,255,0.25)', boxShadow: '0 0 20px rgba(0,245,255,0.15)' }}>
              <Activity size={20} style={{ color: C.cyan }} />
            </div>
            <span className="text-xl font-black tracking-widest text-white" style={{ fontFamily: 'Orbitron, sans-serif', textShadow: `0 0 16px ${C.cyan}60` }}>
              CODEORACLE
            </span>
          </motion.div>

          {/* Nav links */}
          {/* Nav links — bordered motion buttons with cursor glow */}
          <div className="hidden md:flex items-center gap-1.5">
            {[
              { label: 'Features', action: () => scrollTo('features'), color: '#00f5ff' },
              { label: 'Neural Analysis', action: () => onNavigate('neural'), color: '#00f5ff' },
              { label: 'Secure Vault', action: () => onNavigate('secure'), color: '#00ff88' },
              { label: 'Quantum Flow', action: () => onNavigate('quantum'), color: '#ff6b2b' },
              { label: 'Data Matrices', action: () => onNavigate('data'), color: '#9b59ff' },
              { label: 'Analytics', action: () => onNavigate('analytics'), color: '#ff6b2b' },
              { label: 'Security', action: () => onNavigate('security'), color: '#00ff88' },
            ].map(l => (
              <motion.button
                key={l.label}
                onClick={l.action}
                whileHover={{
                  scale: 1.08,
                  y: -3,
                  boxShadow: `0 0 18px ${l.color}55, 0 0 6px ${l.color}30`,
                  borderColor: `${l.color}70`,
                  color: '#ffffff',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-widest relative overflow-hidden"
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'color 0.2s ease',
                }}
              >
                {l.label}
              </motion.button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('login')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)' }}>
              <LogIn size={15} /> Login
            </motion.button>
            <motion.button whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${C.cyan}50` }} whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('login')}
              className="px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest"
              style={{ background: `linear-gradient(135deg,${C.cyan},#00e5d4)`, color: '#000', boxShadow: `0 0 18px ${C.cyan}35` }}>
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* â”€â”€ HERO â”€â”€ */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div style={{ opacity: heroOpacity, y: heroY }} className="flex flex-col items-start gap-8">
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 rounded-full px-5 py-2.5"
                style={{ background: 'rgba(0,245,255,0.06)', border: '1px solid rgba(0,245,255,0.2)' }}>
                <div className="w-2 h-2 rounded-full animate-pulse bg-cyan-400" style={{ boxShadow: `0 0 10px ${C.cyan}` }} />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400 font-mono">CodeOracle v4.0 â€” Online</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h1 className="text-6xl lg:text-7xl font-black tracking-tight leading-[0.9] uppercase mb-5"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400">ARCHITECT</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">THE FUTURE</span>
                </h1>
                <p className="text-xl text-white/60 max-w-lg leading-relaxed font-light">
                  An intelligent software architecture platform engineered to visualize, optimize, and secure modern systems at enterprise scale.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="flex flex-wrap gap-4">
                <motion.button whileHover={{ scale: 1.05, y: -3, boxShadow: `0 0 40px ${C.cyan}60` }} whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate('login')}
                  className="flex items-center gap-3 rounded-2xl px-9 py-4 font-black uppercase tracking-[0.2em] text-base text-black"
                  style={{ background: `linear-gradient(135deg,${C.cyan},#00e5d4,${C.cyan})`, boxShadow: `0 0 25px ${C.cyan}35` }}>
                  ⚡ Enter System <ArrowRight size={18} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.05, y: -3, borderColor: 'rgba(155,89,255,0.6)', boxShadow: `0 0 30px rgba(155,89,255,0.25)`, color: '#fff' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => scrollTo('features')}
                  className="flex items-center gap-3 rounded-2xl px-9 py-4 font-black uppercase tracking-[0.2em] text-base border-2 border-white/20 bg-white/[0.04] backdrop-blur-md text-white/75">
                  ✦ Explore Features
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} className="flex flex-wrap gap-3">
                {STATS.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl"
                    style={{ background: `${s.color}08`, border: `1px solid ${s.color}22` }}>
                    <span className="text-base font-black" style={{ color: s.color }}>{s.val}</span>
                    <span className="text-xs text-white/35 uppercase tracking-widest font-mono">{s.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right â€” 3D Viz */}
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.3 }}>
              <ArchitectureVisualization />
            </motion.div>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════ */}
      <section id="features" className="relative z-10 flex flex-col items-center" style={{ padding: '140px 0 160px' }}>
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent 5%,${C.cyan}40 50%,transparent 95%)` }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none" style={{ background: `radial-gradient(ellipse,${C.cyan}06 0%,transparent 70%)` }} />
        <div className="w-full max-w-[1100px] px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="text-center mb-24">
            <span className="inline-block text-xs font-black uppercase tracking-[0.55em] px-5 py-2 rounded-full mb-6 font-mono" style={{ color: `${C.cyan}80`, background: `${C.cyan}08`, border: `1px solid ${C.cyan}18` }}>
              Platform Capabilities
            </span>
            <h2 className="font-black tracking-tight leading-none mb-6" style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 'clamp(2.6rem,5vw,4.2rem)', background: 'linear-gradient(135deg,#fff 0%,#00f5ff 55%,#00e5d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              CORE FEATURES
            </h2>
            <p className="max-w-xl mx-auto text-lg font-light leading-relaxed" style={{ color: 'rgba(160,210,230,0.5)' }}>
              Six intelligent systems working in harmony — complete visibility and control over your software architecture.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: Cpu, color: C.cyan, title: 'Neural Analysis', desc: 'AI-powered real-time structural heuristics and pattern detection across your entire codebase.', SVG: NeuralBrainSVG },
              { icon: Shield, color: C.green, title: 'Secure Vault', desc: 'Military-grade AES-256 encryption with CVE scanning and immutable audit trails.', SVG: ShieldSVG },
              { icon: Zap, color: C.orange, title: 'Quantum Flow', desc: 'Sub-millisecond pipeline rendering with live throughput and latency telemetry.', SVG: QuantumSVG },
              { icon: Database, color: C.purple, title: 'Data Matrices', desc: 'N-dimensional holographic relationship maps and intelligent schema analysis.', SVG: QuantumSVG },
              { icon: BarChart2, color: '#4488ff', title: 'Analytics Engine', desc: 'Live performance metrics, bottleneck detection, and AI-generated optimization roadmaps.', SVG: AnalyticsSVG },
              { icon: Network, color: '#cc44ff', title: 'Dependency Graph', desc: 'Graph-based inter-module relationship mapping with circular dependency detection.', SVG: NeuralBrainSVG },
            ].map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 50, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.09, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -12, boxShadow: `0 40px 80px -20px ${f.color}45` }}
                className="group relative rounded-[2rem] overflow-hidden flex flex-col cursor-default"
                style={{ background: 'rgba(4,8,22,0.6)', backdropFilter: 'blur(48px)', border: '1px solid rgba(255,255,255,0.07)', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
                <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ border: `1px solid ${f.color}45`, boxShadow: `inset 0 0 40px ${f.color}06` }} />
                <div className="relative flex items-center justify-center overflow-hidden" style={{ height: '168px', background: `linear-gradient(145deg,${f.color}07,transparent 65%)` }}>
                  <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 60%,${f.color}10,transparent 65%)` }} />
                  <div className="w-32 h-32 relative z-10"><f.SVG color={f.color} /></div>
                </div>
                <div className="flex flex-col flex-1 px-8 pb-9 pt-6">
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${f.color}14`, border: `1px solid ${f.color}28` }}>
                      <f.icon size={19} style={{ color: f.color }} />
                    </div>
                    <h3 className="text-lg font-black text-white tracking-wide">{f.title}</h3>
                  </div>
                  <p className="text-sm leading-[1.8] flex-1" style={{ color: 'rgba(160,210,230,0.48)' }}>{f.desc}</p>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${f.color}65,transparent)` }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MODULES
      ═══════════════════════════════════════ */}
      <section id="modules" className="relative z-10 flex flex-col items-center" style={{ padding: '140px 0 160px' }}>
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent 5%,${C.purple}40 50%,transparent 95%)` }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none" style={{ background: `radial-gradient(ellipse,${C.purple}06 0%,transparent 70%)` }} />
        <div className="w-full max-w-[1100px] px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="text-center mb-24">
            <span className="inline-block text-xs font-black uppercase tracking-[0.55em] px-5 py-2 rounded-full mb-6 font-mono" style={{ color: `${C.purple}80`, background: `${C.purple}08`, border: `1px solid ${C.purple}18` }}>
              Intelligent Systems
            </span>
            <h2 className="font-black tracking-tight leading-none mb-6" style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 'clamp(2.6rem,5vw,4.2rem)', background: `linear-gradient(135deg,${C.purple} 0%,#cc44ff 50%,${C.orange} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MODULE SUITE
            </h2>
            <p className="max-w-xl mx-auto text-lg font-light leading-relaxed" style={{ color: 'rgba(160,210,230,0.5)' }}>
              Four specialized AI modules, each engineered for a distinct dimension of software intelligence.
            </p>
          </motion.div>
          <div className="space-y-10">
            {[
              { color: C.cyan, icon: Cpu, title: 'Neural Analysis', sub: 'Pattern detection & complexity scoring', page: 'neural', points: ['40+ architectural patterns detected in real time', 'Cyclomatic complexity & cognitive load metrics', 'Live inter-module dependency mapping'], SVG: NeuralBrainSVG, flip: false },
              { color: C.green, icon: Shield, title: 'Secure Vault', sub: 'Encryption & vulnerability scanning', page: 'secure', points: ['AES-256 encryption at rest and in transit', 'CVE database integration with zero-day alerts', 'Zero-trust access control with MFA'], SVG: ShieldSVG, flip: true },
              { color: C.orange, icon: Zap, title: 'Quantum Flow', sub: 'Zero-latency data streaming', page: 'quantum', points: ['Sub-12ms response pipeline architecture', 'Hardware-accelerated diagram rendering', 'Live throughput & latency telemetry'], SVG: AnalyticsSVG, flip: false },
              { color: C.purple, icon: Database, title: 'Data Matrices', sub: 'Holographic relationship maps', page: 'data', points: ['N-dimensional data relationship visualization', 'Automatic schema detection & optimization', 'Interactive graph filtering & drill-down'], SVG: QuantumSVG, flip: true },
            ].map((m, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ boxShadow: `0 40px 100px -30px ${m.color}30` }}
                className="group relative rounded-[2rem] overflow-hidden"
                style={{ background: 'rgba(4,8,22,0.6)', backdropFilter: 'blur(48px)', border: '1px solid rgba(255,255,255,0.07)', transition: 'box-shadow 0.4s ease' }}>
                <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[2rem]" style={{ background: `linear-gradient(to bottom,${m.color}90,transparent)` }} />
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className={`flex flex-col justify-center px-12 py-12 ${m.flip ? 'lg:order-2' : 'lg:order-1'}`}>
                    <div className="flex items-center gap-4 mb-5">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: `${m.color}14`, border: `1px solid ${m.color}28` }}>
                        <m.icon size={22} style={{ color: m.color }} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white tracking-wide">{m.title}</h3>
                        <p className="text-xs font-mono mt-0.5" style={{ color: `${m.color}70` }}>{m.sub}</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-8">
                      {m.points.map((pt, j) => (
                        <motion.div key={j} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 + j * 0.08, duration: 0.45 }} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: m.color, boxShadow: `0 0 6px ${m.color}` }} />
                          <span className="text-sm leading-relaxed" style={{ color: 'rgba(160,210,230,0.55)' }}>{pt}</span>
                        </motion.div>
                      ))}
                    </div>
                    <motion.button whileHover={{ scale: 1.04, boxShadow: `0 0 28px ${m.color}45` }} whileTap={{ scale: 0.97 }} onClick={() => onNavigate(m.page)} className="self-start px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-widest" style={{ background: `${m.color}14`, border: `1px solid ${m.color}35`, color: m.color }}>
                      Open {m.title} →
                    </motion.button>
                  </div>
                  <div className={`flex items-center justify-center px-10 py-12 ${m.flip ? 'lg:order-1' : 'lg:order-2'}`} style={{ background: `radial-gradient(ellipse at 50% 50%,${m.color}07,transparent 65%)` }}>
                    <div className="w-56 h-56"><m.SVG color={m.color} /></div>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ border: `1px solid ${m.color}30` }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ANALYTICS
      ═══════════════════════════════════════ */}
      <section id="analytics" className="relative z-10 flex flex-col items-center" style={{ padding: '140px 0 160px' }}>
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent 5%,${C.orange}40 50%,transparent 95%)` }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none" style={{ background: `radial-gradient(ellipse,${C.orange}06 0%,transparent 70%)` }} />
        <div className="w-full max-w-[1100px] px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="text-center mb-24">
            <span className="inline-block text-xs font-black uppercase tracking-[0.55em] px-5 py-2 rounded-full mb-6 font-mono" style={{ color: `${C.orange}80`, background: `${C.orange}08`, border: `1px solid ${C.orange}18` }}>
              Live Intelligence
            </span>
            <h2 className="font-black tracking-tight leading-none mb-6" style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 'clamp(2.6rem,5vw,4.2rem)', background: `linear-gradient(135deg,${C.orange} 0%,#ffaa00 50%,#ffdd00 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ANALYTICS ENGINE
            </h2>
            <p className="max-w-xl mx-auto text-lg font-light leading-relaxed" style={{ color: 'rgba(160,210,230,0.5)' }}>
              Real-time performance telemetry, bottleneck detection, and AI-generated optimization roadmaps.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }} className="space-y-5">
              {[
                { icon: TrendingUp, color: C.green, title: 'Health Score Tracking', desc: 'Architecture health updated every 30 s with composite scoring across all dimensions.' },
                { icon: BarChart2, color: C.cyan, title: 'Coupling & Cohesion', desc: 'Visualized coupling index and module cohesion metrics with per-file drill-down.' },
                { icon: GitBranch, color: C.orange, title: 'AI Refactoring Hints', desc: 'Ranked refactoring recommendations by impact and implementation effort.' },
                { icon: Eye, color: C.purple, title: 'Historical Trends', desc: 'Time-series analysis of complexity drift, security posture, and performance.' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55 }} whileHover={{ x: 8, borderColor: `${item.color}45` }} className="flex items-start gap-5 p-6 rounded-2xl transition-all" style={{ background: 'rgba(4,8,22,0.6)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                    <item.icon size={22} style={{ color: item.color }} />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white mb-1.5">{item.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(160,210,230,0.48)' }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
              <motion.button initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} whileHover={{ scale: 1.04, boxShadow: `0 0 44px ${C.orange}55` }} whileTap={{ scale: 0.97 }} onClick={() => onNavigate('analytics')} className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-base text-black mt-4" style={{ background: `linear-gradient(135deg,${C.orange},#ffaa00)`, boxShadow: `0 0 24px ${C.orange}35` }}>
                <BarChart2 size={20} /> View Analytics
              </motion.button>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -6 }} className="rounded-[2rem] overflow-hidden" style={{ background: 'rgba(4,8,22,0.7)', border: `1px solid ${C.orange}18`, backdropFilter: 'blur(48px)', transition: 'all 0.4s ease' }}>
              <div className="px-8 py-6 flex items-center justify-between border-b" style={{ borderColor: `${C.orange}12` }}>
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.45em]" style={{ color: `${C.orange}70` }}>System Metrics</p>
                  <p className="text-lg font-black text-white mt-0.5">Live Dashboard</p>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl" style={{ background: `${C.green}08`, border: `1px solid ${C.green}20` }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.green }} />
                  <span className="text-xs font-black font-mono" style={{ color: C.green }}>LIVE</span>
                </div>
              </div>
              <div className="px-8 py-6" style={{ height: '160px' }}>
                <AnalyticsSVG color={C.orange} />
              </div>
              <div className="px-8 pb-8 space-y-5">
                {[
                  { label: 'Architecture Health', val: 94, color: C.green },
                  { label: 'Code Complexity', val: 68, color: C.cyan },
                  { label: 'Security Score', val: 98, color: C.purple },
                  { label: 'Performance Index', val: 87, color: C.orange },
                ].map((m, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-mono" style={{ color: 'rgba(160,210,230,0.5)' }}>{m.label}</span>
                      <span className="text-sm font-black" style={{ color: m.color }}>{m.val}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <motion.div className="h-full rounded-full" initial={{ width: 0 }} whileInView={{ width: `${m.val}%` }} viewport={{ once: true }} transition={{ duration: 1.3, delay: i * 0.12, ease: 'easeOut' }} style={{ background: `linear-gradient(90deg,${m.color}70,${m.color})`, boxShadow: `0 0 10px ${m.color}50` }} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECURITY
      ═══════════════════════════════════════ */}
      <section id="security" className="relative z-10 flex flex-col items-center" style={{ padding: '140px 0 160px' }}>
        <div className="absolute top-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent 5%,${C.green}40 50%,transparent 95%)` }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none" style={{ background: `radial-gradient(ellipse,${C.green}06 0%,transparent 70%)` }} />
        <div className="w-full max-w-[1100px] px-8 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65 }} className="text-center mb-24">
            <span className="inline-block text-xs font-black uppercase tracking-[0.55em] px-5 py-2 rounded-full mb-6 font-mono" style={{ color: `${C.green}80`, background: `${C.green}08`, border: `1px solid ${C.green}18` }}>
              Enterprise Protection
            </span>
            <h2 className="font-black tracking-tight leading-none mb-6" style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 'clamp(2.6rem,5vw,4.2rem)', background: `linear-gradient(135deg,${C.green} 0%,${C.teal} 50%,${C.cyan} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              SECURITY MATRIX
            </h2>
            <p className="max-w-xl mx-auto text-lg font-light leading-relaxed" style={{ color: 'rgba(160,210,230,0.5)' }}>
              Military-grade protection with continuous threat monitoring and zero-trust architecture built into every layer.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {[
              { icon: Shield, color: C.green, title: 'AES-256 Encryption', stat: '100%', statLabel: 'Encrypted', desc: 'All data encrypted at rest and in transit using military-grade standards.', SVG: ShieldSVG },
              { icon: Code, color: C.red, title: 'CVE Scanning', stat: '0', statLabel: 'Critical CVEs', desc: 'Continuous scanning against the National Vulnerability Database in real time.', SVG: NeuralBrainSVG },
              { icon: Lock, color: C.cyan, title: 'Zero-Trust Access', stat: 'A+', statLabel: 'Security Grade', desc: 'Every request verified. Role-based access control with MFA enforcement.', SVG: ShieldSVG },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 44, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }} whileHover={{ y: -14, boxShadow: `0 40px 80px -20px ${s.color}45` }} className="group relative rounded-[2rem] overflow-hidden flex flex-col cursor-default" style={{ background: 'rgba(4,8,22,0.6)', backdropFilter: 'blur(48px)', border: '1px solid rgba(255,255,255,0.07)', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
                <div className="relative flex items-center justify-center overflow-hidden" style={{ height: '156px', background: `linear-gradient(145deg,${s.color}07,transparent 65%)` }}>
                  <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 60%,${s.color}10,transparent 65%)` }} />
                  <div className="w-28 h-28 relative z-10"><s.SVG color={s.color} /></div>
                </div>
                <div className="px-8 pb-9 pt-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${s.color}14`, border: `1px solid ${s.color}28` }}>
                      <s.icon size={22} style={{ color: s.color }} />
                    </div>
                    <div className="text-right">
                      <p className="font-black leading-none" style={{ color: s.color, fontFamily: 'Orbitron,sans-serif', fontSize: '2.4rem', textShadow: `0 0 22px ${s.color}55` }}>{s.stat}</p>
                      <p className="text-xs font-mono uppercase tracking-widest mt-1" style={{ color: 'rgba(255,255,255,0.22)' }}>{s.statLabel}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-white mb-3">{s.title}</h3>
                  <p className="text-sm leading-[1.8]" style={{ color: 'rgba(160,210,230,0.46)' }}>{s.desc}</p>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg,transparent,${s.color}65,transparent)` }} />
                <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ border: `1px solid ${s.color}35` }} />
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }} className="relative rounded-[2rem] overflow-hidden text-center" style={{ padding: '80px 48px', background: 'rgba(4,8,22,0.8)', backdropFilter: 'blur(56px)', border: `1px solid ${C.cyan}18` }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% -10%,${C.cyan}10,transparent 65%)` }} />
            <motion.div className="absolute top-0 inset-x-0 h-px" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }} style={{ background: `linear-gradient(90deg,transparent,${C.cyan}70,transparent)` }} />
            <div className="relative z-10">
              <p className="text-xs font-black uppercase tracking-[0.55em] mb-6 font-mono" style={{ color: `${C.cyan}60` }}>Get Started Today</p>
              <h3 className="font-black text-white mb-5" style={{ fontFamily: 'Orbitron,sans-serif', fontSize: 'clamp(1.9rem,3.8vw,3.2rem)', lineHeight: 1.1 }}>
                Ready to architect{' '}
                <span style={{ background: `linear-gradient(135deg,${C.cyan},${C.teal})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>the future?</span>
              </h3>
              <p className="text-lg mb-12 max-w-xl mx-auto font-light" style={{ color: 'rgba(160,210,230,0.5)' }}>
                Join thousands of engineers using CodeOracle to build better, faster, and more secure systems.
              </p>
              <motion.button whileHover={{ scale: 1.05, boxShadow: `0 0 65px ${C.cyan}75` }} whileTap={{ scale: 0.97 }} onClick={() => onNavigate('login')} className="relative overflow-hidden px-16 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-lg text-black" style={{ backgroundImage: `linear-gradient(135deg,${C.cyan},${C.teal},${C.cyan})`, backgroundSize: '200% 100%', boxShadow: `0 0 38px ${C.cyan}48` }}>
                <motion.div className="absolute inset-0 pointer-events-none" animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }} style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)', width: '40%' }} />
                <span className="relative z-10">⚡ Start for Free</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 border-t border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Activity size={18} style={{ color: C.cyan }} />
            <span className="font-black tracking-widest text-sm" style={{ fontFamily: 'Orbitron,sans-serif', color: 'rgba(255,255,255,0.4)' }}>CODEORACLE</span>
          </div>
          <p className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.2)' }}>© 2026 CodeOracle. All systems operational.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
            <span className="text-xs font-mono uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>All Systems Online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
