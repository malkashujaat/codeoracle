package com.codeoracle.patterns.adapter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AiRequestAdapter {

    @SuppressWarnings("unchecked")
    public static Map<String, Object> adaptToAnthropicFormat(Map<String, Object> payload) {
        String system = (String) payload.getOrDefault("system",
                "You are a helpful AI assistant specialising in software architecture and SDA patterns.");
        String model  = (String) payload.getOrDefault("model", "claude-3-5-sonnet-20241022");

        double temperature = payload.get("temperature") != null
                ? Double.parseDouble(payload.get("temperature").toString()) : 0.7;
        int maxTokens = payload.get("max_tokens") != null
                ? Integer.parseInt(payload.get("max_tokens").toString()) : 4096;

        List<Map<String, Object>> messages = new ArrayList<>();
        List<?> raw = (List<?>) payload.get("messages");
        if (raw != null) {
            for (Object m : raw) {
                if (m instanceof Map) {
                    Map<String, Object> msg = (Map<String, Object>) m;
                    String role = (String) msg.get("role");
                    if ("user".equals(role) || "assistant".equals(role)) {
                        messages.add(msg);
                    }
                }
            }
        }
        if (messages.isEmpty()) {
            messages.add(Map.of("role", "user",
                    "content", payload.getOrDefault("userMessage", "Analyse the code.").toString()));
        }

        Map<String, Object> out = new HashMap<>();
        out.put("model",       model);
        out.put("system",      system);
        out.put("messages",    messages);
        out.put("max_tokens",  maxTokens);
        out.put("temperature", temperature);
        out.put("stream",      false);
        return out;
    }
}
