package com.codeoracle.patterns.builder;

import java.util.HashMap;
import java.util.Map;

public class ConfigBuilder {

    private String model;
    private double temp;

    public ConfigBuilder() { reset(); }

    public ConfigBuilder reset() {
        this.model = "claude-3-5-sonnet-20241022";
        this.temp  = 0.7;
        return this;
    }

    public ConfigBuilder setModel(String model) { this.model = model; return this; }
    public ConfigBuilder setTemp(double temp)   { this.temp  = temp;  return this; }

    public ConfigBuilder merge(Map<String, Object> config) {
        if (config == null) return this;
        if (config.containsKey("model")) this.model = (String) config.get("model");
        if (config.containsKey("temp"))  this.temp  = ((Number) config.get("temp")).doubleValue();
        return this;
    }

    public Map<String, Object> build() {
        Map<String, Object> out = new HashMap<>();
        out.put("model", model);
        out.put("temp",  temp);
        return out;
    }
}
