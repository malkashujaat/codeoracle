package com.codeoracle.patterns.core;

import com.codeoracle.patterns.adapter.DataAdapter;
import com.codeoracle.patterns.chain.ChainBuilder;
import com.codeoracle.patterns.chain.Request;
import com.codeoracle.patterns.chain.RequestHandler;
import com.codeoracle.patterns.composite.ComponentNode;
import com.codeoracle.patterns.composite.DirectoryNode;
import com.codeoracle.patterns.composite.FileNode;
import com.codeoracle.patterns.factory.OracleFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CodeOracleCore {

    private static volatile CodeOracleCore instance;

    private final Map<String, Object> modules = new HashMap<>();
    private final DataAdapter         adapter;
    private final RequestHandler      requestChain;
    private final ComponentNode       uiComposite;

    private CodeOracleCore() {
        this.adapter      = (DataAdapter) OracleFactory.createModule("adapter");
        this.modules.put("ai", OracleFactory.createModule("ai"));
        this.requestChain = ChainBuilder.buildAnalysisChain();
        this.uiComposite  = buildComponentTree();
    }

    public static CodeOracleCore getInstance() {
        if (instance == null) {
            synchronized (CodeOracleCore.class) {
                if (instance == null) instance = new CodeOracleCore();
            }
        }
        return instance;
    }

    public Object      getModule(String name) { return modules.get(name); }
    public DataAdapter getAdapter()           { return adapter; }

    public void handleRequest(Request request) throws Exception {
        requestChain.handle(request);
    }

    public ComponentNode buildComponentTree(List<Map<String, String>> files) {
        DirectoryNode root = new DirectoryNode("workspace");
        if (files != null) {
            for (Map<String, String> f : files) {
                root.addComponent(new FileNode(
                    f.getOrDefault("name",     "unknown"),
                    f.getOrDefault("content",  ""),
                    f.getOrDefault("language", "text")
                ));
            }
        }
        return root;
    }

    public List<Map<String, Object>> getDashboardMetrics() {
        ComponentNode metrics = findNode(uiComposite, "AnalyticsMetrics");
        if (metrics instanceof DirectoryNode dir) {
            List<Map<String, Object>> result = new java.util.ArrayList<>();
            return result;
        }
        return java.util.Collections.emptyList();
    }

    private ComponentNode buildComponentTree() {
        DirectoryNode root    = new DirectoryNode("Dashboard");
        DirectoryNode sidebar = new DirectoryNode("Sidebar");
        DirectoryNode main    = new DirectoryNode("MainPanel");
        DirectoryNode metrics = new DirectoryNode("AnalyticsMetrics");

        metrics.addComponent(new FileNode("Neural Throughput", "98.4%",  "metric"));
        metrics.addComponent(new FileNode("Latency",           "12ms",   "metric"));
        metrics.addComponent(new FileNode("Signal Strength",   "4.9/5",  "metric"));
        metrics.addComponent(new FileNode("Integrity",         "A+",     "metric"));

        root.addComponent(sidebar);
        root.addComponent(main);
        root.addComponent(metrics);
        return root;
    }

    private ComponentNode findNode(ComponentNode node, String name) {
        if (node.getName().equals(name)) return node;
        if (node instanceof DirectoryNode dir) {
            // no direct child accessor available
        }
        return null;
    }
}
