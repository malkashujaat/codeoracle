package com.codeoracle.controllers;

import com.codeoracle.patterns.mediator.SystemMediator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BackendController {

    private final SystemMediator mediator;

    public BackendController(SystemMediator mediator) {
        this.mediator = mediator;
    }

    @GetMapping("/files")
    public ResponseEntity<?> getFiles() {
        return mediator.handleGetFiles();
    }

    @PostMapping("/files")
    public ResponseEntity<?> saveFile(@RequestBody Map<String, Object> body) {
        return mediator.handleSaveFile(body);
    }

    @PostMapping("/analysis")
    public ResponseEntity<?> saveAnalysis(@RequestBody Map<String, Object> body) {
        return mediator.handleSaveAnalysis(body);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        return mediator.handleSignup(body);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        return mediator.handleLogin(body);
    }

    @PostMapping("/ai")
    public ResponseEntity<?> aiProxy(@RequestBody Map<String, Object> body) {
        return mediator.handleAiProxy(body);
    }
}
