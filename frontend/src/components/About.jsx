import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';
import { ArrowLeft, Box, Code, Cpu, Database, Network } from 'lucide-react';
import FloatingParticles from './FloatingParticles';

export default function About({ onBack }) {
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
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020308] text-white overflow-hidden font-sans">
      <FloatingParticles />
      
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-900 blur-[150px]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-[#020308]/80 backdrop-blur-md border-b border-white/5">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Hub
        </motion.button>
        <div className="font-black text-xl tracking-widest text-white/50" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          CODEORACLE / ABOUT
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-6xl mx-auto space-y-40">
        {/* Header Section */}
        <section className="text-center space-y-6 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h1 className="text-5xl md:text-7xl font-black tracking-tight" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-orange-400">
                ARCHITECTURE
              </span>
              <br /> REIMAGINED.
            </h1>
            <p className="mt-6 text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
              We build tools for the next generation of engineers. CodeOracle visualizes, optimizes, and secures your software universe in real-time.
            </p>
          </motion.div>
        </section>

        {/* Feature Section 1 */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold tracking-wider text-cyan-400">Software Design Patterns</h2>
            <p className="text-white/60 leading-relaxed text-lg">
              Identify architectural anti-patterns before they become technical debt. Our AI analyzes your entire codebase to recommend structural improvements based on enterprise-grade design principles.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-80 rounded-3xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Box size={64} className="text-purple-400/50 group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
        </section>

        {/* Feature Section 2 */}
        <section className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-80 rounded-3xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-md flex items-center justify-center group md:order-1 order-2"
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Network size={64} className="text-cyan-400/50 group-hover:scale-110 transition-transform duration-500" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 md:order-2 order-1"
          >
            <h2 className="text-3xl font-bold tracking-wider text-purple-400">AI Workflow Visualization</h2>
            <p className="text-white/60 leading-relaxed text-lg">
              Watch your data flow in real-time. We map complex microservices, neural endpoints, and database clusters into beautiful, interactive holographic charts.
            </p>
          </motion.div>
        </section>

        {/* Modules Grid */}
        <section className="space-y-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black tracking-widest text-white/90">SYSTEM MODULES</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Cpu, title: "Neural Processing", color: "text-orange-400" },
              { icon: Database, title: "Data Matrices", color: "text-cyan-400" },
              { icon: Code, title: "Logic Engines", color: "text-purple-400" },
            ].map((module, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default"
              >
                <module.icon size={40} className={`${module.color} mb-6 mx-auto`} />
                <h3 className="text-lg font-bold tracking-wider mb-2">{module.title}</h3>
                <p className="text-sm text-white/40">Automated structural healing and optimization systems online.</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center pb-20">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0,245,255,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-400 font-bold uppercase tracking-[0.2em] transition-all backdrop-blur-md"
          >
            Return To Core Systems
          </motion.button>
        </section>
      </main>
    </div>
  );
}
