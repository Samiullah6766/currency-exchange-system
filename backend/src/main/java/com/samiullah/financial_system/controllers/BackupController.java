package com.samiullah.financial_system.controllers;


import com.samiullah.financial_system.dtos.RestoreRequest;
import com.samiullah.financial_system.services.BackupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/backup")
@RequiredArgsConstructor
public class BackupController {

    private final BackupService backupService;

    @PostMapping("/create")
    public ResponseEntity<String> createBackup() {

        String backupFile = backupService.createBackup();

        return ResponseEntity.ok(
                "Backup created successfully.\n\nSaved to:\n" + backupFile
        );
    }
    @PostMapping("/restore")
    public ResponseEntity<String> restoreBackup(
            @RequestBody RestoreRequest request) {

        // Create a backup before restoring
        backupService.createBackup();

        // Restore the selected backup
        backupService.restoreBackup(request.getBackupFile());

        return ResponseEntity.ok("موفقانه فایل پشتیبان در این آدرس ذخیره شد.");
    }
    @GetMapping("/list")
    public ResponseEntity<List<String>> getBackups() {
        return ResponseEntity.ok(backupService.getBackups());
    }



}
