import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Cpu, Layers, Network, Shield, Activity, Radio, ChevronRight } from 'lucide-react';

export default function ArchitectureVisualization() {
  const containerRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [coreHovered, setCoreHovered] = useState(false);

  // Live Fluctuating Telemetry Metrics
  const [metrics, setMetrics] = useState({
    singletonLoad: 4.2,
    factoryCount: 12408,
    observerEvents: 245,
    securityLevel: 98.0,
    aiAccuracy: 99.40
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        singletonLoad: parseFloat((4.0 + Math.random() * 0.6).toFixed(1)),
        factoryCount: prev.factoryCount + Math.floor(Math.random() * 3) + 1,
        observerEvents: Math.floor(235 + Math.random() * 25),
        securityLevel: parseFloat((97.8 + Math.random() * 0.4).toFixed(1)),
        aiAccuracy: parseFloat((99.35 + Math.random() * 0.1).toFixed(2))
      }));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Framer motion springs for smooth tilt/parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 100, mass: 0.9 };
  const rxSpring = useSpring(x, springConfig);
  const rySpring = useSpring(y, springConfig);

  // Map mouse positions to 3D rotation angles
  const rotateX = useTransform(rySpring, [-0.5, 0.5], [16, -16]);
  const rotateY = useTransform(rxSpring, [-0.5, 0.5], [-16, 16]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const valX = (e.clientX - rect.left) / rect.width - 0.5;
    const valY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(valX);
    y.set(valY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHoveredNode(null);
    setCoreHovered(false);
  };

  const MODULES = [
    {
      id: 1,
      name: 'Singleton Manager',
      icon: Cpu,
      color: '#00f5ff',
      x: 250, y: 50,
      pctX: '50%', pctY: '10%',
      depth: 55,
      status: 'STABLE',
      line1: `Load: ${metrics.singletonLoad}%`,
      line2: 'Instances: 1'
    },
    {
      id: 2,
      name: 'Factory Engine',
      icon: Layers,
      color: '#ff6b2b',
      x: 430, y: 175,
      pctX: '86%', pctY: '35%',
      depth: 45,
      status: 'BUILDING',
      line1: `Objects: ${(metrics.factoryCount / 1000).toFixed(2)}K`,
      line2: 'Efficiency: 96%'
    },
    {
      id: 3,
      name: 'Observer Network',
      icon: Network,
      color: '#9b59ff',
      x: 360, y: 395,
      pctX: '72%', pctY: '79%',
      depth: 35,
      status: 'LISTENING',
      line1: `Events/sec: ${metrics.observerEvents}`,
      line2: 'Monitoring Active'
    },
    {
      id: 4,
      name: 'Security Vault',
      icon: Shield,
      color: '#00ff88',
      x: 140, y: 395,
      pctX: '28%', pctY: '79%',
      depth: 45,
      status: 'SECURE',
      line1: 'Encryption: AES-256',
      line2: `Threat Detection: ${metrics.securityLevel}%`
    },
    {
      id: 5,
      name: 'AI Analysis Layer',
      icon: Activity,
      color: '#4488ff',
      x: 70, y: 175,
      pctX: '14%', pctY: '35%',
      depth: 55,
      status: 'LEARNING',
      line1: `Accuracy: ${metrics.aiAccuracy}%`,
      line2: 'Learning Active'
    }
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-square max-w-[550px] mx-auto select-none"
      style={{ perspective: 1200 }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse-expand {
          0% { r: 60; opacity: 0.9; stroke-width: 2.5px; }
          50% { opacity: 0.45; }
          100% { r: 240; opacity: 0; stroke-width: 0.5px; }
        }
        .pulse-wave-line-1 {
          animation: pulse-expand 4s cubic-bezier(0.1, 0.8, 0.25, 1) infinite;
        }
        .pulse-wave-line-2 {
          animation: pulse-expand 4s cubic-bezier(0.1, 0.8, 0.25, 1) infinite;
          animation-delay: 1.3s;
        }
        .pulse-wave-line-3 {
          animation: pulse-expand 4s cubic-bezier(0.1, 0.8, 0.25, 1) infinite;
          animation-delay: 2.6s;
        }
        @keyframes rotate-clockwise {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rotate-counter-clockwise {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-ring-fast {
          animation: rotate-clockwise 10s linear infinite;
        }
        .animate-ring-slow {
          animation: rotate-counter-clockwise 22s linear infinite;
        }
        .animate-ring-dashed {
          animation: rotate-clockwise 15s linear infinite;
        }
      `}} />

      {/* ── Background Blur & Ambient Core Radiance ── */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="w-[90%] h-[90%] rounded-full border border-cyan-500/5 absolute animate-ring-dashed opacity-50" style={{ borderStyle: 'dashed' }} />
        <div className="w-[70%] h-[70%] rounded-full border border-purple-500/5 absolute animate-ring-slow opacity-30" />
        <div className="w-[50%] h-[50%] rounded-full bg-cyan-500/[0.02] absolute filter blur-3xl" />
      </div>

      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full relative z-10"
      >
        {/* ════════════════════════════════════════
            SVG CONNECTIONS & PULSE WAVE LAYER
        ════════════════════════════════════════ */}
        <svg
          viewBox="0 0 500 500"
          className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
        >
          <defs>
            <radialGradient id="core-glow-gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.22" />
              <stop offset="60%" stopColor="#9b59ff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#020308" stopOpacity="0" />
            </radialGradient>
            {MODULES.map((m) => (
              <linearGradient key={`grad-${m.id}`} id={`line-grad-${m.id}`} x1="50%" y1="50%" x2={m.pctX} y2={m.pctY}>
                <stop offset="0%" stopColor="#00f5ff" stopOpacity={coreHovered || hoveredNode === m.id ? 0.95 : 0.4} />
                <stop offset="100%" stopColor={m.color} stopOpacity={hoveredNode === m.id ? 0.95 : 0.35} />
              </linearGradient>
            ))}
          </defs>

          {/* Core Ambient Glow Area */}
          <circle cx="250" cy="250" r="180" fill="url(#core-glow-gradient)" />

          {/* Animated concentric pulse waves emitted from Core */}
          <circle cx="250" cy="250" r="60" fill="none" stroke="rgba(0, 245, 255, 0.4)" strokeWidth="1" className="pulse-wave-line-1" />
          <circle cx="250" cy="250" r="60" fill="none" stroke="rgba(155, 89, 255, 0.3)" strokeWidth="1" className="pulse-wave-line-2" />
          <circle cx="250" cy="250" r="60" fill="none" stroke="rgba(0, 255, 136, 0.2)" strokeWidth="1" className="pulse-wave-line-3" />

          {/* Holographic background circuit blueprints */}
          <circle cx="250" cy="250" r="200" fill="none" stroke="rgba(0, 245, 255, 0.05)" strokeWidth="1" strokeDasharray="3 15" />
          <circle cx="250" cy="250" r="140" fill="none" stroke="rgba(155, 89, 255, 0.06)" strokeWidth="1.5" />
          <circle cx="250" cy="250" r="85" fill="none" stroke="rgba(255, 107, 43, 0.04)" strokeWidth="1" strokeDasharray="8 4" />

          {/* Module connection lines & data packet streams */}
          {MODULES.map((m) => {
            const isHovered = hoveredNode === m.id;
            const isAnyHovered = hoveredNode !== null;
            return (
              <g key={`connection-${m.id}`}>
                {/* Underlay glow path */}
                <line
                  x1="250"
                  y1="250"
                  x2={m.x}
                  y2={m.y}
                  stroke={m.color}
                  strokeWidth={isHovered ? 5.5 : 2}
                  className="transition-all duration-300 opacity-30"
                  style={{
                    filter: `blur(${isHovered ? '8px' : '2px'})`,
                  }}
                />

                {/* Main colored gradient line */}
                <line
                  x1="250"
                  y1="250"
                  x2={m.x}
                  y2={m.y}
                  stroke={`url(#line-grad-${m.id})`}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  strokeDasharray={isHovered ? 'none' : '8 12'}
                  className="transition-all duration-300"
                />

                {/* Animated data flow pulses */}
                <circle cx={m.x} cy={m.y} r="2.5" fill="#ffffff" style={{ filter: 'drop-shadow(0 0 4px #fff)' }}>
                  <animateMotion
                    dur={isHovered ? '0.7s' : isAnyHovered ? '2.2s' : '1.5s'}
                    repeatCount="infinity"
                    path={`M 250,250 L ${m.x},${m.y}`}
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* ════════════════════════════════════════
            CENTRAL NODE: CODEORACLE CORE (LARGER)
        ════════════════════════════════════════ */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate3d(-50%, -50%, 80px)`,
            transformStyle: 'preserve-3d',
          }}
          className="z-30 cursor-pointer"
          onMouseEnter={() => setCoreHovered(true)}
          onMouseLeave={() => setCoreHovered(false)}
        >
          <motion.div
            animate={{
              scale: coreHovered ? 1.06 : 1,
            }}
            className="w-32 h-32 rounded-full flex flex-col items-center justify-center relative transition-all duration-500"
            style={{
              background: 'rgba(2, 6, 22, 0.95)',
              backdropFilter: 'blur(40px)',
              border: `1.5px solid ${coreHovered ? '#00f5ff' : 'rgba(0, 245, 255, 0.35)'}`,
              boxShadow: coreHovered 
                ? '0 0 60px rgba(0, 245, 255, 0.65), inset 0 0 35px rgba(0, 245, 255, 0.3)'
                : '0 0 35px rgba(0, 245, 255, 0.25), inset 0 0 20px rgba(0, 245, 255, 0.12)',
            }}
          >
            {/* Spinning decorative HUD frame rings */}
            <div className="absolute inset-[-5px] rounded-full border-[1.5px] border-purple-500/10 border-t-purple-500 animate-ring-fast" />
            <div className="absolute inset-[-12px] rounded-full border border-cyan-500/15 border-b-cyan-500 animate-ring-slow opacity-90" />
            <div className="absolute inset-[-18px] rounded-full border border-white/5 border-l-white/20 border-r-white/20 animate-ring-dashed opacity-60" style={{ borderStyle: 'dashed' }} />

            {/* Glowing Core Content */}
            <Radio size={36} className="text-cyan-400 mb-1.5 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.25em] text-white uppercase text-center leading-none px-2 font-mono">
              ORACLE CORE
            </span>
          </motion.div>
        </div>

        {/* ════════════════════════════════════════
            SATELLITE MODULES (GLASS CARDS WITH LIVE METRICS)
        ════════════════════════════════════════ */}
        {MODULES.map((m) => {
          const Icon = m.icon;
          const isHovered = hoveredNode === m.id;
          
          return (
            <div
              key={m.id}
              onMouseEnter={() => setHoveredNode(m.id)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{
                position: 'absolute',
                top: m.pctY,
                left: m.pctX,
                transform: `translate3d(-50%, -50%, ${isHovered ? m.depth + 25 : m.depth}px)`,
                transformStyle: 'preserve-3d',
                transition: 'transform 0.4s cubic-bezier(0.18, 0.9, 0.3, 1.25)'
              }}
              className="z-20 cursor-pointer"
            >
              {/* Premium Holographic Glass Card */}
              <motion.div
                animate={{
                  y: [0, -7, 0],
                }}
                transition={{
                  duration: 4.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: m.id * 0.45,
                }}
                className="w-48 rounded-2xl relative transition-all duration-300 overflow-hidden"
                style={{
                  padding: '1.125rem',
                  background: isHovered ? 'rgba(3, 8, 28, 0.96)' : 'rgba(2, 4, 15, 0.88)',
                  backdropFilter: 'blur(30px)',
                  border: `1px solid ${isHovered ? m.color : 'rgba(255, 255, 255, 0.08)'}`,
                  boxShadow: isHovered
                    ? `0 20px 45px -12px ${m.color}50, 0 0 20px ${m.color}30`
                    : '0 8px 30px -15px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.02)',
                }}
              >
                {/* Glowing status telemetry dot in corner */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <div 
                    className="w-1.5 h-1.5 rounded-full" 
                    style={{ 
                      background: m.color,
                      boxShadow: `0 0 8px ${m.color}`,
                    }}
                  />
                  {isHovered && (
                    <span className="text-[7px] font-mono font-bold tracking-wider" style={{ color: m.color }}>SYS_OK</span>
                  )}
                </div>

                {/* Icon with glowing backdrop */}
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3.5 transition-colors duration-300"
                  style={{
                    background: isHovered ? `${m.color}20` : 'rgba(255, 255, 255, 0.035)',
                    border: `1px solid ${isHovered ? `${m.color}40` : 'rgba(255, 255, 255, 0.05)'}`,
                  }}
                >
                  <Icon size={20} style={{ color: isHovered ? m.color : '#e2e8ff' }} className={isHovered ? 'animate-pulse' : ''} />
                </div>

                {/* Title */}
                <h4 className="text-xs font-black tracking-wide text-white mb-2 font-sans">
                  {m.name}
                </h4>

                {/* Realistic Live Metric Lines */}
                <div className="flex flex-col gap-1 border-l-2 pl-2" style={{ borderColor: `${m.color}40` }}>
                  <span className="text-[9.5px] font-mono tracking-tight text-white/80 leading-none">
                    {m.line1}
                  </span>
                  <span className="text-[9px] font-mono tracking-tight text-white/50 leading-none">
                    {m.line2}
                  </span>
                </div>

                {/* Sub status row */}
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-[8px] font-bold tracking-widest uppercase font-mono" style={{ color: m.color }}>
                    ● {m.status}
                  </span>
                </div>

                {/* Bottom cyber gradient highlight bar */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] transition-all duration-500" 
                  style={{ 
                    background: `linear-gradient(90deg, transparent, ${m.color}, transparent)`,
                    opacity: isHovered ? 1 : 0.2 
                  }} 
                />
              </motion.div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
