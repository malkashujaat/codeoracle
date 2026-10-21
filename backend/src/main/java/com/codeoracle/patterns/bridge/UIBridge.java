package com.codeoracle.patterns.bridge;

import com.codeoracle.patterns.chain.Request;
import com.codeoracle.patterns.core.CodeOracleCore;

import java.util.List;
import java.util.Map;

public class UIBridge {

    private final CodeOracleCore core;

    public UIBridge(CodeOracleCore core) { this.core = core; }

    public Request requestAnalysis(
            String action,
            List<Map<String, String>> files,
            Map<String, String> activeFile,
            boolean dbConnected) throws Exception {

        Request req = new Request();
        req.setAction(action);
        req.setFiles(files);
        req.setActiveFile(activeFile);
        req.setDbConnected(dbConnected);

        core.handleRequest(req);
        return req;
    }
}
