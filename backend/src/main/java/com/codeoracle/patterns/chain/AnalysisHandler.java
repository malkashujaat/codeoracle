package com.codeoracle.patterns.chain;

import com.codeoracle.patterns.adapter.AiRequestAdapter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AnalysisHandler extends RequestHandler {

    @Override
    public void handle(Request request) throws Exception {
        List<Map<String, String>> files = request.getFiles();
        StringBuilder context = new StringBuilder();
        if (files != null) {
            for (Map<String, String> f : files) {
                context.append("### File: ").append(f.getOrDefault("name", "unknown")).append("\n");
                context.append("```").append(f.getOrDefault("language", "text")).append("\n");
                context.append(f.getOrDefault("content", "")).append("\n```\n\n");
            }
        }

        String action      = request.getAction();
        String systemPrompt = getSystemPrompt(action);
        String userPrompt   = "Analyse this codebase:\n\n" + context
                + "\nActive file: " + request.getActiveFile().getOrDefault("name", "unknown");

        Map<String, Object> frontendPayload = new HashMap<>();
        frontendPayload.put("system",   systemPrompt);
        frontendPayload.put("model",    "claude-3-5-sonnet-20241022");
        frontendPayload.put("messages", java.util.List.of(
                Map.of("role", "user", "content", userPrompt)
        ));
        AiRequestAdapter.adaptToAnthropicFormat(frontendPayload);

        System.out.printf("[AnalysisHandler] Prompt length: %d chars%n", userPrompt.length());

        request.setOutput("Analysis complete for: " + request.getActiveFile().getOrDefault("name", "unknown")
                + " | action=" + action);

        passToNext(request);
    }

    private String getSystemPrompt(String action) {
        switch (action) {
            case "diagram":  return "You are an expert software architect. Generate comprehensive Mermaid diagrams.";
            case "optimize": return "You are a performance engineering expert and SDA architect.";
            case "fix":      return "You are an expert debugger and SDA code reviewer.";
            default:         return "You are a senior software architect and SDA expert.";
        }
    }
}
