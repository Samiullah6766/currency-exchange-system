package com.samiullah.financial_system.services;

import com.samiullah.financial_system.dtos.SyncRequest;
import com.samiullah.financial_system.entities.*;
import com.samiullah.financial_system.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service
@RequiredArgsConstructor

public class SyncService {
    @Value("${sync.server.url}")
    private String syncServerUrl;

    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private final ExchangeTransactionRepository exchangeTransactionRepository;
    private final OwnerExchangeTransactionRepository ownerExchangeTransactionRepository;
    private final RemittanceRepository remittanceRepository;
    private final CompanyInfoRepository companyInfoRepository;
    private final UserRepository userRepository;

    private final RestTemplate restTemplate;

    public SyncRequest buildRequest() {

        SyncRequest request = new SyncRequest();

        request.setCompanies(companyInfoRepository.findBySyncedFalse());

        request.setCustomers(customerRepository.findBySyncedFalse());

        request.setTransactions(transactionRepository.findBySyncedFalse());

        request.setWallets(walletRepository.findBySyncedFalse());

        request.setWalletTransactions(
                walletTransactionRepository.findBySyncedFalse());

        request.setExchangeTransactions(
                exchangeTransactionRepository.findBySyncedFalse());

        request.setOwnerExchangeTransactions(
                ownerExchangeTransactionRepository.findBySyncedFalse());

        request.setRemittances(
                remittanceRepository.findBySyncedFalse());

        request.setUsers(userRepository.findBySyncedFalse());

        return request;
    }
    public String synchronize() {

        SyncRequest request = buildRequest();

        if (isEmpty(request)) {
            return "NO_DATA";
        }

        try {

            ResponseEntity<String> response =
                    restTemplate.postForEntity(
                            syncServerUrl,
                            request,
                            String.class
                    );

            if (response.getStatusCode().is2xxSuccessful()) {
                markAsSynced(request);
                return "SUCCESS";
            }
            return "FAILED";
        } catch (ResourceAccessException e) {
            return "SERVER_OFFLINE";
        } catch (RestClientException e) {
            return "FAILED";
        }
    }

    private void markCustomers(List<Customer> customers) {

        if (customers == null || customers.isEmpty()) {
            return;
        }

        customers.forEach(customer -> customer.setSynced(true));

        customerRepository.saveAll(customers);
    }
    private void markCompanies(List<CompanyInfo> companies) {

        if (companies == null || companies.isEmpty()) {
            return;
        }

        companies.forEach(company -> company.setSynced(true));

        companyInfoRepository.saveAll(companies);
    }
    private void markUsers(List<User> users) {

        if (users == null || users.isEmpty()) {
            return;
        }

        users.forEach(user -> user.setSynced(true));

        userRepository.saveAll(users);
    }
    private void markWallets(List<Wallet> wallets) {

        if (wallets == null || wallets.isEmpty()) {
            return;
        }

        wallets.forEach(wallet -> wallet.setSynced(true));

        walletRepository.saveAll(wallets);
    }
    private void markTransactions(List<Transaction> transactions) {

        if (transactions == null || transactions.isEmpty()) {
            return;
        }

        transactions.forEach(transaction -> transaction.setSynced(true));

        transactionRepository.saveAll(transactions);
    }
    private void markWalletTransactions(List<WalletTransaction> walletTransactions) {

        if (walletTransactions == null || walletTransactions.isEmpty()) {
            return;
        }

        walletTransactions.forEach(walletTransaction -> walletTransaction.setSynced(true));

        walletTransactionRepository.saveAll(walletTransactions);
    }
    private void markExchangeTransactions(List<ExchangeTransaction> exchangeTransactions) {

        if (exchangeTransactions == null || exchangeTransactions.isEmpty()) {
            return;
        }

        exchangeTransactions.forEach(exchangeTransaction -> exchangeTransaction.setSynced(true));

        exchangeTransactionRepository.saveAll(exchangeTransactions);
    }
    private void markOwnerExchangeTransactions(List<OwnerExchangeTransaction> ownerExchangeTransactions) {

        if (ownerExchangeTransactions == null || ownerExchangeTransactions.isEmpty()) {
            return;
        }

        ownerExchangeTransactions.forEach(ownerExchangeTransaction -> ownerExchangeTransaction.setSynced(true));

        ownerExchangeTransactionRepository.saveAll(ownerExchangeTransactions);
    }
    private void markRemittances(List<Remittance> remittances) {

        if (remittances == null || remittances.isEmpty()) {
            return;
        }

        remittances.forEach(remittance -> remittance.setSynced(true));

        remittanceRepository.saveAll(remittances);
    }
    private void markAsSynced(SyncRequest request) {

        markCompanies(request.getCompanies());

        markUsers(request.getUsers());

        markCustomers(request.getCustomers());

        markWallets(request.getWallets());

        markTransactions(request.getTransactions());

        markWalletTransactions(request.getWalletTransactions());

        markExchangeTransactions(request.getExchangeTransactions());

        markOwnerExchangeTransactions(
                request.getOwnerExchangeTransactions());

        markRemittances(request.getRemittances());
    }
    private boolean isEmpty(SyncRequest request) {

        return (request.getCompanies() == null || request.getCompanies().isEmpty())
                && (request.getCustomers() == null || request.getCustomers().isEmpty())
                && (request.getTransactions() == null || request.getTransactions().isEmpty())
                && (request.getWallets() == null || request.getWallets().isEmpty())
                && (request.getWalletTransactions() == null || request.getWalletTransactions().isEmpty())
                && (request.getExchangeTransactions() == null || request.getExchangeTransactions().isEmpty())
                && (request.getOwnerExchangeTransactions() == null || request.getOwnerExchangeTransactions().isEmpty())
                && (request.getRemittances() == null || request.getRemittances().isEmpty())
                && (request.getUsers() == null || request.getUsers().isEmpty());
    }

}