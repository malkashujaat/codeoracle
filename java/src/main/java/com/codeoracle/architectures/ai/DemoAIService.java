package com.codeoracle.architectures.ai;

import java.util.function.Consumer;

public class DemoAIService implements AIService {
    @Override
    public void call(String systemPrompt, String input, Consumer<String> onChunk) {
        String demo = "## Demo AI Response\n\nThis is a local demo response. Set ANTHROPIC_API_KEY in the backend to use real AI.";
        onChunk.accept(demo);
    }
}
