package com.codeoracle.architectures.core;

import com.codeoracle.architectures.chain.ChainBuilder;
import com.codeoracle.architectures.chain.RequestHandler;
import com.codeoracle.architectures.composite.ComponentNode;
import com.codeoracle.architectures.factory.OracleFactory;
import java.util.HashMap;
import java.util.Map;

public class CodeOracleCore {
    private static CodeOracleCore instance = null;

    private Map<String,Object> modules = new HashMap<>();
    private Object adapter;
    private RequestHandler requestChain;
    private ComponentNode uiComposite;

    public static CodeOracleCore getInstance() {
        if (instance == null) instance = new CodeOracleCore();
        return instance;
    }

    private CodeOracleCore() {
        this.modules = new HashMap<>();
        this.adapter = OracleFactory.createModule("adapter");
        this.initModules();
        this.requestChain = ChainBuilder.buildAnalysisChain();
        this.uiComposite = buildComponentTree();
    }

    private void initModules() {
        this.modules.put("ai", OracleFactory.createModule("ai"));
    }

    private ComponentNode buildComponentTree() {
        ComponentNode root = new ComponentNode("Dashboard");
        ComponentNode sidebar = new ComponentNode("Sidebar");
        ComponentNode main = new ComponentNode("MainPanel");
        ComponentNode metrics = new ComponentNode("AnalyticsMetrics");

        metrics.add(new ComponentNode("Neural Throughput"))
               .add(new ComponentNode("Latency"))
               .add(new ComponentNode("Signal Strength"))
               .add(new ComponentNode("Integrity"));

        root.add(sidebar).add(main).add(metrics);
        return root;
    }

    public Object getModule(String name) { return modules.get(name); }
    public Object getAdapter() { return adapter; }

    public java.util.List<java.util.Map<String,Object>> getDashboardMetrics() {
        ComponentNode metrics = uiComposite.find("AnalyticsMetrics");
        if (metrics == null) return java.util.Collections.emptyList();
        java.util.List<java.util.Map<String,Object>> out = new java.util.ArrayList<>();
        for (ComponentNode c : metrics.getChildren()) {
            java.util.Map<String,Object> m = new java.util.HashMap<>();
            m.put("label", c.getName());
            m.put("data", c.getData());
            out.add(m);
        }
        return out;
    }

    public void handleRequest(com.codeoracle.architectures.chain.Request request) throws Exception {
        this.requestChain.handle(request);
    }
}
