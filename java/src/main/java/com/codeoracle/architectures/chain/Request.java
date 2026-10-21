package com.codeoracle.architectures.chain;

import com.codeoracle.architectures.adapter.DataAdapter;
import com.codeoracle.architectures.ai.AIService;
import com.codeoracle.models.ProjectFile;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

public class Request {
    private String action;
    private List<ProjectFile> files = new ArrayList<>();
    private ProjectFile activeFile;
    private boolean dbConnected;
    private AIService aiService;
    private DataAdapter adapter;
    private Consumer<String> onChunk;
    private StringBuilder output = new StringBuilder();
    private Map<String,Object> historyItem;

    public static class Payload {
        private List<ProjectFile> files;
        private ProjectFile activeFile;
        private boolean dbConnected;

        public Payload(List<ProjectFile> files, ProjectFile activeFile, boolean dbConnected) {
            this.files = files; this.activeFile = activeFile; this.dbConnected = dbConnected;
        }

        public List<ProjectFile> getFiles() { return files; }
        public ProjectFile getActiveFile() { return activeFile; }
        public boolean isDbConnected() { return dbConnected; }
    }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public List<ProjectFile> getFiles() { return files; }
    public void setFiles(List<ProjectFile> files) { this.files = files; }

    public ProjectFile getActiveFile() { return activeFile; }
    public void setActiveFile(ProjectFile activeFile) { this.activeFile = activeFile; }

    public boolean isDbConnected() { return dbConnected; }
    public void setDbConnected(boolean dbConnected) { this.dbConnected = dbConnected; }

    public AIService getAiService() { return aiService; }
    public void setAiService(AIService aiService) { this.aiService = aiService; }

    public DataAdapter getAdapter() { return adapter; }
    public void setAdapter(DataAdapter adapter) { this.adapter = adapter; }

    public Consumer<String> getOnChunk() { return onChunk; }
    public void setOnChunk(Consumer<String> onChunk) { this.onChunk = onChunk; }

    public void appendOutput(String chunk) { this.output.append(chunk); }
    public String getOutput() { return output.toString(); }

    public Map<String,Object> getHistoryItem() { return historyItem; }
    public void setHistoryItem(Map<String,Object> historyItem) { this.historyItem = historyItem; }
}
