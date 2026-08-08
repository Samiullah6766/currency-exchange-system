package com.samiullah.financial_system.controllers;

import com.samiullah.financial_system.dtos.OwnerExchangeTransactionDto;
import com.samiullah.financial_system.dtos.OwnerExchangeTransactionRequset;
import com.samiullah.financial_system.services.OwnerExchangeTransactionService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/ownerExchangeTransaction")
@AllArgsConstructor

public class OwnerExchangeTransactionController {
    OwnerExchangeTransactionService ownerExchangeTransactionService;
    @PostMapping("/createOwnerExchangeTransaction")
    public ResponseEntity<OwnerExchangeTransactionDto> createOwnerExchangeTransaction(@RequestBody OwnerExchangeTransactionRequset ownerExchangeTransactionRequset) {
        OwnerExchangeTransactionDto ownerExchangeTransactionDto =  ownerExchangeTransactionService.ownerExchangeTransaction(ownerExchangeTransactionRequset);
        return ResponseEntity.ok(ownerExchangeTransactionDto);
    }

    @GetMapping("/ownerTransactions")
    public ResponseEntity<List<OwnerExchangeTransactionDto>> getOwnerExchangeTransactions() {
        List<OwnerExchangeTransactionDto> ownerExchangeTransactionDtos =  ownerExchangeTransactionService.getOwnerExchangeTransactions();
        return ResponseEntity.ok(ownerExchangeTransactionDtos);
    }
}
