import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";

/**
 * AuthCard – glass-styled authentication form used by both Homepage and AccessPage.
 * Props:
 *   authMode ("login" | "signup") – current mode.
 *   setAuthMode – switch between login/signup.
 *   authData – { email, password, username } state object.
 *   setAuthData – state setter for authData.
 *   authError – error message string.
 *   authMessage – informational message string.
 *   onLogin – callback when user clicks the Login button.
 *   onSignup – callback when user clicks the Sign-up button.
 *   onEnterSystem – optional callback for the "System Access" button.
 *   authStage – visual stage marker (e.g., "landing").
 */
const AuthCard = ({
  authMode,
  setAuthMode,
  authData,
  setAuthData,
  authError,
  authMessage,
  onLogin,
  onSignup,
  onEnterSystem,
  authStage,
}) => {
  const [focusField, setFocusField] = useState("");

  const accentColor = authMode === "login" ? "#00f5ff" : "#9b59ff";

  const inputStyle = (field) => ({
    width: "100%",
    background: focusField === field ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)",
    border: `1px solid ${focusField === field ? accentColor + "70" : "rgba(255,255,255,0.08)"}`,
    borderRadius: "0.65rem",
    padding: "0.75rem 1rem 0.75rem 2.5rem",
    color: "#ffffff",
    fontSize: "0.875rem",
    outline: "none",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: focusField === field ? `0 0 16px ${accentColor}18` : "none",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative rounded-[2rem] overflow-hidden"
      style={{
        background: "rgba(4, 8, 22, 0.75)",
        backdropFilter: "blur(40px) saturate(180%)",
        border: `1px solid ${accentColor}18`,
        boxShadow:
          authMode === "login"
            ? "0 30px 80px -20px rgba(0,245,255,0.12), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 1px rgba(255,255,255,0.08)"
            : "0 30px 80px -20px rgba(155,89,255,0.12), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 1px rgba(255,255,255,0.08)",
        padding: "2rem 1.75rem",
        width: "100%",
        maxWidth: "360px",
        transition: "box-shadow 0.5s ease, border-color 0.5s ease",
      }}
    >
      {/* Top shimmer */}
      <div
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "1px",
          background:
            authMode === "login"
              ? "linear-gradient(90deg, transparent, rgba(0,245,255,0.5), rgba(0,245,255,0.15), transparent)"
              : "linear-gradient(90deg, transparent, rgba(155,89,255,0.5), rgba(155,89,255,0.15), transparent)",
          transition: "background 0.5s ease",
        }}
      />

      {/* Top-left glow */}
      <div
        style={{
          position: "absolute",
          top: -30, left: -30,
          width: 160, height: 160,
          background:
            authMode === "login"
              ? "radial-gradient(circle, rgba(0,245,255,0.07), transparent 70%)"
              : "radial-gradient(circle, rgba(155,89,255,0.07), transparent 70%)",
          pointerEvents: "none",
          transition: "background 0.5s ease",
        }}
      />

      {/* Label */}
      <p
        className="text-[9px] uppercase tracking-[0.5em] font-extrabold mb-4 text-center font-mono"
        style={{ color: `${accentColor}80` }}
      >
        SYSTEM AUTHENTICATION
      </p>

      {/* Login / Signup tabs */}
      <div
        className="flex rounded-xl p-1 mb-5"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        {["login", "signup"].map((mode) => (
          <button
            key={mode}
            onClick={() => setAuthMode(mode)}
            className="flex-1 py-2.5 rounded-lg font-black uppercase tracking-[0.2em] transition-all cursor-pointer"
            style={{
              fontSize: "0.7rem",
              background:
                authMode === mode
                  ? mode === "login"
                    ? "#00f5ff"
                    : "linear-gradient(135deg, #9b59ff, #cc44ff)"
                  : "transparent",
              color: authMode === mode ? (mode === "login" ? "#000" : "#fff") : "rgba(255,255,255,0.3)",
              boxShadow:
                authMode === mode
                  ? mode === "login"
                    ? "0 0 18px rgba(0,245,255,0.5)"
                    : "0 0 18px rgba(155,89,255,0.5)"
                  : "none",
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Input fields */}
      <div className="space-y-3.5 mb-5">
        {authMode === "signup" && (
          <div>
            <label className="block text-[9px] uppercase tracking-[0.35em] font-extrabold mb-1.5 text-white/35 font-mono">
              Vault Username
            </label>
            <div className="relative">
              <User
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
                  focusField === "username" ? "text-purple-400" : "text-white/20"
                }`}
              />
              <input
                type="text"
                placeholder="Oracle Agent"
                value={authData.username || ""}
                onChange={(e) => setAuthData({ ...authData, username: e.target.value })}
                onFocus={() => setFocusField("username")}
                onBlur={() => setFocusField("")}
                style={inputStyle("username")}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-[9px] uppercase tracking-[0.35em] font-extrabold mb-1.5 text-white/35 font-mono">
            Email Address
          </label>
          <div className="relative">
            <Mail
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
                focusField === "email"
                  ? authMode === "login" ? "text-cyan-400" : "text-purple-400"
                  : "text-white/20"
              }`}
            />
            <input
              type="email"
              placeholder="name@domain.com"
              value={authData.email || ""}
              onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
              onFocus={() => setFocusField("email")}
              onBlur={() => setFocusField("")}
              style={inputStyle("email")}
            />
          </div>
        </div>

        <div>
          <label className="block text-[9px] uppercase tracking-[0.35em] font-extrabold mb-1.5 text-white/35 font-mono">
            Password
          </label>
          <div className="relative">
            <Lock
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors ${
                focusField === "password"
                  ? authMode === "login" ? "text-cyan-400" : "text-purple-400"
                  : "text-white/20"
              }`}
            />
            <input
              type="password"
              placeholder={authMode === "login" ? "Enter passphrase" : "Create secure key"}
              value={authData.password || ""}
              onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
              onFocus={() => setFocusField("password")}
              onBlur={() => setFocusField("")}
              style={inputStyle("password")}
            />
          </div>
        </div>
      </div>

      {/* Error / success message */}
      <AnimatePresence>
        {(authError || authMessage) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mb-4 rounded-xl px-4 py-3 text-[10px] font-bold leading-relaxed text-center border"
            style={{
              background: authError ? "rgba(255,51,85,0.08)" : "rgba(0,255,136,0.07)",
              borderColor: authError ? "rgba(255,51,85,0.3)" : "rgba(0,255,136,0.3)",
              color: authError ? "#ff3355" : "#00ff88",
            }}
          >
            {authError || authMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex flex-col space-y-2.5">
        <motion.button
          whileHover={{
            scale: 1.02,
            boxShadow: `0 0 40px ${authMode === "login" ? "#00f5ff" : "#9b59ff"}55, 0 0 15px ${authMode === "login" ? "#00f5ff" : "#9b59ff"}30`,
          }}
          whileTap={{ scale: 0.96 }}
          onClick={authMode === "login" ? onLogin : onSignup}
          className="px-8 py-3.5 rounded-xl font-black uppercase tracking-[0.2em] shadow-lg cursor-pointer"
          style={{
            fontSize: "0.75rem",
            background:
              authMode === "login"
                ? "linear-gradient(135deg, #00f5ff, #00e5d4, #00f5ff)"
                : "linear-gradient(135deg, #9b59ff, #cc44ff, #4488ff)",
            color: authMode === "login" ? "#000" : "#fff",
            transition: "all 0.3s ease",
          }}
        >
          {authMode === "login" ? "⚡ Login Securely" : "✦ Create Account"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}
          className="px-8 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-white/60 border border-white/10 bg-white/[0.03] cursor-pointer hover:bg-white/[0.06] hover:text-white transition-all"
          style={{ fontSize: "0.65rem" }}
        >
          Switch to {authMode === "login" ? "Sign Up" : "Login"}
        </motion.button>

        {onEnterSystem && (
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 35px rgba(155,89,255,0.4)" }}
            whileTap={{ scale: 0.96 }}
            onClick={onEnterSystem}
            className="px-8 py-3.5 rounded-xl font-black uppercase tracking-[0.2em] bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg cursor-pointer"
            style={{ fontSize: "0.75rem" }}
          >
            ⚡ System Access
          </motion.button>
        )}
      </div>

      {/* Bottom-right corner glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0, right: 0,
          width: 150, height: 150,
          background: `radial-gradient(circle, ${accentColor}12, transparent 70%)`,
          borderRadius: "50%",
          filter: "blur(30px)",
          transform: "translate(30%, 30%)",
          pointerEvents: "none",
          transition: "background 0.5s ease",
        }}
      />
    </motion.div>
  );
};

export default AuthCard;
