package com.samiullah.financial_system.controllers;


import com.samiullah.financial_system.services.SyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sync")
public class SyncController {

    private final SyncService syncService;

    @PostMapping("/send")
    public ResponseEntity<String> synchronize() {

        String result = syncService.synchronize();

        switch (result) {

            case "SUCCESS":
                return ResponseEntity.ok("ارسال اطلاعات کامل شد");

            case "NO_DATA":
                return ResponseEntity.ok("چیزی جدید برای ارسال به سرور وجود ندارد");

            case "SERVER_OFFLINE":
                return ResponseEntity.status(503)
                        .body("سرور مرکزی خاموش است.");

            default:
                return ResponseEntity.status(500)
                        .body("Synchronization failed.");
        }
    }
}
