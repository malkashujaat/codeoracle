package com.codeoracle.patterns.mediator;

import org.springframework.http.ResponseEntity;
import java.util.Map;

public interface SystemMediator {

    ResponseEntity<?> handleGetFiles();
    ResponseEntity<?> handleSaveFile(Map<String, Object> payload);
    ResponseEntity<?> handleSaveAnalysis(Map<String, Object> payload);
    ResponseEntity<?> handleSignup(Map<String, String> payload);
    ResponseEntity<?> handleLogin(Map<String, String> payload);
    ResponseEntity<?> handleAiProxy(Map<String, Object> payload);
}
