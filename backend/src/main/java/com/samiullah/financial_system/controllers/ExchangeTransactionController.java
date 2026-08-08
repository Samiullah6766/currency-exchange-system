package com.samiullah.financial_system.controllers;

import com.samiullah.financial_system.dtos.*;
import com.samiullah.financial_system.entities.ExchangeTransaction;
import com.samiullah.financial_system.services.ExchangeTransactionService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/exchangetransaction")
@AllArgsConstructor
public class ExchangeTransactionController {
  private ExchangeTransactionService exchangeTransactionService;

  @PostMapping("/createtransaction")
  public ResponseEntity<ExchangeTransactionDto> createExchangeTransaction(@RequestBody ExchangeTransactionRequest exchangeTransactionRequest) {
      System.out.println("Controller reached");
      ExchangeTransactionDto exchangeTransactionDto = exchangeTransactionService.createExchangeTransaction(exchangeTransactionRequest);
      return ResponseEntity.ok(exchangeTransactionDto);
  }

  @GetMapping("/getAllExchangeTransactions")
    public ResponseEntity<List<ExchangeTransactionDto>> getAllExchangeTransactions() {
      List<ExchangeTransactionDto> exchangeTransactionDtos = exchangeTransactionService.getExchangeTransactions();
      return ResponseEntity.ok(exchangeTransactionDtos);
  }

  @GetMapping("/numberOfExchangeTransactions")
  public ResponseEntity<Integer> getNumOfExchangeTransactions() {
    return ResponseEntity.ok(exchangeTransactionService.getNumberOfExchangeTransactions());
  }


  @PostMapping("/getMonthInterest")
  public ResponseEntity<InterestResponse> getMonthlyInterest(@RequestBody InterestDto interestDto) {

    InterestResponse interestResponse = exchangeTransactionService.getMonthInterest(interestDto);
    return ResponseEntity.ok(interestResponse);
  }

  @GetMapping("/customerExchanges/{customerId}")
  public ResponseEntity<List<ExchangeTransactionDto>> getCustomerExchangeTransactions(@PathVariable Long customerId) {
     List<ExchangeTransactionDto> exchangeTransactionDtos =  exchangeTransactionService.getAllTransactionsOfCustomer(customerId);
     return ResponseEntity.ok(exchangeTransactionDtos);
  }


  @GetMapping("/todayInterest")
  public ResponseEntity<InterestResponse> todayInterest() {
    InterestResponse interestResponse = exchangeTransactionService.todayInterest();
    return ResponseEntity.ok(interestResponse);
  }



}
