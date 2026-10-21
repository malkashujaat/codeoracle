package com.codeoracle.architectures.chain;

import com.codeoracle.architectures.ai.AIService;
import com.codeoracle.models.ProjectFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class AnalysisHandler extends RequestHandler {
    @Override
    public Request handle(Request request) throws Exception {
        String action = request.getAction();
        List<ProjectFile> files = request.getFiles();
        ProjectFile activeFile = request.getActiveFile();
        AIService aiService = request.getAiService();

        String codeContext = files.stream()
                .map(f -> "### File: " + f.getName() + "\n```" + (f.getLanguage() == null ? "javascript" : f.getLanguage()) + "\n" + f.getContent() + "\n```")
                .collect(Collectors.joining("\n\n"));

        Map<String,String> systemPrompts = new HashMap<>();
        systemPrompts.put("analyze", "You are a senior software architect and SDA expert. Analyze the provided codebase and produce a comprehensive report...");
        systemPrompts.put("diagram", "You are an expert software architect specializing in UML and SDA diagrams. Generate Mermaid diagrams for the provided codebase.");
        systemPrompts.put("optimize", "You are a performance engineering expert. Produce an optimization report.");
        systemPrompts.put("fix", "You are an expert debugger and code reviewer. Analyze and provide fixes.");

        String systemPrompt = systemPrompts.getOrDefault(action, systemPrompts.get("analyze"));
        String input = "Analyze this codebase:\n\n" + codeContext + "\n\nActive file: " + (activeFile != null ? activeFile.getName() : "<none>");

        request.appendOutput("");
        aiService.call(systemPrompt, input, chunk -> request.appendOutput(chunk));

        return super.handle(request);
    }
}
