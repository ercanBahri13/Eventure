// backend/src/main/java/com/example/demo/controllers/SafetyAlertController.java
package com.example.demo.controllers;

import com.example.demo.dto.SafetyAlertRequest;
import com.example.demo.services.SafetyAlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/safety-alert")
@CrossOrigin("*")
public class SafetyAlertController {

    @Autowired private SafetyAlertService svc;

    @PostMapping
    public ResponseEntity<?> alert(@RequestBody SafetyAlertRequest req) {
        System.out.println("🚨 /safety-alert called: " + req);
        try {
            svc.processAlert(req);
            System.out.println("✅ processAlert succeeded");
            return ResponseEntity.ok("alert-sent");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
