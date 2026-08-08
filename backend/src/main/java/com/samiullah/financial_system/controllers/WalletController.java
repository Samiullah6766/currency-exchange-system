package com.samiullah.financial_system.controllers;

import com.samiullah.financial_system.dtos.*;
import com.samiullah.financial_system.services.WalletService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/wallet")
@AllArgsConstructor
public class WalletController {
    private WalletService walletService;

    @PostMapping("/createwallet")
    public ResponseEntity<WalletDto> createWallet(@RequestBody WalletRequest walletRequest) {

        WalletDto walletDto = walletService.createWallet(walletRequest);
        return ResponseEntity.ok(walletDto);
    }
    @GetMapping("/getwallet")
    public ResponseEntity<WalletDto> getAllWallets(){
        WalletDto walletDtos = walletService.getWallet();
        return ResponseEntity.ok(walletDtos);
    }

    @PutMapping("/updateWallet")
    public ResponseEntity<Void> updateWallet(
            @RequestBody UpdateWalletRequest request){
        System.out.println("===== UPDATE CONTROLLER =====");
        walletService.updateWalletById(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/transaction")
    public ResponseEntity<WalletTransactionResponse> createWalletTransaction(@RequestBody WalletTransactionRequest walletTransactionRequest){
        WalletTransactionResponse walletTransactionResponse = walletService.createWalletTransaction(walletTransactionRequest);
        return ResponseEntity.ok(walletTransactionResponse);
    }

    @GetMapping("/getWalletTransactions")
    public ResponseEntity<List<WalletTransactionResponse>> getWalletTransactions(){
        List<WalletTransactionResponse> walletTransactions = walletService.getWalletTransactions();
        return ResponseEntity.ok(walletTransactions);
    }

    @PostMapping("/validateUser")
    public ResponseEntity<Boolean> authenticateUser(@RequestBody LoginRequest loginRequest){
        Boolean result = walletService.authenticateUser(loginRequest);
        return ResponseEntity.ok(result);
    }


}
