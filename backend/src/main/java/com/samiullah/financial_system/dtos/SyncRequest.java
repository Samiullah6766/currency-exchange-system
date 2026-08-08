package com.samiullah.financial_system.dtos;

import com.samiullah.financial_system.entities.*;
import lombok.Data;

import java.util.List;

@Data
public class SyncRequest {

    private List<Customer> customers;
    private List<Transaction> transactions;
    private List<Wallet> wallets;
    private List<WalletTransaction> walletTransactions;
    private List<ExchangeTransaction> exchangeTransactions;
    private List<OwnerExchangeTransaction> ownerExchangeTransactions;
    private List<Remittance> remittances;
    private List<User> users;
    private List<CompanyInfo> companies;

}
