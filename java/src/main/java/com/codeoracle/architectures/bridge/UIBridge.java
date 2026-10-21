package com.codeoracle.architectures.bridge;

import com.codeoracle.architectures.core.CodeOracleCore;
import com.codeoracle.architectures.chain.Request;
import com.codeoracle.architectures.ai.AIService;
import com.codeoracle.architectures.adapter.DataAdapter;

import java.util.function.Consumer;

public class UIBridge {
    private final CodeOracleCore core;

    public UIBridge(CodeOracleCore core) { this.core = core; }

    public Request requestAnalysis(String action, Request.Payload payload, Consumer<String> onChunk) throws Exception {
        Request req = new Request();
        req.setAction(action);
        req.setFiles(payload.getFiles());
        req.setActiveFile(payload.getActiveFile());
        req.setDbConnected(payload.isDbConnected());
        req.setAiService((AIService) core.getModule("ai"));
        req.setAdapter((DataAdapter) core.getAdapter());
        req.setOnChunk(onChunk);

        core.handleRequest(req);
        return req;
    }
}
