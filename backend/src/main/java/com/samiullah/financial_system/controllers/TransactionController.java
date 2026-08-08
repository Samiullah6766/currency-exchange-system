package com.samiullah.financial_system.controllers;

import com.samiullah.financial_system.dtos.CustomerTransactionSummary;
import com.samiullah.financial_system.dtos.ExchangeTransactionSummary;
import com.samiullah.financial_system.dtos.TransactionRequestDto;
import com.samiullah.financial_system.dtos.TransactionResponseDto;
import com.samiullah.financial_system.entities.Transaction;
import com.samiullah.financial_system.services.TransactionService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/customers")
@AllArgsConstructor
public class TransactionController {
    private TransactionService transactionService;

    @PostMapping("/transaction")
    public ResponseEntity<TransactionResponseDto> createTransaction(@RequestBody TransactionRequestDto transactionRequestDto) {

        TransactionResponseDto responseDto = transactionService.createTransaction(transactionRequestDto);
        return ResponseEntity.ok(responseDto);
    }
    @GetMapping("getAllTransactions")
    public ResponseEntity<List<TransactionResponseDto>> getAllTransactions() {
        List<TransactionResponseDto> responseDto = transactionService.getAllTransactions();
        return ResponseEntity.ok(responseDto);
    }
    @GetMapping("customerTransactions/{customerId}")
    public ResponseEntity<List<TransactionResponseDto>> getAllTransactionsCustomer(@PathVariable Long customerId) {
        List<TransactionResponseDto> transactions = transactionService.getAllTransactionsByCustomerId(customerId);
        return ResponseEntity.ok(transactions);
    }
    @GetMapping("/transactionSummery/{customerId}")
    public ResponseEntity<CustomerTransactionSummary>  getCustomerTransactionSummary(@PathVariable Long customerId) {
        CustomerTransactionSummary summery = transactionService.allTransactionsByCustomerId(customerId);

        return ResponseEntity.ok(summery);
    }
    @PutMapping("/update-transaction/{transactionId}")
    public ResponseEntity<TransactionResponseDto> updateTransaction(@RequestBody TransactionRequestDto transactionRequestDto,
                                                                    @PathVariable Long transactionId) {
        TransactionResponseDto responseDto = transactionService.updateTransaction(transactionRequestDto, transactionId);
        return ResponseEntity.ok(responseDto);
    }
    @GetMapping("/transaction/{transactionId}")
    public ResponseEntity<TransactionResponseDto> getTransactionById(
            @PathVariable Long transactionId) {

        TransactionResponseDto responseDto =
                transactionService.getTransactionById(transactionId);

        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/delete-transaction/{transactionId}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long transactionId) {
        transactionService.deleteTransactionById(transactionId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/numtransactions")
    public ResponseEntity<Integer> numTransactions() {
       int numTransactions =  transactionService.numberOfTransactions();
       return ResponseEntity.ok(numTransactions);
    }

    @GetMapping("/allBorrowed")
    public ResponseEntity<ExchangeTransactionSummary> getAllBorrowedTransactions() {
        ExchangeTransactionSummary exchangeTransactionSummary = transactionService.getExchangeTransactionSummary();
        return ResponseEntity.ok(exchangeTransactionSummary);
    }

}
