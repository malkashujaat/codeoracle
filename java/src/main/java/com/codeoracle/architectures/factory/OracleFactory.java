package com.codeoracle.architectures.factory;

import com.codeoracle.architectures.adapter.DataAdapter;
import com.codeoracle.architectures.ai.DemoAIService;

/**
 * Minimal factory that mirrors the JS OracleFactory.createModule behavior
 */
public class OracleFactory {
    public static Object createModule(String type) {
        switch (type) {
            case "ai":
                return new DemoAIService();
            case "adapter":
                return new DataAdapter();
            default:
                throw new IllegalArgumentException("Unknown module type: " + type);
        }
    }
}
