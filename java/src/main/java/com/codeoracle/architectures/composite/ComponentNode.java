package com.codeoracle.architectures.composite;

import java.util.ArrayList;
import java.util.List;

public class ComponentNode {
    private String name;
    private Object data;
    private List<ComponentNode> children = new ArrayList<>();

    public ComponentNode(String name) { this(name, null); }
    public ComponentNode(String name, Object data) { this.name = name; this.data = data; }

    public ComponentNode add(ComponentNode child) { this.children.add(child); return this; }

    public ComponentNode find(String name) {
        if (this.name.equals(name)) return this;
        for (ComponentNode c : children) {
            ComponentNode f = c.find(name);
            if (f != null) return f;
        }
        return null;
    }

    public List<ComponentNode> getLeaves() {
        if (children.isEmpty()) { List<ComponentNode> leaf = new ArrayList<>(); leaf.add(this); return leaf; }
        List<ComponentNode> out = new ArrayList<>();
        for (ComponentNode c : children) out.addAll(c.getLeaves());
        return out;
    }

    public String getName() { return name; }
    public Object getData() { return data; }
    public List<ComponentNode> getChildren() { return children; }
}
