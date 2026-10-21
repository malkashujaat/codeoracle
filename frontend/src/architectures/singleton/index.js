/**
 * ═══════════════════════════════════════════════════════════
 * 🏛️  SINGLETON PATTERN
 * ═══════════════════════════════════════════════════════════
 * Intent:
 *   Ensure a class has only ONE instance and provide a global
 *   point of access to it.
 *
 * Used in CodeOracle:
 *   - CodeOracleCore.getInstance()  → single shared core controller
 *   - SystemCore.getInstance()      → demo/standalone version
 * ═══════════════════════════════════════════════════════════
 */

// ── Demo / standalone Singleton ──────────────────────────────
export class SystemCore {
    static instance = null;
    constructor() { if (SystemCore.instance) return SystemCore.instance; this.startTime = Date.now(); SystemCore.instance = this; }
    static getInstance() { if (!SystemCore.instance) SystemCore.instance = new SystemCore(); return SystemCore.instance; }
    getSystemUptime() { return ((Date.now() - this.startTime) / 1000).toFixed(2); }
}
export default SystemCore;
