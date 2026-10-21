package com.codeoracle.services;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.ReplaceOptions;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 🗄️ DB SERVICE — MongoDB via Spring Data MongoTemplate
 *
 * Falls back to a thread-safe in-memory store if MongoDB is
 * not running, so signup / login / file sync always work.
 */
@Service
public class DbService {

    private final MongoTemplate mongoTemplate;

    // ── In-memory fallback ────────────────────────────────────────
    private final Map<String, Map<String, Object>> memFiles    = new ConcurrentHashMap<>();
    private final List<Map<String, Object>>        memAnalysis = Collections.synchronizedList(new ArrayList<>());
    private final Map<String, Map<String, Object>> memUsers    = new ConcurrentHashMap<>();  // keyed by email
    private final AtomicLong                       memIdSeq    = new AtomicLong(1);

    public DbService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    /** Quick liveness check — returns true when MongoDB is reachable. */
    private boolean isDbAvailable() {
        try {
            mongoTemplate.getDb().runCommand(new Document("ping", 1));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private MongoDatabase db()                          { return mongoTemplate.getDb(); }
    private MongoCollection<Document> files()           { return db().getCollection("project_files"); }
    private MongoCollection<Document> analysis()        { return db().getCollection("analysis_history"); }
    private MongoCollection<Document> users()           { return db().getCollection("users"); }

    // ── Files ──────────────────────────────────────────────────────

    public List<Map<String, Object>> findAllFiles() {
        if (isDbAvailable()) {
            try {
                List<Map<String, Object>> result = new ArrayList<>();
                for (Document doc : files().find()) {
                    result.add(docToMap(doc));
                }
                return result;
            } catch (Exception ignored) {}
        }
        return new ArrayList<>(memFiles.values());
    }

    public void saveOrUpdateFile(String id, String name, String content, String language) {
        if (isDbAvailable()) {
            try {
                Document doc = new Document("_id", id)
                        .append("id",       id)
                        .append("name",     name)
                        .append("content",  content  != null ? content  : "")
                        .append("language", language != null ? language : "javascript")
                        .append("updatedAt", new Date());
                files().replaceOne(Filters.eq("_id", id), doc, new ReplaceOptions().upsert(true));
                return;
            } catch (Exception ignored) {}
        }
        // Fallback
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id",       id);
        row.put("name",     name);
        row.put("content",  content  != null ? content  : "");
        row.put("language", language != null ? language : "javascript");
        memFiles.put(id, row);
    }

    // ── Analysis ──────────────────────────────────────────────────

    public void insertAnalysis(String fileId, String type, String result) {
        if (isDbAvailable()) {
            try {
                Document doc = new Document("file_id", fileId)
                        .append("analysis_type", type)
                        .append("result_text",   result)
                        .append("createdAt",     new Date());
                analysis().insertOne(doc);
                return;
            } catch (Exception ignored) {}
        }
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("file_id",       fileId);
        row.put("analysis_type", type);
        row.put("result_text",   result);
        memAnalysis.add(row);
    }

    // ── Users ──────────────────────────────────────────────────────

    public Map<String, Object> findUserByEmail(String email) {
        if (isDbAvailable()) {
            try {
                Document doc = users().find(Filters.eq("email", email)).first();
                if (doc != null) return docToMap(doc);
            } catch (Exception ignored) {}
        }
        return memUsers.get(email);
    }

    public void insertUser(String username, String email, String passwordHash) {
        if (isDbAvailable()) {
            try {
                Document doc = new Document("username", username)
                        .append("email",         email)
                        .append("password_hash", passwordHash)
                        .append("createdAt",     new Date());
                users().insertOne(doc);
                return;
            } catch (Exception ignored) {}
        }
        long id = memIdSeq.getAndIncrement();
        Map<String, Object> user = new LinkedHashMap<>();
        user.put("id",            id);
        user.put("username",      username);
        user.put("email",         email);
        user.put("password_hash", passwordHash);
        memUsers.put(email, user);
    }

    public Long getLastInsertId() {
        // In-memory: return last sequence value
        return memIdSeq.get() - 1;
    }

    // ── Helper ────────────────────────────────────────────────────

    private Map<String, Object> docToMap(Document doc) {
        Map<String, Object> map = new LinkedHashMap<>(doc);
        // Replace BSON _id with string "id" for JSON serialisation
        Object oid = map.remove("_id");
        if (!map.containsKey("id") && oid != null) {
            map.put("id", oid.toString());
        }
        return map;
    }
}
