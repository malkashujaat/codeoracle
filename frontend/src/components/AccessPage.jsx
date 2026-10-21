import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import AuthCard from "./AuthCard";
import { apiUrl, jsonHeaders } from "../api";

/**
 * AccessPage – dedicated auth page with a live, functional AuthCard.
 * Props:
 *   onBack          – return to homepage
 *   onEnterSystem   – navigate into the main dashboard
 *   onAuthSuccess   – called on successful login/signup (lifts auth to App)
 */
const AccessPage = ({ onBack, onEnterSystem, onAuthSuccess }) => {
  const [authMode, setAuthMode] = useState("login");
  const [authData, setAuthData] = useState({ email: "", password: "", username: "" });
  const [authError, setAuthError] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authStage, setAuthStage] = useState("landing");

  const validate = (v) => /\S+@\S+\.\S+/.test(v);

  const handleLogin = async () => {
    setAuthError(""); setAuthMessage("");
    if (!validate(authData.email)) return setAuthError("Enter a valid email.");
    if (!authData.password) return setAuthError("Password is required.");
    try {
      const res = await fetch(apiUrl('/api/login'), {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ email: authData.email, password: authData.password }),
      });
      const data = await res.json();
      if (!res.ok) return setAuthError(data.error || "Login failed.");
      setAuthMessage(`Welcome back, ${data.user?.username || "Oracle Agent"}!`);
      setAuthStage("inside");
      onAuthSuccess?.();
      setTimeout(() => onEnterSystem?.(), 500);
    } catch {
      setAuthError("Network error.");
    }
  };

  const handleSignup = async () => {
    setAuthError(""); setAuthMessage("");
    if (!authData.username?.trim()) return setAuthError("Enter a username.");
    if (!validate(authData.email)) return setAuthError("Enter a valid email.");
    if (authData.password?.length < 8) return setAuthError("Use at least 8 characters.");
    try {
      const res = await fetch(apiUrl('/api/signup'), {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({
          username: authData.username,
          email: authData.email,
          password: authData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setAuthError(data.error || "Signup failed.");
      setAuthMessage("Account created! Logging you in…");
      setAuthStage("inside");
      onAuthSuccess?.();
      setTimeout(() => onEnterSystem?.(), 500);
    } catch {
      setAuthError("Network error.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen text-white font-sans bg-[#020308] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[100px]"
          style={{ background: 'radial-gradient(circle, #00f5ff, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[100px]"
          style={{ background: 'radial-gradient(circle, #9b59ff, transparent 70%)' }} />
      </div>

      {/* Back button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur text-white/60 hover:text-white transition-colors"
        aria-label="Back"
      >
        <ArrowLeft size={16} />
        <span className="text-xs font-black uppercase tracking-widest">Back</span>
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-center mb-10"
      >
        <p className="text-[10px] uppercase tracking-[0.45em] font-black mb-3"
          style={{ color: 'rgba(0,245,255,0.5)', fontFamily: 'monospace' }}>
          CodeOracle · Secure Portal
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-wide"
          style={{ fontFamily: "Orbitron, sans-serif" }}>
          <span style={{ color: '#00f5ff' }}>SYSTEM</span>{' '}
          <span className="text-white">ACCESS</span>
        </h1>
        <p className="mt-3 text-sm text-white/40 font-light max-w-sm mx-auto leading-relaxed">
          Authenticate to enter the CodeOracle intelligence platform.
        </p>
      </motion.div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="w-full px-4"
        style={{ maxWidth: '480px' }}
      >
        <AuthCard
          authMode={authMode}
          setAuthMode={setAuthMode}
          authData={authData}
          setAuthData={setAuthData}
          authError={authError}
          authMessage={authMessage}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onEnterSystem={onEnterSystem}
          authStage={authStage}
        />
      </motion.div>

      {/* Bottom label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-[10px] uppercase tracking-[0.35em] text-white/15 font-mono"
      >
        SECURE · ENCRYPTED · VERIFIED
      </motion.p>
    </motion.div>
  );
};

export default AccessPage;
