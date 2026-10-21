package com.codeoracle.patterns.factory;

import com.codeoracle.patterns.adapter.DataAdapter;
import com.codeoracle.patterns.ai.DemoAIService;

public class OracleFactory {
    public static Object createModule(String type) {
        switch (type) {
            case "ai":      return new DemoAIService();
            case "adapter": return new DataAdapter();
            default: throw new IllegalArgumentException("Unknown module type: " + type);
        }
    }
}
