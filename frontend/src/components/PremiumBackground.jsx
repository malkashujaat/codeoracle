import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Slow falling data packet streams
const DATA_STREAMS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: `${10 + i * 11.5 + Math.random() * 3}%`,
  delay: Math.random() * 8,
  duration: 10 + Math.random() * 12,
  size: 2 + Math.random() * 2,
}));

export default function PremiumBackground() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  // Parallax layers transform speeds
  const gridY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const blueprintY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const particlesY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setMouseOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#020308]">
      {/* CSS stylesheet for background effects */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bg-grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }
        .animated-grid-layer {
          background-image: 
            linear-gradient(rgba(0, 245, 255, 0.05) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(0, 245, 255, 0.05) 1px, transparent 1px);
          background-size: 60px 60px;
          animation: bg-grid-move 16s linear infinite;
        }
        .scanlines-overlay {
          background: linear-gradient(
            rgba(0, 0, 0, 0) 50%, 
            rgba(0, 0, 0, 0.15) 50%
          );
          background-size: 100% 4px;
        }
        @keyframes float-blueprint {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(0.5deg); }
        }
        .floating-blueprint {
          animation: float-blueprint 14s ease-in-out infinite;
        }
        @keyframes data-fall {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 0.5; }
          90% { opacity: 0.5; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .data-packet {
          animation: data-fall 12s linear infinite;
        }
      `}} />

      {/* ── Layer 1: Ambient Glowing Blobs (Deepest) ── */}
      <div className="absolute inset-0 opacity-[0.4]">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full bg-cyan-500/[0.03] filter blur-[120px]"
          style={{
            top: '-15%',
            left: '-10%',
            transform: `translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px)`
          }}
        />
        <div 
          className="absolute w-[900px] h-[900px] rounded-full bg-purple-500/[0.025] filter blur-[140px]"
          style={{
            bottom: '-20%',
            right: '-10%',
            transform: `translate(${mouseOffset.x * -0.3}px, ${mouseOffset.y * -0.3}px)`
          }}
        />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full bg-orange-500/[0.015] filter blur-[110px]"
          style={{
            top: '30%',
            left: '40%',
            transform: `translate(${mouseOffset.x * 0.2}px, ${mouseOffset.y * 0.2}px)`
          }}
        />
      </div>

      {/* ── Layer 2: Moving Holographic Grid ── */}
      <motion.div 
        style={{ 
          y: gridY,
          x: mouseOffset.x * 0.6,
          transform: 'perspective(1000px) rotateX(60deg) scale(2.8) translateY(-18%)',
          transformOrigin: 'top',
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))'
        }}
        className="absolute inset-0 animated-grid-layer opacity-[0.25] z-1"
      />

      {/* ── Layer 3: Flowchart blueprint outlines ── */}
      <motion.div
        style={{ 
          y: blueprintY,
          x: mouseOffset.x * 0.3,
        }}
        className="absolute inset-0 z-2 opacity-[0.06] floating-blueprint hidden lg:block"
      >
        <svg viewBox="0 0 1600 900" className="w-full h-full text-cyan-400 fill-none stroke-current stroke-[1.5]">
          {/* Module block 1 */}
          <rect x="150" y="200" width="140" height="70" rx="8" strokeDasharray="4 4" />
          <text x="220" y="240" fill="currentColor" stroke="none" textAnchor="middle" className="text-[10px] font-mono tracking-widest font-black uppercase">Core Router</text>
          
          <line x1="290" y1="235" x2="390" y2="235" />
          <circle cx="390" cy="235" r="3" fill="currentColor" />

          {/* Decision Node */}
          <path d="M 440,200 L 490,235 L 440,270 L 390,235 Z" />
          <text x="440" y="239" fill="currentColor" stroke="none" textAnchor="middle" className="text-[8px] font-mono tracking-widest font-black uppercase">HEURISTIC</text>

          <line x1="440" y1="270" x2="440" y2="350" strokeDasharray="3 3" />
          <line x1="490" y1="235" x2="590" y2="235" />
          <circle cx="590" cy="235" r="3" fill="currentColor" />

          {/* Module block 2 */}
          <rect x="590" y="200" width="160" height="70" rx="8" />
          <text x="670" y="240" fill="currentColor" stroke="none" textAnchor="middle" className="text-[10px] font-mono tracking-widest font-black uppercase">Analysis Service</text>

          {/* Floating blueprint circles & coordinates */}
          <circle cx="1200" cy="150" r="80" strokeDasharray="2 8" />
          <circle cx="1200" cy="150" r="5" fill="currentColor" />
          <line x1="1200" y1="50" x2="1200" y2="250" strokeWidth="0.5" strokeDasharray="2 2" />
          <line x1="1100" y1="150" x2="1300" y2="150" strokeWidth="0.5" strokeDasharray="2 2" />
          <text x="1290" y="140" fill="currentColor" stroke="none" className="text-[8px] font-mono">SYS_COORD_A92</text>

          {/* Abstract system lines */}
          <path d="M 100,500 L 180,500 L 220,550 L 350,550" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="350" cy="550" r="3" />

          <path d="M 1250,600 L 1350,600 L 1390,650 L 1480,650" strokeWidth="1" />
          <rect x="1480" y="625" width="80" height="50" rx="4" />
          <text x="1520" y="655" fill="currentColor" stroke="none" textAnchor="middle" className="text-[8px] font-mono tracking-wider">VAULT_D4</text>
        </svg>
      </motion.div>

      {/* ── Layer 4: Slow Falling Cyber Data Streams ── */}
      <div className="absolute inset-0 z-3 opacity-[0.2]">
        {DATA_STREAMS.map((stream) => (
          <div
            key={stream.id}
            className="absolute data-packet flex flex-col items-center justify-start text-[8px] font-mono tracking-tighter"
            style={{
              left: stream.left,
              top: '-150px',
              color: '#00f5ff',
              textShadow: '0 0 8px rgba(0, 245, 255, 0.8)',
              animationDelay: `${stream.delay}s`,
              animationDuration: `${stream.duration}s`,
            }}
          >
            <div className="w-[1px] h-[80px] bg-gradient-to-b from-cyan-400 to-transparent" />
            <div 
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping absolute bottom-0"
              style={{
                boxShadow: '0 0 10px #00f5ff',
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Layer 5: CRT Scanlines (Front-most Background Layer) ── */}
      <div className="absolute inset-0 scanlines-overlay opacity-[0.03] z-4" />
    </div>
  );
}
