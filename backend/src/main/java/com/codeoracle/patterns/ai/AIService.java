package com.codeoracle.patterns.ai;

import java.util.function.Consumer;

public interface AIService {
    void call(String systemPrompt, String userMessage, Consumer<String> onChunk) throws Exception;
}
