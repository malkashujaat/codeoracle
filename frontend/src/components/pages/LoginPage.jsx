import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { apiUrl, jsonHeaders } from '../../api';
import {
  Activity, Mail, Lock, User, Eye, EyeOff, CheckCircle,
  Shield, Zap, BarChart2, Brain, Cpu, Cloud, ArrowRight,
  HeadphonesIcon, Star
} from 'lucide-react';

const C = {
  cyan: '#00f5ff',
  teal: '#00e5d4',
  green: '#00ff88',
  red: '#ff3355',
  purple: '#9b59ff',
  dark: '#020912',
};

/* ─── Animated Neural Network (Right Panel) ─── */
function NeuralNetwork() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;

    const nodes = Array.from({ length: 28 }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.5 + 1.5,
      pulse: Math.random() * Math.PI * 2,
    }));

    // Shield hexagon nodes (highlighted)
    const shieldNodes = [3, 7, 12, 18, 23];

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.012;

      // Draw shield glow in center
      const cx = W / 2, cy = H / 2 - 10;
      const shieldGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
      shieldGrad.addColorStop(0, 'rgba(0,245,255,0.07)');
      shieldGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = shieldGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 120, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring
      ctx.beginPath();
      ctx.arc(cx, cy, 110, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,245,255,0.08)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 8]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Inner ring
      ctx.beginPath();
      ctx.arc(cx, cy, 75, -Math.PI / 2 + t * 0.3, -Math.PI / 2 + t * 0.3 + Math.PI * 1.5);
      ctx.strokeStyle = `rgba(0,245,255,${0.15 + Math.sin(t) * 0.05})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Shield icon in center
      drawShield(ctx, cx, cy, 42, t);

      // Move & draw nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.pulse += 0.03;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      // Draw edges
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return;
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.22;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,245,255,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((n, i) => {
        const isSpecial = shieldNodes.includes(i);
        const glow = isSpecial ? 0.9 + Math.sin(n.pulse) * 0.3 : 0.5;
        const nodeGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3);
        nodeGrad.addColorStop(0, `rgba(0,245,255,${glow * 0.8})`);
        nodeGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = nodeGrad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = isSpecial ? `rgba(0,245,255,${glow})` : `rgba(0,229,212,${glow * 0.7})`;
        ctx.fill();
      });

      // Animated data packet
      const packetProgress = (t * 0.4) % 1;
      const p1 = nodes[2], p2 = nodes[15];
      if (p1 && p2) {
        const px = p1.x + (p2.x - p1.x) * packetProgress;
        const py = p1.y + (p2.y - p1.y) * packetProgress;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = C.cyan;
        ctx.shadowBlur = 10;
        ctx.shadowColor = C.cyan;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}

function drawShield(ctx, cx, cy, size, t) {
  const pulse = 0.7 + Math.sin(t * 1.5) * 0.2;
  // Glow
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 1.4);
  g.addColorStop(0, `rgba(0,245,255,${pulse * 0.25})`);
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 1.4, 0, Math.PI * 2);
  ctx.fill();

  // Shield path
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.bezierCurveTo(cx + size * 0.85, cy - size * 0.7, cx + size * 0.85, cy + size * 0.1, cx, cy + size);
  ctx.bezierCurveTo(cx - size * 0.85, cy + size * 0.1, cx - size * 0.85, cy - size * 0.7, cx, cy - size);
  ctx.strokeStyle = `rgba(0,245,255,${pulse})`;
  ctx.lineWidth = 2;
  ctx.stroke();

  // Checkmark
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.3, cy);
  ctx.lineTo(cx - size * 0.05, cy + size * 0.28);
  ctx.lineTo(cx + size * 0.35, cy - size * 0.25);
  ctx.strokeStyle = `rgba(0,245,255,${pulse})`;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

/* ─── Floating Orbs Background ─── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,245,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.5) 1px,transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
      {/* Orbs */}
      {[
        { w: 600, h: 600, top: '-15%', left: '-10%', color: 'rgba(0,245,255,0.06)', dur: 8 },
        { w: 700, h: 700, top: '40%', right: '-15%', color: 'rgba(0,229,212,0.05)', dur: 11 },
        { w: 400, h: 400, top: '60%', left: '20%', color: 'rgba(0,245,255,0.04)', dur: 6 },
        { w: 300, h: 300, top: '10%', right: '25%', color: 'rgba(0,229,212,0.05)', dur: 9 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.w, height: orb.h,
            top: orb.top, left: orb.left, right: orb.right,
            background: `radial-gradient(circle,${orb.color},transparent 65%)`,
            filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {/* Bottom wave */}
      <svg className="absolute bottom-0 left-0 w-full opacity-[0.12]" viewBox="0 0 1440 180" preserveAspectRatio="none">
        <path d="M0,80 Q360,160 720,80 T1440,80 L1440,180 L0,180 Z" fill="rgba(0,245,255,0.15)" />
        <path d="M0,120 Q360,60 720,120 T1440,120 L1440,180 L0,180 Z" fill="rgba(0,229,212,0.08)" />
      </svg>
    </div>
  );
}

/* ─── Feature Card (Left Panel) ─── */
function FeatureCard({ icon: Icon, title, desc, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ x: 6, borderColor: `${color}40`, boxShadow: `0 8px 30px -8px ${color}25` }}
      className="flex items-start gap-4 p-4 rounded-2xl transition-all cursor-default"
      style={{ background: 'rgba(0,245,255,0.03)', border: '1px solid rgba(0,245,255,0.08)' }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}12`, border: `1px solid ${color}25` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-sm font-black mb-1 tracking-wide" style={{ color: 'rgba(220,240,255,0.9)' }}>{title}</p>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(140,200,220,0.45)' }}>{desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function LoginPage({ onBack, onSuccess }) {
  const [mode, setMode] = useState('login');
  const [data, setData] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focus, setFocus] = useState('');
  const [remember, setRemember] = useState(false);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouse = useCallback((e) => {
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    mouseX.set((e.clientX - cx) / cx * 12);
    mouseY.set((e.clientY - cy) / cy * 12);
  }, [mouseX, mouseY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [handleMouse]);

  const accent = mode === 'login' ? C.cyan : C.purple;
  const validate = v => /\S+@\S+\.\S+/.test(v);

  const inputCls = (field) => ({
    width: '100%',
    background: focus === field ? 'rgba(0,245,255,0.04)' : 'rgba(255,255,255,0.025)',
    border: `1.5px solid ${focus === field ? C.cyan + '60' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: '0.875rem',
    padding: '0.95rem 1rem 0.95rem 3rem',
    color: '#fff',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'all 0.25s ease',
    boxShadow: focus === field ? `0 0 0 3px ${C.cyan}12, 0 0 20px ${C.cyan}10` : 'none',
  });

  const handleLogin = async () => {
    setError(''); setMessage('');
    if (!validate(data.email)) return setError('Enter a valid email address.');
    if (!data.password) return setError('Password is required.');
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/login'), {
        method: 'POST', headers: jsonHeaders,
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const d = await res.json();
      if (!res.ok) return setError(d.error || 'Login failed.');
      setMessage(`Welcome back, ${d.user?.username || 'Oracle Agent'}!`);
      onSuccess?.();
    } catch { setError('Network error. Check your connection.'); }
    finally { setLoading(false); }
  };

  const handleSignup = async () => {
    setError(''); setMessage('');
    if (!data.username?.trim()) return setError('Username is required.');
    if (!validate(data.email)) return setError('Enter a valid email address.');
    if (data.password?.length < 8) return setError('Password must be at least 8 characters.');
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/api/signup'), {
        method: 'POST', headers: jsonHeaders,
        body: JSON.stringify({ username: data.username, email: data.email, password: data.password }),
      });
      const d = await res.json();
      if (!res.ok) return setError(d.error || 'Signup failed.');
      setMessage('Account created! Logging you in…');
      onSuccess?.();
    } catch { setError('Network error. Check your connection.'); }
    finally { setLoading(false); }
  };

  const FEATURES = [
    { icon: Brain, color: C.cyan, title: 'AI Code Analysis', desc: 'Deep neural pattern recognition across your entire codebase' },
    { icon: Shield, color: C.green, title: 'Security Scanning', desc: '256-bit encryption and multi-layer vulnerability detection' },
    { icon: Cpu, color: '#4488ff', title: 'Architecture Detection', desc: 'Auto-detect Singleton, Factory, Observer and 40+ patterns' },
    { icon: Zap, color: C.cyan, title: 'Smart Recommendations', desc: 'AI-generated refactoring and optimization proposals' },
    { icon: Activity, color: C.teal, title: 'Real-time Diagnostics', desc: 'Live performance telemetry and health monitoring' },
  ];

  return (
    <div
      className="relative min-h-screen bg-[#020912] text-white overflow-hidden flex flex-col"
      onMouseMove={handleMouse}
    >
      <FloatingOrbs />

      {/* ── TOP NAV ── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: 'rgba(0,245,255,0.08)' }}
      >
        {/* Logo */}
        <motion.div className="flex items-center gap-3 cursor-pointer" onClick={onBack}
          whileHover={{ scale: 1.02 }}>
          <motion.div
            animate={{ boxShadow: [`0 0 14px ${C.cyan}40`, `0 0 28px ${C.cyan}70`, `0 0 14px ${C.cyan}40`] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `rgba(0,245,255,0.1)`, border: `1px solid ${C.cyan}35` }}>
            <Activity size={20} style={{ color: C.cyan }} />
          </motion.div>
          <div>
            <p className="text-base font-black tracking-[0.25em]" style={{ fontFamily: 'Orbitron, sans-serif', color: C.cyan }}>
              CODEORACLE
            </p>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">Intelligence Platform</p>
          </div>
        </motion.div>

        {/* System status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.15)' }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/30">System Status</p>
            <p className="text-xs font-black tracking-widest" style={{ color: C.green }}>OPERATIONAL</p>
          </div>
        </motion.div>
      </motion.header>

      {/* ── 3-COLUMN BODY ── */}
      <div className="flex-1 relative z-10 flex items-center justify-center px-6 pb-6 pt-4 w-full">
        <div className="w-full grid items-center"
          style={{ maxWidth: '1320px', gridTemplateColumns: '1fr 400px 1fr', gap: '2.5rem' }}>

          {/* ════════════════════
            LEFT PANEL
        ════════════════════ */}
          <motion.div
            style={{ x: springX, y: springY }}
            className="flex flex-col justify-center h-full"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs font-black uppercase tracking-[0.5em] mb-5 font-mono"
              style={{ color: `${C.cyan}60`, letterSpacing: '0.45em' }}>
              SECURE · INTELLIGENT · VERIFIED
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-black leading-[0.95] mb-5"
              style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)' }}
            >
              <span className="block text-white/90">Welcome</span>
              <span className="block text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${C.cyan} 0%, ${C.teal} 50%, #00ff99 100%)`,
                  filter: `drop-shadow(0 0 24px ${C.cyan}70)`,
                }}>
                Back
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="leading-relaxed mb-8 max-w-sm"
              style={{ fontSize: '1rem', color: 'rgba(160,220,255,0.55)', fontWeight: 400 }}
            >
              Access the <span style={{ color: C.cyan, fontWeight: 700 }}>CodeOracle</span> intelligence
              platform and unlock the power of advanced AI‑driven code analytics.
            </motion.p>

            {/* Feature cards */}
            <div className="space-y-3 mb-8">
              {FEATURES.map((f, i) => (
                <FeatureCard key={f.title} {...f} delay={0.45 + i * 0.08} />
              ))}
            </div>

            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex items-center gap-4 p-4 rounded-2xl"
              style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.10)' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(0,245,255,0.08)', border: '1px solid rgba(0,245,255,0.2)' }}>
                <Shield size={22} style={{ color: C.cyan }} />
              </div>
              <div>
                <p className="text-xs text-white/25 font-mono uppercase tracking-widest">Trusted by</p>
                <p className="text-3xl font-black" style={{ color: C.cyan, fontFamily: 'Orbitron, sans-serif' }}>10,000+</p>
                <p className="text-xs font-medium" style={{ color: 'rgba(140,200,220,0.45)' }}>Developers worldwide</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill={C.cyan} style={{ color: C.cyan }} />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ════════════════════
            CENTER PANEL — Login Form
        ════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
            className="relative"
            style={{ width: '420px' }}
          >
            {/* Card glow */}
            <motion.div
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -inset-6 rounded-[3rem] pointer-events-none"
              style={{ background: `radial-gradient(ellipse,${C.cyan}12,transparent 65%)` }}
            />

            <div className="relative rounded-[1.75rem] overflow-hidden"
              style={{
                background: 'rgba(4,12,28,0.88)',
                backdropFilter: 'blur(60px) saturate(180%)',
                border: `1px solid ${C.cyan}20`,
                boxShadow: `0 32px 80px -16px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(0,245,255,0.08)`,
              }}>

              {/* Top shimmer */}
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: `linear-gradient(90deg,transparent,${C.cyan}80,${C.teal}40,transparent)` }}
              />

              <div className="p-8">
                {/* Header */}
                <div className="flex flex-col items-center mb-7">
                  <motion.div
                    animate={{ boxShadow: [`0 0 18px ${C.cyan}40`, `0 0 36px ${C.cyan}70`, `0 0 18px ${C.cyan}40`] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: `rgba(0,245,255,0.08)`, border: `1px solid ${C.cyan}30` }}>
                    <Activity size={26} style={{ color: C.cyan }} />
                  </motion.div>
                  <h2 className="font-black tracking-tight mb-1"
                    style={{ fontSize: '1.65rem', fontFamily: 'Orbitron, sans-serif', color: '#fff' }}>
                    System{' '}
                    <span style={{ color: C.cyan, textShadow: `0 0 20px ${C.cyan}60` }}>Authentication</span>
                  </h2>
                  <p className="text-sm" style={{ color: 'rgba(140,200,220,0.45)', fontWeight: 400 }}>
                    Access the CodeOracle intelligence platform
                  </p>
                </div>

                {/* Mode Tabs */}
                <div className="flex rounded-2xl p-1 mb-7"
                  style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {['login', 'signup'].map(m => (
                    <button key={m}
                      onClick={() => { setMode(m); setError(''); setMessage(''); }}
                      className="flex-1 rounded-xl font-black uppercase tracking-[0.15em] text-sm transition-all cursor-pointer"
                      style={{
                        padding: '0.85rem 0',
                        background: mode === m
                          ? m === 'login'
                            ? `linear-gradient(135deg,${C.cyan},${C.teal})`
                            : `linear-gradient(135deg,${C.purple},#cc44ff)`
                          : 'transparent',
                        color: mode === m ? (m === 'login' ? '#000' : '#fff') : 'rgba(255,255,255,0.35)',
                        boxShadow: mode === m ? `0 4px 20px ${m === 'login' ? C.cyan : C.purple}45` : 'none',
                        transition: 'all 0.25s ease',
                      }}>
                      {m === 'login' ? '⚡ LOGIN' : '✦ SIGN UP'}
                    </button>
                  ))}
                </div>

                {/* Fields */}
                <div className="space-y-4">
                  <AnimatePresence mode="wait">
                    {mode === 'signup' && (
                      <motion.div key="user"
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                        exit={{ opacity: 0, height: 0 }}>
                        <label className="block text-xs uppercase tracking-[0.3em] font-black mb-2 text-white/35 font-mono">
                          Username
                        </label>
                        <div className="relative">
                          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                            style={{ color: focus === 'username' ? C.cyan : 'rgba(255,255,255,0.2)' }} />
                          <input value={data.username}
                            onChange={e => setData({ ...data, username: e.target.value })}
                            onFocus={() => setFocus('username')} onBlur={() => setFocus('')}
                            style={inputCls('username')} placeholder="Oracle Agent" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.3em] font-black mb-2 text-white/35 font-mono">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                        style={{ color: focus === 'email' ? C.cyan : 'rgba(255,255,255,0.2)' }} />
                      <input type="email" value={data.email}
                        onChange={e => setData({ ...data, email: e.target.value })}
                        onFocus={() => setFocus('email')} onBlur={() => setFocus('')}
                        style={inputCls('email')} placeholder="name@domain.com" />
                      {data.email && validate(data.email) && (
                        <CheckCircle size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2"
                          style={{ color: C.green }} />
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs uppercase tracking-[0.3em] font-black text-white/35 font-mono">
                        Password
                      </label>
                      {mode === 'login' && (
                        <button className="text-xs font-black transition-colors"
                          style={{ color: `${C.cyan}70` }}
                          onMouseEnter={e => e.target.style.color = C.cyan}
                          onMouseLeave={e => e.target.style.color = `${C.cyan}70`}>
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                        style={{ color: focus === 'password' ? C.cyan : 'rgba(255,255,255,0.2)' }} />
                      <input type={showPass ? 'text' : 'password'} value={data.password}
                        onChange={e => setData({ ...data, password: e.target.value })}
                        onFocus={() => setFocus('password')} onBlur={() => setFocus('')}
                        style={{ ...inputCls('password'), paddingRight: '3rem' }}
                        placeholder={mode === 'login' ? '••••••••••••' : 'Min 8 characters'} />
                      <button onClick={() => setShowPass(s => !s)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                        style={{ color: 'rgba(255,255,255,0.2)' }}
                        onMouseEnter={e => { e.currentTarget.style.color = C.cyan; }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.2)'; }}>
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remember me */}
                {mode === 'login' && (
                  <div className="flex items-center gap-3 mt-4">
                    <button onClick={() => setRemember(r => !r)}
                      className="w-4 h-4 rounded flex items-center justify-center transition-all flex-shrink-0"
                      style={{
                        background: remember ? C.cyan : 'transparent',
                        border: `1.5px solid ${remember ? C.cyan : 'rgba(255,255,255,0.2)'}`,
                      }}>
                      {remember && <CheckCircle size={10} style={{ color: '#000' }} />}
                    </button>
                    <span className="text-xs text-white/35 font-mono">Remember me</span>
                  </div>
                )}

                {/* Error / Success */}
                <AnimatePresence>
                  {(error || message) && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-4 rounded-xl px-4 py-3 text-sm font-bold text-center flex items-center justify-center gap-2"
                      style={{
                        background: error ? 'rgba(255,51,85,0.08)' : 'rgba(0,255,136,0.07)',
                        border: `1px solid ${error ? 'rgba(255,51,85,0.3)' : 'rgba(0,255,136,0.3)'}`,
                        color: error ? C.red : C.green,
                      }}>
                      {message && <CheckCircle size={14} />}
                      {error || message}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login Button */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2, boxShadow: `0 0 50px ${C.cyan}60, 0 0 20px ${C.cyan}30` }}
                  whileTap={{ scale: 0.97 }}
                  onClick={mode === 'login' ? handleLogin : handleSignup}
                  disabled={loading}
                  className="w-full mt-6 rounded-2xl font-black uppercase tracking-[0.2em] text-base relative overflow-hidden"
                  style={{
                    padding: '1.1rem 0',
                    backgroundImage: loading
                      ? 'none'
                      : mode === 'login'
                        ? `linear-gradient(135deg,${C.cyan},${C.teal},${C.cyan})`
                        : `linear-gradient(135deg,${C.purple},#cc44ff,#4488ff)`,
                    backgroundColor: loading ? `rgba(0,245,255,0.08)` : undefined,
                    backgroundSize: '200% 100%',
                    color: loading ? C.cyan : mode === 'login' ? '#000814' : '#fff',
                    boxShadow: loading ? 'none' : `0 4px 30px ${mode === 'login' ? C.cyan : C.purple}45`,
                    border: loading ? `1px solid ${C.cyan}25` : 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {/* Animated shimmer */}
                  {!loading && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
                      style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)', width: '40%' }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 rounded-full border-2 border-current border-t-transparent" />
                        Authenticating...</>
                    ) : (
                      <><Zap size={16} />
                        {mode === 'login' ? 'LOGIN SECURELY' : 'CREATE ACCOUNT'}
                        <ArrowRight size={16} /></>
                    )}
                  </span>
                </motion.button>

                {/* Security badges */}
                <div className="flex items-center justify-center gap-5 mt-5">
                  {[['🔒', 'Secure'], ['🛡', 'Encrypted'], ['✓', 'Verified']].map(([icon, label]) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <span className="text-xs" style={{ color: `${C.cyan}60` }}>{icon}</span>
                      <span className="text-xs font-black uppercase tracking-widest font-mono" style={{ color: `${C.cyan}50` }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ════════════════════
            RIGHT PANEL — Neural Network
        ════════════════════ */}
          <motion.div
            style={{ x: springX.get() * -0.7, y: springY.get() * -0.7 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="flex flex-col justify-center h-full pl-10 gap-6"
          >
            {/* Neural viz */}
            <div className="relative flex-1 min-h-[380px] max-h-[500px] rounded-3xl overflow-hidden"
              style={{ background: 'rgba(0,245,255,0.02)', border: '1px solid rgba(0,245,255,0.08)' }}>
              {/* Corner brackets */}
              {[['top-3 left-3', 'border-t border-l'], ['top-3 right-3', 'border-t border-r'],
              ['bottom-3 left-3', 'border-b border-l'], ['bottom-3 right-3', 'border-b border-r']].map(([pos, border], i) => (
                <div key={i} className={`absolute ${pos} w-4 h-4 ${border} border-cyan-500/30`} />
              ))}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <motion.p animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2.5, repeat: Infinity }}
                  className="text-xs font-mono uppercase tracking-[0.4em]" style={{ color: `${C.cyan}60` }}>
                  Neural Security Core
                </motion.p>
              </div>
              <NeuralNetwork />
            </div>

            {/* Stats below viz */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: '99.7%', label: 'Detection Rate', color: C.cyan },
                { val: 'AES-256', label: 'Encryption', color: C.green },
                { val: '< 12ms', label: 'Response', color: C.teal },
              ].map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08 }}
                  whileHover={{ y: -3, borderColor: `${s.color}40` }}
                  className="p-4 rounded-2xl text-center transition-all"
                  style={{ background: 'rgba(0,245,255,0.03)', border: '1px solid rgba(0,245,255,0.08)' }}>
                  <p className="text-lg font-black mb-0.5" style={{ color: s.color }}>{s.val}</p>
                  <p className="text-xs text-white/30 font-mono uppercase tracking-wider">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Support link */}
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 px-5 py-3.5 rounded-2xl self-end transition-all"
              style={{ background: 'rgba(0,245,255,0.04)', border: '1px solid rgba(0,245,255,0.1)' }}>
              <HeadphonesIcon size={16} style={{ color: `${C.cyan}70` }} />
              <div className="text-left">
                <p className="text-xs text-white/25 font-mono uppercase tracking-widest">Need help?</p>
                <p className="text-sm font-black" style={{ color: `${C.cyan}80` }}>Contact Support</p>
              </div>
            </motion.button>
          </motion.div>

        </div>{/* end inner grid */}
      </div>{/* end outer flex wrapper */}

      {/* ── FOOTER ── */}
      <motion.footer
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="relative z-10 border-t py-4 px-8 flex items-center justify-between"
        style={{ borderColor: 'rgba(0,245,255,0.06)' }}>
        <p className="text-xs text-white/20 font-mono">© 2026 CodeOracle. All rights reserved.</p>
        <div className="flex items-center gap-6">
          {['Privacy Policy', 'Terms of Service', 'Security'].map(l => (
            <button key={l} className="text-xs font-mono text-white/20 hover:text-white/50 transition-colors">{l}</button>
          ))}
        </div>
      </motion.footer>
    </div>
  );
}
