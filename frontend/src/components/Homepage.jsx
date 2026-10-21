import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, Cpu, Activity, Shield, Zap, Lock, Globe, Star, Code, Database, Network, Box, Mail, User, Eye, Key, BarChart2, Layers, AlertTriangle, UserCheck } from "lucide-react";
import Lenis from '@studio-freight/lenis';
import FloatingParticles from "./FloatingParticles";
import backgroImage from '../assets/backgro.jpg';
import ArchitectureVisualization from "./ArchitectureVisualization";
import PremiumBackground from "./PremiumBackground";
import { apiUrl, jsonHeaders } from '../api';

/* ─────────────────────────────────────────────
   COLOUR PALETTE TOKENS
───────────────────────────────────────────── */
const C = {
  cyan: '#00f5ff',
  teal: '#00e5d4',
  green: '#00ff88',
  red: '#ff3355',
  orange: '#ff6b2b',
  amber: '#ffaa00',
  purple: '#9b59ff',
  violet: '#cc44ff',
  blue: '#4488ff',
};

/* ─────────────────────────────────────────────
   NAV TAB CONTENT DATA
───────────────────────────────────────────── */
const NAV_TAB_CONTENT = {
  Modules: {
    color: C.cyan,
    icon: Layers,
    items: [
      { icon: Box, label: 'Singleton Manager', desc: 'Ensures single instance creation across runtime contexts' },
      { icon: Cpu, label: 'Factory Engine', desc: 'Dynamic object generation with configurable blueprints' },
      { icon: Network, label: 'Observer Network', desc: 'Event-driven reactive signal propagation layer' },
      { icon: Lock, label: 'Secure Vault', desc: 'Military-grade encrypted storage and retrieval module' },
      { icon: Activity, label: 'AI Analysis Layer', desc: 'Neural heuristics for real-time structural detection' },
    ],
  },
  Analytics: {
    color: C.orange,
    icon: BarChart2,
    items: [
      { icon: Activity, label: 'System Metrics', desc: 'Live performance telemetry across all subsystems' },
      { icon: Zap, label: 'Performance Insights', desc: 'Bottleneck detection and throughput optimization' },
      { icon: Star, label: 'Architecture Health Score', desc: 'Composite scoring of system cohesion and coupling' },
      { icon: Database, label: 'Dependency Analysis', desc: 'Graph-based mapping of inter-module relationships' },
      { icon: ArrowRight, label: 'Optimization Recommendations', desc: 'AI-generated refactoring and efficiency proposals' },
    ],
  },
  Security: {
    color: C.red,
    icon: Shield,
    items: [
      { icon: AlertTriangle, label: 'Vulnerability Detection', desc: 'Automated scanning for known CVEs and threat vectors' },
      { icon: Code, label: 'Secure Architecture Analysis', desc: 'Pattern-based review of structural security posture' },
      { icon: Key, label: 'Encryption Validation', desc: 'Cipher strength and protocol compliance verification' },
      { icon: Eye, label: 'Threat Monitoring', desc: 'Real-time anomaly detection and incident alerting' },
      { icon: Shield, label: 'Security Score Dashboard', desc: 'Holistic risk rating with remediation priority queue' },
    ],
  },
  Access: {
    color: C.purple,
    icon: UserCheck,
    items: [
      { icon: UserCheck, label: 'Role-Based Access Control', desc: 'Granular permission mapping per organizational role' },
      { icon: User, label: 'User Permissions', desc: 'Fine-grained access scoping at the resource level' },
      { icon: Database, label: 'Authentication Logs', desc: 'Immutable audit trail of all authentication events' },
      { icon: Activity, label: 'Login Activity Tracking', desc: 'Geo-tagged session monitoring and risk scoring' },
      { icon: Globe, label: 'Access Management Dashboard', desc: 'Unified control plane for identity and access' },
    ],
  },
};

