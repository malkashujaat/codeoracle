package com.codeoracle.patterns.chain;

import java.util.List;
import java.util.Map;

public class Request {

    private String                    action;
    private List<Map<String, String>> files;
    private Map<String, String>       activeFile;
    private String                    output = "";
    private boolean                   dbConnected;
    private Map<String, Object>       historyItem;

    public String getAction()                             { return action; }
    public void   setAction(String action)                { this.action = action; }

    public List<Map<String, String>> getFiles()           { return files; }
    public void setFiles(List<Map<String, String>> files) { this.files = files; }

    public Map<String, String> getActiveFile()                { return activeFile; }
    public void setActiveFile(Map<String, String> activeFile) { this.activeFile = activeFile; }

    public String getOutput()              { return output; }
    public void   setOutput(String output) { this.output = output; }

    public boolean isDbConnected()            { return dbConnected; }
    public void    setDbConnected(boolean db) { this.dbConnected = db; }

    public Map<String, Object> getHistoryItem()          { return historyItem; }
    public void setHistoryItem(Map<String, Object> item) { this.historyItem = item; }
}
