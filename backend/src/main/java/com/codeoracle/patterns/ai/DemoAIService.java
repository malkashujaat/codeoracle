package com.codeoracle.patterns.ai;

import java.util.function.Consumer;

public class DemoAIService implements AIService {

    @Override
    public void call(String systemPrompt, String userMessage, Consumer<String> onChunk) {
        String demo = "## Demo AI Response\n\n"
                + "This is a local demo response from the Java backend.\n"
                + "Set `ANTHROPIC_API_KEY` as an environment variable or "
                + "enter a valid key in the Settings panel to use real AI.";
        onChunk.accept(demo);
    }
}
