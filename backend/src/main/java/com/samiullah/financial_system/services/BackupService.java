package com.samiullah.financial_system.services;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class BackupService {

    @Value("${backup.folder}")
    private String backupFolder;

    @Value("${mysql.database}")
    private String database;

    @Value("${mysql.username}")
    private String username;

    @Value("${mysql.password}")
    private String password;

    @Value("${mysql.bin.path}")
    private String mysqlBinPath;

    public String createBackup() {

        try {
            File folder = new File(backupFolder);

            if (!folder.exists()) {
                folder.mkdirs();
            }

            String time =
                    new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss")
                            .format(new Date());

            String backupFile =
                    backupFolder
                            + File.separator
                            + "backup_" + time + ".sql";

            String mysqldump =
                    mysqlBinPath +
                            File.separator +
                            "mysqldump.exe";

            ProcessBuilder processBuilder =
                    new ProcessBuilder(
                            mysqldump,
                            "-u" + username,
                            "-p" + password,
                            database,
                            "-r",
                            backupFile
                    );

            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();

            BufferedReader reader =
                    new BufferedReader(
                            new InputStreamReader(process.getInputStream()));

            String line;

            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException("Backup failed.");
            }

            // Keep only the latest 10 backup files
            File[] backups = folder.listFiles((dir, name) ->
                    name.startsWith("backup_") && name.endsWith(".sql"));

            if (backups != null && backups.length > 10) {

                // Sort by last modified (oldest first)
                java.util.Arrays.sort(backups,
                        java.util.Comparator.comparingLong(File::lastModified));

                // Delete the oldest files
                int filesToDelete = backups.length - 10;

                for (int i = 0; i < filesToDelete; i++) {
                    if (backups[i].delete()) {
                        System.out.println("Deleted old backup: " + backups[i].getName());
                    } else {
                        System.out.println("Could not delete: " + backups[i].getName());
                    }
                }
            }

            return new File(backupFile).getAbsolutePath();

        } catch (Exception e) {
            throw new RuntimeException("Backup failed: " + e.getMessage());
        }
    }

    public void restoreBackup(String backupFile) {

        try {

            String mysql =
                    mysqlBinPath +
                            File.separator +
                            "mysql.exe";

            ProcessBuilder processBuilder =
                    new ProcessBuilder(
                            mysql,
                            "-u" + username,
                            "-p" + password,
                            database
                    );

            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            // Send the backup file to mysql.exe
// Send the backup file to mysql.exe
            try (java.io.OutputStream os = process.getOutputStream()) {
                java.nio.file.Files.copy(
                        java.nio.file.Paths.get(
                                backupFolder,
                                backupFile
                        ),
                        os
                );
            }

            BufferedReader reader =
                    new BufferedReader(
                            new InputStreamReader(process.getInputStream()));

            String line;

            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException("Restore failed.");
            }

        } catch (Exception e) {

            throw new RuntimeException(
                    "Restore failed: " + e.getMessage()
            );
        }
    }




    public java.util.List<String> getBackups() {

        File folder = new File(backupFolder);

        if (!folder.exists()) {
            return java.util.Collections.emptyList();
        }

        File[] files = folder.listFiles((dir, name) ->
                name.startsWith("backup_") && name.endsWith(".sql"));

        if (files == null) {
            return java.util.Collections.emptyList();
        }

        java.util.Arrays.sort(
                files,
                (a, b) -> Long.compare(b.lastModified(), a.lastModified())
        );

        java.util.List<String> backups = new java.util.ArrayList<>();

        for (File file : files) {
            backups.add(file.getName());
        }

        return backups;
    }
}
