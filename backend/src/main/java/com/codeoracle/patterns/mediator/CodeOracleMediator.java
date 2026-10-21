package com.codeoracle.patterns.mediator;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.codeoracle.patterns.adapter.AiRequestAdapter;
import com.codeoracle.patterns.composite.DirectoryNode;
import com.codeoracle.patterns.composite.FileNode;
import com.codeoracle.patterns.factory.ResponseFactory;
import com.codeoracle.patterns.singleton.SystemCore;
import com.codeoracle.services.DbService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.MessageDigest;
import java.util.*;

@Component
public class CodeOracleMediator implements SystemMediator {

    private final DbService    dbService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient   httpClient   = HttpClient.newHttpClient();

    public CodeOracleMediator(DbService dbService) {
        this.dbService = dbService;
    }

    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(password.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                String h = Integer.toHexString(0xff & b);
                if (h.length() == 1) sb.append('0');
                sb.append(h);
            }
            return sb.toString();
        } catch (Exception e) { throw new RuntimeException(e); }
    }

    private String generateToken(Map<String, Object> user) {
        String secret = SystemCore.getInstance().getConfig("JWT_SECRET");
        Algorithm alg = Algorithm.HMAC256(secret);
        return JWT.create()
                .withClaim("id",       Objects.toString(user.get("id"), ""))
                .withClaim("email",    (String) user.get("email"))
                .withClaim("username", (String) user.get("username"))
                .withExpiresAt(new Date(System.currentTimeMillis() + 2 * 3600 * 1000))
                .sign(alg);
    }

    @Override
    public ResponseEntity<?> handleGetFiles() {
        try {
            List<Map<String, Object>> files = dbService.findAllFiles();

            DirectoryNode workspace = new DirectoryNode("root");
            for (Map<String, Object> f : files) {
                workspace.addComponent(new FileNode(
                    str(f, "name"), str(f, "content"), str(f, "language")));
            }
            workspace.printStructure("");

            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseFactory.createError(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> handleSaveFile(Map<String, Object> payload) {
        try {
            String id       = (String) payload.get("id");
            String name     = (String) payload.get("name");
            String content  = (String) payload.get("content");
            String language = (String) payload.get("language");

            if (id == null || name == null) {
                return ResponseFactory.createError(HttpStatus.BAD_REQUEST, "id and name are required");
            }
            System.out.println("[SYNC] Saving: " + name);
            dbService.saveOrUpdateFile(id, name, content, language);
            return ResponseFactory.createSuccess("Saved successfully");
        } catch (Exception e) {
            return ResponseFactory.createError(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> handleSaveAnalysis(Map<String, Object> payload) {
        try {
            String fileId  = (String) payload.get("file_id");
            String type    = (String) payload.get("type");
            String result  = (String) payload.get("result");

            if (fileId == null || type == null || result == null) {
                return ResponseFactory.createError(HttpStatus.BAD_REQUEST, "file_id, type and result are required");
            }
            dbService.insertAnalysis(fileId, type, result);
            return ResponseFactory.createSuccess("Analysis archived");
        } catch (Exception e) {
            return ResponseFactory.createError(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> handleSignup(Map<String, String> payload) {
        String username = payload.get("username");
        String email    = payload.get("email");
        String password = payload.get("password");

        if (username == null || email == null || password == null) {
            return ResponseFactory.createError(HttpStatus.BAD_REQUEST, "All fields required.");
        }
        try {
            if (dbService.findUserByEmail(email) != null) {
                return ResponseFactory.createError(HttpStatus.CONFLICT, "Email already registered.");
            }
            dbService.insertUser(username, email, hashPassword(password));

            Map<String, Object> user = new HashMap<>();
            user.put("id",       dbService.getLastInsertId());
            user.put("username", username);
            user.put("email",    email);

            Map<String, Object> res = new HashMap<>();
            res.put("token", generateToken(user));
            res.put("user",  Map.of("username", username, "email", email));
            return ResponseFactory.createSuccess(res);
        } catch (Exception e) {
            return ResponseFactory.createError(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> handleLogin(Map<String, String> payload) {
        String email    = payload.get("email");
        String password = payload.get("password");

        if (email == null || password == null) {
            return ResponseFactory.createError(HttpStatus.BAD_REQUEST, "Email and password required.");
        }
        try {
            Map<String, Object> user = dbService.findUserByEmail(email);
            if (user == null || !hashPassword(password).equals(user.get("password_hash"))) {
                return ResponseFactory.createError(HttpStatus.UNAUTHORIZED, "Invalid credentials.");
            }
            Map<String, Object> res = new HashMap<>();
            res.put("token", generateToken(user));
            res.put("user",  Map.of("username", user.get("username"), "email", user.get("email")));
            return ResponseFactory.createSuccess(res);
        } catch (Exception e) {
            return ResponseFactory.createError(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> handleAiProxy(Map<String, Object> payload) {
        String serverKey = SystemCore.getInstance().getConfig("AI_API_KEY");
        String clientKey = (String) payload.get("apiKey");
        String key = (serverKey != null && !serverKey.isEmpty()) ? serverKey
                   : (clientKey != null ? clientKey.trim() : "");

        if (key.isEmpty()) {
            return ResponseFactory.createError(HttpStatus.BAD_REQUEST,
                    "AI key not configured. Set ANTHROPIC_API_KEY env variable or enter one in Settings.");
        }
        if ("demo".equalsIgnoreCase(key)) {
            Map<String, Object> res = new HashMap<>();
            res.put("output", "## Demo Mode\n\nSet `ANTHROPIC_API_KEY` as an environment variable or enter a real key in the Settings panel.");
            return ResponseFactory.createSuccess(res);
        }

        try {
            Map<String, Object> anthropicPayload = AiRequestAdapter.adaptToAnthropicFormat(payload);
            String body = objectMapper.writeValueAsString(anthropicPayload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.anthropic.com/v1/messages"))
                    .header("Content-Type",      "application/json")
                    .header("Accept",            "application/json")
                    .header("x-api-key",         key)
                    .header("anthropic-version", "2024-11-06")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                return ResponseFactory.createError(
                    HttpStatus.valueOf(response.statusCode()),
                    "AI proxy error: " + response.body()
                );
            }

            Map<?, ?> responseMap = objectMapper.readValue(response.body(), Map.class);
            String output = "";
            if (responseMap.containsKey("content")) {
                List<?> content = (List<?>) responseMap.get("content");
                if (!content.isEmpty() && content.get(0) instanceof Map) {
                    Object text = ((Map<?, ?>) content.get(0)).get("text");
                    if (text != null) output = text.toString();
                }
            }

            if (output.isEmpty()) {
                return ResponseFactory.createError(HttpStatus.BAD_GATEWAY, "AI proxy returned no output.");
            }

            Map<String, Object> res = new HashMap<>();
            res.put("output", output);
            return ResponseFactory.createSuccess(res);

        } catch (Exception e) {
            return ResponseFactory.createError(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    private String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? v.toString() : "";
    }
}
