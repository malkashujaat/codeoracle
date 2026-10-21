/**
 * ═══════════════════════════════════════════════════════════
 * 🏛️  REPOSITORY PATTERN
 * ═══════════════════════════════════════════════════════════
 * Intent:
 *   Mediate between the domain and data mapping layers using
 *   a collection-like interface. Hides all data access logic
 *   behind clean domain methods — callers never write SQL or
 *   fetch calls directly.
 *
 * Used in CodeOracle:
 *   - UserRepository → abstracts MongoDB user collection access
 *     behind findById() / save() / findByEmail() etc.
 * ═══════════════════════════════════════════════════════════
 */

// ── Domain entity ─────────────────────────────────────────────
export class User { constructor(id, name, email) { this.id = id; this.name = name; this.email = email; } }
export class UserRepository {
    constructor(dbConnection) { this.db = dbConnection; }
    async findById(id) { return new User(id, 'John Doe', 'john@codeoracle.io'); }
    async findByEmail(email) { return new User('1', 'Oracle Agent', email); }
    async save(user) { console.log(`[UserRepository] Persisting user "${user.name}" to database...`); return true; }
    async delete(id) { console.log(`[UserRepository] Deleting user id="${id}"...`); return true; }
}
export default UserRepository;
