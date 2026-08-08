package com.samiullah.financial_system.sync;


import com.samiullah.financial_system.services.SyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SyncScheduler {

    private final SyncService syncService;

    // every 30 seconds
    @Scheduled(fixedDelay = 60000)
    public void autoSync() {

        System.out.println("Automatic synchronization...");

        syncService.synchronize();
    }
}
