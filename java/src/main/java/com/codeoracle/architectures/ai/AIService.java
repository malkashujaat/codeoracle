package com.codeoracle.architectures.ai;

import java.util.function.Consumer;

public interface AIService {
    void call(String systemPrompt, String input, Consumer<String> onChunk) throws Exception;
}