/* ─────────────────────────────────────────────
   NAV BAR
───────────────────────────────────────────── */
function NavBar({ activeTab, setActiveTab }) {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = ['Modules', 'Analytics', 'Security', 'Access'];

  const handleTabClick = (label) => {
    // Toggle: clicking same tab closes it
    if (activeTab === label) {
      setActiveTab(null);
    } else {
      setActiveTab(label);
      // Scroll to the tab content panel
      setTimeout(() => {
        const el = document.getElementById('nav-tab-panel');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        background: scrolled ? 'rgba(2,3,8,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(40px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,245,255,0.07)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto w-full px-8 sm:px-16 lg:px-24 xl:px-32 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.4 }}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(155,89,255,0.15))',
              border: '1px solid rgba(0,245,255,0.2)',
              boxShadow: '0 0 16px rgba(0,245,255,0.15)',
            }}
          >
            <Activity size={20} style={{ color: C.cyan }} />
          </motion.div>
          <span
            className="font-black text-lg tracking-widest text-white"
            style={{ fontFamily: 'Orbitron, sans-serif', textShadow: `0 0 16px ${C.cyan}60` }}
          >
            CODEORACLE
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {links.map((label, idx) => {
            const tabData = NAV_TAB_CONTENT[label];
            const isActive = activeTab === label;
            return (
              <motion.button
                key={label}
                onClick={() => handleTabClick(label)}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="relative px-5 py-2 rounded-lg text-sm font-black uppercase tracking-[0.25em] transition-all cursor-pointer"
                style={{
                  background: isActive
                    ? `${tabData.color}18`
                    : hoveredIdx === idx ? 'rgba(255,255,255,0.04)' : 'transparent',
                  color: isActive ? tabData.color : hoveredIdx === idx ? '#fff' : 'rgba(255,255,255,0.45)',
                  border: isActive ? `1px solid ${tabData.color}40` : '1px solid transparent',
                  boxShadow: isActive ? `0 0 16px ${tabData.color}20` : 'none',
                  textShadow: isActive ? `0 0 10px ${tabData.color}80` : 'none',
                }}
              >
                {label}
                {isActive && (
                  <motion.div
                    layoutId="nav-active-indicator"
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${tabData.color}, transparent)`,
                      boxShadow: `0 0 8px ${tabData.color}`,
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}

/* ─────────────────────────────────────────────
   MAGNETIC BUTTON WRAPPER
───────────────────────────────────────────── */
function Magnetic({ children, strength = 0.35, radius = 120 }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.6 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < radius) {
      const pull = (1 - dist / radius);
      x.set(dx * pull * strength);
      y.set(dy * pull * strength);
    }
  }, [x, y, radius, strength]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   NAV TAB CONTENT PANEL
───────────────────────────────────────────── */
function NavTabPanel({ activeTab }) {
  if (!activeTab) return null;
  const data = NAV_TAB_CONTENT[activeTab];
  if (!data) return null;
  const Icon = data.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        id="nav-tab-panel"
        initial={{ opacity: 0, y: -16, scaleY: 0.95 }}
        animate={{ opacity: 1, y: 0, scaleY: 1 }}
        exit={{ opacity: 0, y: -10, scaleY: 0.97 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: 'rgba(4, 8, 22, 0.9)',
          backdropFilter: 'blur(40px)',
          border: `1px solid ${data.color}25`,
          borderTop: `2px solid ${data.color}60`,
          boxShadow: `0 20px 60px -20px ${data.color}25, 0 0 0 1px rgba(255,255,255,0.02)`,
          transformOrigin: 'top',
        }}
        className="relative overflow-hidden rounded-b-2xl"
      >
        {/* Top color bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${data.color}80, ${data.color}, ${data.color}80, transparent)`,
        }} />

        <div className="px-6 py-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${data.color}15`, border: `1px solid ${data.color}30` }}>
              <Icon size={16} style={{ color: data.color }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] font-black font-mono" style={{ color: `${data.color}90` }}>
                {activeTab} Module
              </p>
              <p className="text-[11px] text-white/30 font-mono tracking-widest">5 SYSTEMS AVAILABLE</p>
            </div>
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {data.items.map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  whileHover={{
                    scale: 1.03,
                    borderColor: `${data.color}50`,
                    boxShadow: `0 8px 25px -8px ${data.color}30`,
                  }}
                  className="p-3 rounded-xl cursor-pointer relative overflow-hidden group"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid rgba(255,255,255,0.05)`,
                    transition: 'all 0.25s ease',
                  }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2"
                    style={{ background: `${data.color}12`, border: `1px solid ${data.color}20` }}>
                    <ItemIcon size={13} style={{ color: data.color }} />
                  </div>
                  <p className="text-xs font-black text-white/85 mb-1 leading-tight">{item.label}</p>
                  <p className="text-[11px] text-white/35 leading-relaxed font-mono">{item.desc}</p>
                  {/* Bottom line accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: `linear-gradient(90deg, transparent, ${data.color}50, transparent)` }} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────
   FUTURISTIC SVG BACKGROUND DECORATION
───────────────────────────────────────────── */
function HeroBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Subtle grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00f5ff" strokeWidth="0.5" />
          </pattern>
          <pattern id="hero-grid-large" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
            <rect width="180" height="180" fill="none" stroke="#9b59ff" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
        <rect width="100%" height="100%" fill="url(#hero-grid-large)" />
      </svg>

      {/* Animated connection lines */}
      <svg viewBox="0 0 1400 900" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-[0.18]">
        <defs>
          <linearGradient id="conn-line-1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00f5ff" stopOpacity="0" />
            <stop offset="50%" stopColor="#00f5ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#9b59ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="conn-line-2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#9b59ff" stopOpacity="0" />
            <stop offset="50%" stopColor="#ff6b2b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00f5ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Horizontal sweep lines */}
        <path d="M -100,220 Q 400,180 700,250 Q 1000,320 1500,200" fill="none" stroke="url(#conn-line-1)" strokeWidth="1.2" />
        <path d="M -100,450 Q 350,400 700,480 Q 1050,560 1500,420" fill="none" stroke="url(#conn-line-2)" strokeWidth="0.8" strokeDasharray="8 12" />
        <path d="M -100,680 Q 500,640 800,700 Q 1100,760 1500,660" fill="none" stroke="url(#conn-line-1)" strokeWidth="0.6" strokeDasharray="4 16" />

        {/* Animated data particles */}
        <circle cx="0" cy="0" r="3" fill="#00f5ff" style={{ filter: 'drop-shadow(0 0 5px #00f5ff)' }}>
          <animateMotion dur="6s" repeatCount="indefinite" path="M -100,220 Q 400,180 700,250 Q 1000,320 1500,200" />
        </circle>
        <circle cx="0" cy="0" r="2" fill="#9b59ff" style={{ filter: 'drop-shadow(0 0 4px #9b59ff)' }}>
          <animateMotion dur="9s" repeatCount="indefinite" begin="3s" path="M -100,450 Q 350,400 700,480 Q 1050,560 1500,420" />
        </circle>
        <circle cx="0" cy="0" r="2" fill="#ff6b2b" style={{ filter: 'drop-shadow(0 0 4px #ff6b2b)' }}>
          <animateMotion dur="7.5s" repeatCount="indefinite" begin="1.5s" path="M -100,680 Q 500,640 800,700 Q 1100,760 1500,660" />
        </circle>

        {/* Circuit node dots */}
        <circle cx="350" cy="185" r="3.5" fill="none" stroke="#00f5ff" strokeWidth="1.5" opacity="0.5" />
        <circle cx="350" cy="185" r="1.5" fill="#00f5ff" opacity="0.7" />
        <circle cx="700" cy="250" r="3" fill="none" stroke="#00f5ff" strokeWidth="1" opacity="0.4" />
        <circle cx="700" cy="250" r="1.5" fill="#00f5ff" opacity="0.6" />
        <circle cx="1050" cy="315" r="2.5" fill="none" stroke="#9b59ff" strokeWidth="1" opacity="0.4" />
        <circle cx="1050" cy="315" r="1" fill="#9b59ff" opacity="0.6" />

        {/* Architectural corner brackets */}
        <path d="M 80,80 L 80,40 L 120,40" fill="none" stroke="#00f5ff" strokeWidth="1" opacity="0.3" />
        <path d="M 1320,80 L 1320,40 L 1280,40" fill="none" stroke="#00f5ff" strokeWidth="1" opacity="0.3" />
        <path d="M 80,820 L 80,860 L 120,860" fill="none" stroke="#9b59ff" strokeWidth="1" opacity="0.3" />
        <path d="M 1320,820 L 1320,860 L 1280,860" fill="none" stroke="#9b59ff" strokeWidth="1" opacity="0.3" />
      </svg>

      {/* Glowing data path vertical lines */}
      <div className="absolute top-0 bottom-0 left-1/3 w-px opacity-[0.06]"
        style={{ background: 'linear-gradient(to bottom, transparent, #00f5ff, transparent)' }} />
      <div className="absolute top-0 bottom-0 right-1/3 w-px opacity-[0.04]"
        style={{ background: 'linear-gradient(to bottom, transparent, #9b59ff, transparent)' }} />

      {/* Radial ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[80px]"
        style={{ background: 'radial-gradient(circle, #00f5ff, transparent 70%)' }} />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03] blur-[80px]"
        style={{ background: 'radial-gradient(circle, #9b59ff, transparent 70%)' }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   IMPROVED GLASS AUTH FORM
───────────────────────────────────────────── */
function AuthCard({ authMode, setAuthMode, authData, setAuthData, authError, authMessage, onLogin, onSignup, onEnterSystem, authStage }) {
  const [focusField, setFocusField] = useState('');
  const accentColor = authMode === 'login' ? C.cyan : C.purple;

  // Input style
  const inputStyle = (field) => ({
    width: '100%',
    background: focusField === field ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.025)',
    border: `1px solid ${focusField === field ? accentColor + '80' : 'rgba(255,255,255,0.10)'}`,
    borderRadius: '0.75rem',
    padding: '1.1rem 1.2rem 1.1rem 3.2rem',
    color: '#ffffff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: focusField === field ? `0 0 20px ${accentColor}20` : 'none',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      animate={{ y: [0, -6, 0] }}
      transition={{
        y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        opacity: { duration: 0.9, ease: 'easeOut' },
      }}
      viewport={{ once: true }}
      className="relative rounded-[2rem] overflow-hidden flex flex-col items-center"
      style={{
        background: 'rgba(4, 8, 22, 0.80)',
        backdropFilter: 'blur(48px) saturate(200%)',
        border: `1px solid ${accentColor}22`,
        boxShadow: authMode === 'login'
          ? `0 40px 100px -24px rgba(0,245,255,0.18), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 1px rgba(255,255,255,0.09)`
          : `0 40px 100px -24px rgba(155,89,255,0.18), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 1px rgba(255,255,255,0.09)`,
        padding: '3.5rem 3rem 3rem',
        width: '100%',
        maxWidth: '560px',
        minHeight: '560px',
        transition: 'box-shadow 0.5s ease, border-color 0.5s ease',
      }}
    >
      {/* Top shimmer line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: authMode === 'login'
          ? `linear-gradient(90deg, transparent, rgba(0,245,255,0.6), rgba(0,245,255,0.2), transparent)`
          : `linear-gradient(90deg, transparent, rgba(155,89,255,0.6), rgba(155,89,255,0.2), transparent)`,
        transition: 'background 0.5s ease',
      }} />

      {/* Inner corner glow TL */}
      <div style={{
        position: 'absolute', top: -40, left: -40, width: 200, height: 200,
        background: authMode === 'login'
          ? 'radial-gradient(circle, rgba(0,245,255,0.09), transparent 70%)'
          : 'radial-gradient(circle, rgba(155,89,255,0.09), transparent 70%)',
        pointerEvents: 'none',
        transition: 'background 0.5s ease',
      }} />

      {/* Header label */}
      <p className="text-sm uppercase tracking-[0.4em] font-extrabold mb-5 text-center font-mono"
        style={{ color: `${accentColor}90` }}>
        SYSTEM AUTHENTICATION
      </p>

      {/* Tabs — Login / Signup — LARGER & easier to click */}
      <div className="flex rounded-2xl p-1.5 mb-7 w-full"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        {['login', 'signup'].map(mode => (
          <button
            key={mode}
            onClick={() => setAuthMode(mode)}
            className="flex-1 rounded-xl font-black uppercase transition-all cursor-pointer"
            style={{
              background: authMode === mode
                ? (mode === 'login' ? C.cyan : `linear-gradient(135deg, ${C.purple}, ${C.violet})`)
                : 'transparent',
              color: authMode === mode ? (mode === 'login' ? '#000' : '#fff') : 'rgba(255,255,255,0.35)',
              boxShadow: authMode === mode
                ? (mode === 'login' ? `0 0 22px ${C.cyan}60` : `0 0 22px ${C.purple}60`)
                : 'none',
              fontSize: '1.1rem',
              letterSpacing: '0.18em',
              padding: '1.1rem 0',
              minHeight: '58px',
              transition: 'all 0.25s ease',
            }}
          >
            {mode === 'login' ? '⚡ Login' : '✦ Sign Up'}
          </button>
        ))}
      </div>

      {/* Fields — full width, well spaced */}
      <div className="w-full space-y-5">
        {authMode === 'signup' && (
          <div>
            <label className="block text-xs uppercase tracking-[0.25em] font-extrabold mb-2 text-white/40 font-mono">
              Vault Username
            </label>
            <div className="relative">
              <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${focusField === 'username' ? 'text-purple-400' : 'text-white/20'}`} />
              <input
                value={authData.username}
                onChange={e => setAuthData({ ...authData, username: e.target.value })}
                onFocus={() => setFocusField('username')}
                onBlur={() => setFocusField('')}
                style={inputStyle('username')}
                placeholder="Oracle Agent"
              />
            </div>
          </div>
        )}
        <div>
          <label className="block text-xs uppercase tracking-[0.25em] font-extrabold mb-2 text-white/40 font-mono">
            Email Address
          </label>
          <div className="relative">
            <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${focusField === 'email' ? (authMode === 'login' ? 'text-cyan-400' : 'text-purple-400') : 'text-white/20'}`} />
            <input
              value={authData.email}
              onChange={e => setAuthData({ ...authData, email: e.target.value })}
              onFocus={() => setFocusField('email')}
              onBlur={() => setFocusField('')}
              style={inputStyle('email')}
              placeholder="name@domain.com"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs uppercase tracking-[0.25em] font-extrabold mb-2 text-white/40 font-mono">
            Password
          </label>
          <div className="relative">
            <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${focusField === 'password' ? (authMode === 'login' ? 'text-cyan-400' : 'text-purple-400') : 'text-white/20'}`} />
            <input
              type="password"
              value={authData.password}
              onChange={e => setAuthData({ ...authData, password: e.target.value })}
              onFocus={() => setFocusField('password')}
              onBlur={() => setFocusField('')}
              style={inputStyle('password')}
              placeholder={authMode === 'login' ? 'Enter passphrase' : 'Create secure key'}
            />
          </div>
        </div>
      </div>

      {/* Primary action button — larger, more prominent */}
      <div className="w-full mt-8 px-0">
        <Magnetic strength={0.35} radius={140}>
          <motion.button
            whileHover={{
              boxShadow: `0 0 50px ${authMode === 'login' ? C.cyan : C.purple}65, 0 0 20px ${authMode === 'login' ? C.cyan : C.purple}35`,
              scale: 1.025,
              y: -2,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={authMode === 'login' ? onLogin : onSignup}
            className="w-full rounded-2xl font-black uppercase tracking-[0.25em] transition-all cursor-pointer"
            style={{
              backgroundImage: authMode === 'login'
                ? `linear-gradient(135deg, ${C.cyan}, ${C.teal}, ${C.cyan})`
                : `linear-gradient(135deg, ${C.purple}, ${C.violet}, ${C.blue})`,
              color: authMode === 'login' ? '#000' : '#fff',
              backgroundSize: '200% 100%',
              fontSize: '1.1rem',
              padding: '1.25rem 0',
              minHeight: '62px',
              boxShadow: authMode === 'login'
                ? `0 0 40px ${C.cyan}45, 0 6px 24px rgba(0,0,0,0.45)`
                : `0 0 40px ${C.purple}45, 0 6px 24px rgba(0,0,0,0.45)`,
            }}
          >
            {authMode === 'login' ? '⚡ Login Securely' : '✦ Create Account'}
          </motion.button>
        </Magnetic>

        {authStage === 'inside' && (
          <Magnetic strength={0.35} radius={110}>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ boxShadow: `0 0 40px rgba(255,107,43,0.55)`, scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onEnterSystem}
              className="w-full py-4 rounded-xl font-black uppercase tracking-[0.3em] transition-all mt-3 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${C.orange}, ${C.red})`,
                color: '#fff',
                boxShadow: '0 0 22px rgba(255,51,85,0.25)',
                fontSize: '1.05rem',
              }}
            >
              ⚡ Enter System
            </motion.button>
          </Magnetic>
        )}
      </div>

      {/* Messages */}
      <AnimatePresence>
        {(authError || authMessage) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-5 rounded-xl px-4 py-3 text-xs font-bold leading-relaxed text-center border w-full"
            style={{
              background: authError ? 'rgba(255,51,85,0.08)' : 'rgba(0,255,136,0.07)',
              borderColor: authError ? 'rgba(255,51,85,0.3)' : 'rgba(0,255,136,0.3)',
              color: authError ? C.red : C.green,
            }}
          >
            {authError || authMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner glow BR */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 180, height: 180,
        background: `radial-gradient(circle, ${accentColor}14, transparent 70%)`,
        borderRadius: '50%',
        filter: 'blur(35px)',
        transform: 'translate(30%, 30%)',
        pointerEvents: 'none',
        transition: 'background 0.5s ease',
      }} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   HOMEPAGE COMPONENT
───────────────────────────────────────────── */
const Homepage = ({ onEnterSystem, isAuthenticated, onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState('login');
  const [authStage, setAuthStage] = useState('landing');
  const [authData, setAuthData] = useState({ email: '', password: '', username: '' });
  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [activeTab, setActiveTab] = useState(null);

  const { scrollYProgress } = useScroll();

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const validate = (v) => /\S+@\S+\.\S+/.test(v);
  const resetMsg = () => { setAuthError(''); setAuthMessage(''); };

  const handleSignup = async () => {
    resetMsg();
    const { email, password, username } = authData;
    if (!username.trim()) return setAuthError('Enter a bold username.');
    if (!validate(email)) return setAuthError('Enter a valid email.');
    if (password.length < 8) return setAuthError('Use at least 8 characters.');
    try {
      const res = await fetch(apiUrl('/api/signup'), {
        method: 'POST', headers: jsonHeaders,
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setAuthError(data.error || 'Signup failed.');
      setAuthMessage('Account created! Logging you in…');
      setTimeout(() => { setAuthStage('inside'); onAuthSuccess?.(); onEnterSystem?.(); }, 500);
    } catch { setAuthError('Network error.'); }
  };

  const handleLogin = async () => {
    resetMsg();
    const { email, password } = authData;
    if (!validate(email)) return setAuthError('Enter a valid email.');
    if (!password) return setAuthError('Password is required.');
    try {
      const res = await fetch(apiUrl('/api/login'), {
        method: 'POST', headers: jsonHeaders,
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setAuthError(data.error || 'Login failed.');
      setAuthMessage(`Welcome back, ${data.user.username || 'Oracle Agent'}!`);
      setTimeout(() => { setAuthStage('inside'); onAuthSuccess?.(); onEnterSystem?.(); }, 350);
    } catch { setAuthError('Network error.'); }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (isAuthenticated) {
      setAuthStage('inside');
      setAuthMessage('Session restored. Ready to enter the system.');
    }
  }, [isAuthenticated]);

  return (
    <div className="relative min-h-screen text-white bg-[#020308] font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <PremiumBackground />
      <FloatingParticles />

      {/* Background holographic image */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.12] mix-blend-screen z-0 overflow-hidden">
        <img
          src={backgroImage}
          alt="Holographic Grid Backdrop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020308]/30 via-[#020308]/50 to-[#020308]/80" />
      </div>

      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* NAV TAB PANEL — slides down below navbar */}
      <div className="fixed top-[72px] left-0 right-0 z-40 px-8 sm:px-16 lg:px-24 xl:px-32">
        <div className="max-w-7xl mx-auto">
          <NavTabPanel activeTab={activeTab} />
        </div>
      </div>

      {/* ════════════════════════════════════════
          HERO SECTION — Two-column centered
      ════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 z-20 overflow-hidden">
        <HeroBackground />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 sm:px-16 lg:px-24 xl:px-32">
          {/* Two-column grid — equal visual weight */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center justify-items-center w-full">

            {/* ── LEFT COLUMN: Hero copy ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="flex flex-col items-start space-y-8 max-w-xl w-full lg:justify-self-start"
            >
              {/* Status badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 rounded-full px-5 py-2.5"
                style={{
                  background: 'rgba(0,245,255,0.06)',
                  border: '1px solid rgba(0,245,255,0.18)',
                  boxShadow: `0 0 25px rgba(0,245,255,0.07)`,
                }}
              >
                <div className="w-2 h-2 rounded-full animate-pulse bg-cyan-400"
                  style={{ boxShadow: `0 0 10px #00f5ff` }} />
                <span className="text-xs font-black uppercase tracking-[0.28em] text-cyan-400 font-mono">
                  CodeOracle Core Online
                </span>
              </motion.div>

              {/* Headline */}
              <div className="space-y-3 w-full">
                <h1
                  className="text-5xl md:text-6xl lg:text-[5rem] font-black tracking-tight leading-[0.9] uppercase"
                  style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400"
                    style={{ filter: 'drop-shadow(0 0 20px rgba(0,245,255,0.3))' }}>
                    ARCHITECT
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400"
                    style={{ filter: 'drop-shadow(0 0 25px rgba(155,89,255,0.3))' }}>
                    THE FUTURE
                  </span>
                </h1>
                <p className="text-lg lg:text-xl leading-relaxed text-white/65 max-w-lg font-light tracking-wide">
                  An intelligent software architecture platform engineered to visualize, optimize, and secure modern systems at enterprise scale.
                </p>
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    y: -4,
                    boxShadow: `0 0 45px rgba(0,245,255,0.7), 0 0 20px rgba(0,245,255,0.4)`
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('system-access').scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-2xl px-9 py-4 font-black uppercase tracking-[0.2em] text-base transition-all bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 text-black shadow-[0_0_28px_rgba(0,245,255,0.35)] cursor-pointer"
                >
                  ⚡ Access System
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    y: -4,
                    borderColor: 'rgba(155,89,255,0.6)',
                    boxShadow: `0 0 35px rgba(155,89,255,0.3)`,
                    color: '#ffffff'
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => document.getElementById('core-modules').scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-2xl px-9 py-4 font-black uppercase tracking-[0.2em] text-base transition-all border-2 border-white/20 bg-white/[0.05] backdrop-blur-md text-white/80 cursor-pointer"
                >
                  ✦ Explore Modules
                </motion.button>
              </motion.div>

              {/* Stat pills */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                {[
                  { label: 'Pattern Detection', val: '99.7%', color: C.cyan },
                  { label: 'Modules Active', val: '24/7', color: C.purple },
                  { label: 'Threat Score', val: 'A+', color: C.green },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg"
                    style={{
                      background: `${stat.color}08`,
                      border: `1px solid ${stat.color}20`,
                    }}>
                    <span className="text-sm font-black" style={{ color: stat.color }}>{stat.val}</span>
                    <span className="text-[11px] text-white/35 uppercase tracking-widest font-mono">{stat.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* ── RIGHT COLUMN: 3D Visualization ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex flex-col items-center justify-center gap-8 w-full lg:justify-self-end"
            >
              {/* Architecture viz */}
              <div className="w-full flex justify-center">
                <ArchitectureVisualization />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          COGNITIVE ARCHITECTURE SECTION
      ════════════════════════════════════════ */}
      <section
        id="system-access"
        className="relative py-28 z-30 border-t border-white/5 overflow-hidden"
        style={{ background: 'linear-gradient(to bottom, rgba(2,3,8,0) 0%, rgba(2,3,8,0.8) 30%, rgba(2,3,8,0.95) 100%)' }}
      >
        {/* Rotating holographic globe */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 opacity-[0.06]">
          <svg viewBox="0 0 500 500" className="w-[700px] h-[700px]" style={{ animation: 'spin 80s linear infinite' }}>
            <defs>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </defs>
            <ellipse cx="250" cy="250" rx="240" ry="240" fill="none" stroke="#00f5ff" strokeWidth="0.8" />
            <ellipse cx="250" cy="250" rx="240" ry="80" fill="none" stroke="#00f5ff" strokeWidth="0.5" />
            <ellipse cx="250" cy="250" rx="240" ry="140" fill="none" stroke="#00f5ff" strokeWidth="0.4" />
            <line x1="10" y1="250" x2="490" y2="250" stroke="#00f5ff" strokeWidth="0.4" />
            <line x1="250" y1="10" x2="250" y2="490" stroke="#00f5ff" strokeWidth="0.4" />
            <ellipse cx="250" cy="250" rx="160" ry="60" fill="none" stroke="#9b59ff" strokeWidth="0.4" strokeDasharray="4 6" />
            <ellipse cx="250" cy="250" rx="100" ry="240" fill="none" stroke="#9b59ff" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Quantum flow lines */}
        <svg viewBox="0 0 1200 800" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-[0.10]">
          <defs>
            <linearGradient id="quantum-flow" x1="0" y1="0.5" x2="1" y2="0.5">
              <stop offset="0%" stopColor="#00f5ff" stopOpacity="0" />
              <stop offset="40%" stopColor="#ff6b2b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#9b59ff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M 0,200 Q 300,100 600,250 T 1200,150" fill="none" stroke="url(#quantum-flow)" strokeWidth="1.5" />
          <path d="M 0,450 Q 400,350 700,500 T 1200,400" fill="none" stroke="url(#quantum-flow)" strokeWidth="1" strokeDasharray="6 10" />
          <path d="M 0,650 Q 500,550 800,680 T 1200,600" fill="none" stroke="url(#quantum-flow)" strokeWidth="0.8" strokeDasharray="3 14" />
        </svg>

        {/* Single centered column — everything stacks and centers */}
        <div className="relative z-10 w-full flex flex-col items-center px-6 sm:px-10">

          {/* ── Heading + description — centered ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl w-full mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-5"
              style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
                COGNITIVE ARCHITECTURE
              </span>
            </h2>
            <p className="text-lg text-white/55 leading-relaxed font-light">
              Our neural engines constantly map your services, automatically detecting
              anti-patterns and technical debt before they impact your deployment.
              Welcome to the era of self-healing system design.
            </p>
          </motion.div>

          {/* ── Feature cards — centered row ── */}
          <div id="core-modules" className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl mb-16">
            {[
              { title: 'Neural Analysis', desc: 'Real-time structural heuristics.', icon: Activity, color: C.cyan },
              { title: 'Secure Vault', desc: 'Military-grade encryption.', icon: Shield, color: C.green },
              { title: 'Quantum Flow', desc: 'Zero-latency visual rendering.', icon: Zap, color: C.orange },
              { title: 'Data Matrices', desc: 'Holographic relationship maps.', icon: Database, color: C.purple },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                whileHover={{
                  scale: 1.03,
                  borderColor: feature.color,
                  boxShadow: `0 20px 50px -15px ${feature.color}35, 0 0 15px ${feature.color}20`,
                  y: -6,
                }}
                className="p-8 rounded-2xl cursor-default relative overflow-hidden"
                style={{
                  background: 'rgba(4, 8, 22, 0.7)',
                  backdropFilter: 'blur(30px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: '0 8px 30px -10px rgba(0,0,0,0.6)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${feature.color}12`, border: `1px solid ${feature.color}25` }}
                >
                  <feature.icon size={28} style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-black tracking-wider mb-2 text-white">{feature.title}</h3>
                <p className="text-base text-white/40 leading-relaxed">{feature.desc}</p>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg, transparent, ${feature.color}40, transparent)`,
                }} />
              </motion.div>
            ))}
          </div>

          {/* ── Auth card — centered ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-5 w-full max-w-lg"
          >
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.4em] text-white/25 font-mono mb-2">Quick Access Portal</p>
              <div className="w-16 h-px mx-auto" style={{ background: `linear-gradient(90deg, transparent, ${C.cyan}50, transparent)` }} />
            </div>

            <div className="relative w-full">
              <div className="absolute -inset-8 rounded-[3rem] bg-cyan-500/[0.04] blur-3xl pointer-events-none" />
              <AuthCard
                authMode={authMode} setAuthMode={setAuthMode}
                authData={authData} setAuthData={setAuthData}
                authError={authError} authMessage={authMessage}
                onLogin={handleLogin} onSignup={handleSignup}
                onEnterSystem={onEnterSystem} authStage={authStage}
              />
            </div>

            <svg viewBox="0 0 360 80" className="w-full max-w-[360px] opacity-[0.15]">
              <line x1="40" y1="20" x2="100" y2="20" stroke="#00f5ff" strokeWidth="1" />
              <circle cx="100" cy="20" r="3" fill="none" stroke="#00f5ff" strokeWidth="1" />
              <line x1="100" y1="20" x2="100" y2="50" stroke="#00f5ff" strokeWidth="1" />
              <line x1="100" y1="50" x2="260" y2="50" stroke="#00f5ff" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="260" cy="50" r="3" fill="none" stroke="#9b59ff" strokeWidth="1" />
              <line x1="260" y1="50" x2="260" y2="20" stroke="#9b59ff" strokeWidth="1" />
              <line x1="260" y1="20" x2="320" y2="20" stroke="#9b59ff" strokeWidth="1" />
              <circle cx="40" cy="20" r="2" fill="#00f5ff" />
              <circle cx="320" cy="20" r="2" fill="#9b59ff" />
              <text x="170" y="68" textAnchor="middle" fill="#00f5ff" fontSize="9" fontFamily="monospace" opacity="0.6">SECURE · ENCRYPTED · VERIFIED</text>
            </svg>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Homepage;