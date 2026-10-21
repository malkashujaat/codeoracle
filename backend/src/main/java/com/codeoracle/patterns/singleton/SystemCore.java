package com.codeoracle.patterns.singleton;

import java.util.HashMap;
import java.util.Map;

public class SystemCore {

    private static volatile SystemCore instance;
    private final Map<String, String> config = new HashMap<>();

    private SystemCore() {
        config.put("JWT_SECRET", "codeoracle_secret_key");
        String key = System.getenv("ANTHROPIC_API_KEY");
        if (key == null) key = System.getenv("ANTHROPIC_KEY");
        config.put("AI_API_KEY", key != null ? key : "");
    }

    public static SystemCore getInstance() {
        if (instance == null) {
            synchronized (SystemCore.class) {
                if (instance == null) instance = new SystemCore();
            }
        }
        return instance;
    }

    public String getConfig(String key)               { return config.get(key); }
    public void   setConfig(String key, String value) { config.put(key, value); }
}
