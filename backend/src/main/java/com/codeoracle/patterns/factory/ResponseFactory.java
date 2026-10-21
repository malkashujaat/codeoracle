package com.codeoracle.patterns.factory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

public class ResponseFactory {

    public static ResponseEntity<Map<String, Object>> createSuccess(String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", message);
        return ResponseEntity.ok(body);
    }

    public static ResponseEntity<Map<String, Object>> createSuccess(Map<String, Object> data) {
        return ResponseEntity.ok(data);
    }

    public static ResponseEntity<Map<String, String>> createError(HttpStatus status, String message) {
        Map<String, String> body = new HashMap<>();
        body.put("error", message);
        return ResponseEntity.status(status).body(body);
    }
}
