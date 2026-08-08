package com.samiullah.financial_system.services;

import com.samiullah.financial_system.dtos.*;
import com.samiullah.financial_system.entities.*;
import com.samiullah.financial_system.exceptions.CustomerNotFoundException;
import com.samiullah.financial_system.exceptions.InsufficientBalanceException;
import com.samiullah.financial_system.exceptions.UserNameNotFoundException;
import com.samiullah.financial_system.repositories.CustomerRepository;
import com.samiullah.financial_system.repositories.TransactionRepository;
import com.samiullah.financial_system.repositories.UserRepository;
import com.samiullah.financial_system.repositories.WalletRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.lang.reflect.Type;
import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Service

public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final CustomerRepository customerRepository;
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, CustomerRepository customerRepository,
                              WalletRepository walletRepository,
                              UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.customerRepository = customerRepository;
        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
    }
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNameNotFoundException("User not found"));
    }

    public TransactionResponseDto createTransaction(TransactionRequestDto transactionRequestDto) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByIdAndCompanyInfo(transactionRequestDto.getCustomerId(), currentUser.getCompanyInfo())
                .orElseThrow(() -> new CustomerNotFoundException("Customer Not Found"));
        Transaction transaction = new Transaction();
        transaction.setType(transactionRequestDto.getTransactionType());
        transaction.setTransactionDate(transactionRequestDto.getTransactionDate());

        transaction.setMoneyType(transactionRequestDto.getMoneyType());
        transaction.setCustomer(customer);
        transaction.setNote(transactionRequestDto.getNote());


        transaction.setCompanyInfo(currentUser.getCompanyInfo());



        Wallet wallet =
                walletRepository.findTopByCompanyInfo(
                                currentUser.getCompanyInfo()
                        )
                        .orElseThrow(() -> new RuntimeException("Wallet not found"));


        // Adding or subracting the Dollar money to/from Wallet
        if(transactionRequestDto.getMoneyType() == MoneyType.DOLLAR){



            if(transactionRequestDto.getTransactionType() == TransactionType.BORROWED){
                if(transactionRequestDto.getAmount().compareTo(wallet.getDollarBalance()) > 0){
                    throw new InsufficientBalanceException("Insufficient Balance");
                }
                wallet.setDollarBalance(
                        wallet.getDollarBalance()
                                .subtract(transactionRequestDto.getAmount())
                );
            }

            if(transactionRequestDto.getTransactionType() == TransactionType.RETURNED){
                wallet.setDollarBalance(
                        wallet.getDollarBalance()
                                .add(transactionRequestDto.getAmount())
                );
            }
        }
        // Adding or subracting the Afghani money to/from Wallet
        if(transactionRequestDto.getMoneyType() == MoneyType.AFGHANI){

            if(transactionRequestDto.getTransactionType() == TransactionType.BORROWED){
                if(transactionRequestDto.getAmount().compareTo(wallet.getAfghaniBalance()) > 0){
                    throw new InsufficientBalanceException("Insufficient Balance");
                }
                wallet.setAfghaniBalance(
                        wallet.getAfghaniBalance()
                                .subtract(transactionRequestDto.getAmount())
                );
            }

            if(transactionRequestDto.getTransactionType() == TransactionType.RETURNED){
                wallet.setAfghaniBalance(
                        wallet.getAfghaniBalance()
                                .add(transactionRequestDto.getAmount())
                );
            }
        }
        // Adding or subracting the Kaldara money to/from Wallet
        if(transactionRequestDto.getMoneyType() == MoneyType.KALDARA){

            if(transactionRequestDto.getTransactionType() == TransactionType.BORROWED){
                if(transactionRequestDto.getAmount().compareTo(wallet.getKaldaraBalance()) > 0){
                    throw new InsufficientBalanceException("Insufficient Balance");
                }
                wallet.setKaldaraBalance(
                        wallet.getKaldaraBalance()
                                .subtract(transactionRequestDto.getAmount())
                );
            }

            if(transactionRequestDto.getTransactionType() == TransactionType.RETURNED){
                wallet.setKaldaraBalance(
                        wallet.getKaldaraBalance()
                                .add(transactionRequestDto.getAmount())
                );
            }
        }

        // Adding or subracting the Toman money to/from Wallet
        if(transactionRequestDto.getMoneyType() == MoneyType.TOMAN){

            if(transactionRequestDto.getTransactionType() == TransactionType.BORROWED){
                if(transactionRequestDto.getAmount().compareTo(wallet.getTomanBalance()) > 0){
                    throw new InsufficientBalanceException("Insufficient Balance");
                }
                wallet.setTomanBalance(
                        wallet.getTomanBalance()
                                .subtract(transactionRequestDto.getAmount())
                );
            }

            if(transactionRequestDto.getTransactionType() == TransactionType.RETURNED){
                wallet.setTomanBalance(
                        wallet.getTomanBalance()
                                .add(transactionRequestDto.getAmount())
                );
            }
        }
        // Adding/Subtracting Euro money to/from wallet
        if(transactionRequestDto.getMoneyType() == MoneyType.EURO){

            if(transactionRequestDto.getTransactionType() == TransactionType.BORROWED){
                if(transactionRequestDto.getAmount().compareTo(wallet.getEuroBalance()) > 0){
                    throw new InsufficientBalanceException("Insufficient Balance");
                }
                wallet.setEuroBalance(
                        wallet.getEuroBalance()
                                .subtract(transactionRequestDto.getAmount())
                );
            }

            if(transactionRequestDto.getTransactionType() == TransactionType.RETURNED){
                wallet.setEuroBalance(
                        wallet.getEuroBalance()
                                .add(transactionRequestDto.getAmount())
                );
            }
        }
        walletRepository.save(wallet);
        transaction.setAmount(transactionRequestDto.getAmount());

        Transaction savedtransaction = transactionRepository.save(transaction);
        TransactionResponseDto transactionResponseDto = new TransactionResponseDto();

        transactionResponseDto.setTransactionId(savedtransaction.getId());
        transactionResponseDto.setTransactionDate(savedtransaction.getTransactionDate());
        transactionResponseDto.setTransactionType(savedtransaction.getType());
        transactionResponseDto.setAmount(savedtransaction.getAmount());
        transactionResponseDto.setCustomerId(savedtransaction.getCustomer().getId());
        transactionResponseDto.setCustomerName(savedtransaction.getCustomer().getFirstName()
        + " " + savedtransaction.getCustomer().getLastName());
        transactionResponseDto.setMoneyType(savedtransaction.getMoneyType());
        transactionResponseDto.setNote(savedtransaction.getNote());

        return transactionResponseDto;


    }

    public List<TransactionResponseDto> getAllTransactions() {
        User currentUser =  getCurrentUser();


        List<Transaction> transactions =
                transactionRepository.findAllByCompanyInfo(
                        currentUser.getCompanyInfo()
                );

        return transactions.stream().map(transaction ->
                new TransactionResponseDto(
                        transaction.getId(),
                        transaction.getType(),
                        transaction.getAmount(),
                        transaction.getTransactionDate(),
                        transaction.getCustomer().getId(),
                        transaction.getCustomer().getFirstName()
                        + " " + transaction.getCustomer().getLastName(),
                        transaction.getCustomer().getNumber(),
                        transaction.getMoneyType(),
                        transaction.getNote()
                )).toList();
    }
    private BigDecimal calculateTotal(
            List<TransactionResponse>  transactionResponses,
            MoneyType moneyType,
            TransactionType transactionType
    ){
        BigDecimal total = BigDecimal.ZERO;
        for (TransactionResponse transactionResponse : transactionResponses) {
            if(transactionResponse.getTransactionType() == transactionType &&
            transactionResponse.getMoneyType() == moneyType) {
                total = total.add(transactionResponse.getAmount());
            }
        }
        return total;
    }
    public List<TransactionResponseDto> getAllTransactionsByCustomerId(Long customerId) {
        User currentUser =  getCurrentUser();
        List<Transaction> transactions =
                transactionRepository.findByCustomerIdAndCompanyInfo(customerId, currentUser.getCompanyInfo());


        return transactions.stream()
                .map(transaction ->
                        new TransactionResponseDto(
                                transaction.getId(),
                                transaction.getType(),
                                transaction.getAmount(),
                                transaction.getTransactionDate(),
                                transaction.getCustomer().getId(),
                                transaction.getCustomer().getFirstName()
                                        + " " +
                                        transaction.getCustomer().getLastName(),
                                transaction.getCustomer().getNumber(),
                                transaction.getMoneyType(),
                                transaction.getNote()
                        )
                ).toList();
    }
    public CustomerTransactionSummary allTransactionsByCustomerId(Long customerId) {
        User currentUser =  getCurrentUser();
        List<Transaction> transactions =
                transactionRepository.findByCustomerIdAndCompanyInfo(customerId,  currentUser.getCompanyInfo());

        List<TransactionResponse> transactionResponses = transactions.stream()
                .map(transaction ->
                        new TransactionResponse(
                                transaction.getId(),
                                transaction.getType(),
                                transaction.getAmount(),
                                transaction.getTransactionDate(),
                                transaction.getCustomer().getId(),
                                transaction.getCustomer().getFirstName()
                                        + " " +
                                        transaction.getCustomer().getLastName(),
                                transaction.getMoneyType(),
                                transaction.getNote()
                        )
                ).toList();

        BigDecimal totalTomanBorrowed =  calculateTotal(transactionResponses, MoneyType.TOMAN, TransactionType.BORROWED);
        BigDecimal totalTomanReturned =  calculateTotal(transactionResponses, MoneyType.TOMAN, TransactionType.RETURNED);
        BigDecimal totalAfghaniBorrowed =  calculateTotal(transactionResponses, MoneyType.AFGHANI, TransactionType.BORROWED);
        BigDecimal totalAfghaniReturned =  calculateTotal(transactionResponses, MoneyType.AFGHANI, TransactionType.RETURNED);
        BigDecimal totalDollarBorrowed =  calculateTotal(transactionResponses, MoneyType.DOLLAR, TransactionType.BORROWED);
        BigDecimal totalDollarReturned =  calculateTotal(transactionResponses, MoneyType.DOLLAR, TransactionType.RETURNED);
        BigDecimal totalKaldaraBorrowed =  calculateTotal(transactionResponses, MoneyType.KALDARA, TransactionType.BORROWED);
        BigDecimal totalKaldaraReturned =  calculateTotal(transactionResponses, MoneyType.KALDARA, TransactionType.RETURNED);
        BigDecimal totalEuroBorrowed =  calculateTotal(transactionResponses, MoneyType.EURO, TransactionType.BORROWED);
        BigDecimal totalEuroReturned =  calculateTotal(transactionResponses, MoneyType.EURO, TransactionType.RETURNED);


        CustomerTransactionSummary summary = new CustomerTransactionSummary();

        summary.setTransactions(transactionResponses);
        summary.setTotalDollarBorrowedAmount(totalDollarBorrowed);
        summary.setTotalDollarReturnedAmount(totalDollarReturned);
        summary.setDollarBalance(totalDollarReturned.subtract(totalDollarBorrowed));
        summary.setTotalTomanBorrowedAmount(totalTomanBorrowed);
        summary.setTotalTomanReturnedAmount(totalTomanReturned);
        summary.setTomanBalance(totalTomanReturned.subtract(totalTomanBorrowed));
        summary.setTotalAfghaniBorrowedAmount(totalAfghaniBorrowed);
        summary.setTotalAfghaniReturnedAmount(totalAfghaniReturned);
        summary.setAfghaniBalance(totalAfghaniReturned.subtract(totalAfghaniBorrowed));
        summary.setTotalKaldaraBorrowedAmount(totalKaldaraBorrowed);
        summary.setTotalKaldaraReturnedAmount(totalKaldaraReturned);
        summary.setKaldaraBalance(totalKaldaraReturned.subtract(totalKaldaraBorrowed));
        summary.setTotalEuroBorrowedAmount(totalEuroBorrowed);
        summary.setTotalEuroReturnedAmount(totalEuroReturned);
        summary.setEuroBalance(totalEuroReturned.subtract(totalEuroBorrowed));

        return summary;
    }

    public TransactionResponseDto updateTransaction(TransactionRequestDto transactionRequestDto, Long transactionId) {

        User currentUser = getCurrentUser();
        Transaction transaction = transactionRepository.findByIdAndCompanyInfo(transactionId, currentUser.getCompanyInfo()).orElseThrow(() -> new RuntimeException("Transaction Not Found"));
        transaction.setType(transactionRequestDto.getTransactionType());
        transaction.setTransactionDate(transactionRequestDto.getTransactionDate());
        transaction.setAmount(transactionRequestDto.getAmount());
        transaction.setMoneyType(transactionRequestDto.getMoneyType());
        transaction.setSynced(false);
        Customer customer = customerRepository.findByIdAndCompanyInfo(transactionRequestDto.getCustomerId(), currentUser.getCompanyInfo()).orElseThrow(() -> new CustomerNotFoundException("Customer Not Found"));
        transaction.setCustomer(customer);
        transaction.setNote(transactionRequestDto.getNote());

        transaction.setCompanyInfo(currentUser.getCompanyInfo());
        transactionRepository.save(transaction);
        TransactionResponseDto transactionResponseDto = new TransactionResponseDto();
        transactionResponseDto.setTransactionId(transaction.getId());
        transactionResponseDto.setTransactionDate(transactionRequestDto.getTransactionDate());
        transactionResponseDto.setTransactionType(transactionRequestDto.getTransactionType());
        transactionResponseDto.setAmount(transactionRequestDto.getAmount());
        transactionResponseDto.setCustomerId(transactionRequestDto.getCustomerId());
        transactionResponseDto.setCustomerName(transaction.getCustomer().getFirstName()
        + " " + transaction.getCustomer().getLastName());
        transactionResponseDto.setMoneyType(transactionRequestDto.getMoneyType());
        transactionResponseDto.setNote(transactionRequestDto.getNote());
        return transactionResponseDto;



    }
    public TransactionResponseDto getTransactionById(Long transactionId) {
        User currentUser = getCurrentUser();
        Transaction transaction = transactionRepository.findByIdAndCompanyInfo(transactionId, currentUser.getCompanyInfo()).orElseThrow(
                () -> new RuntimeException("Transaction Not Found")
        );


        return new TransactionResponseDto(
                transaction.getId(),
                transaction.getType(),
                transaction.getAmount(),
                transaction.getTransactionDate(),
                transaction.getCustomer().getId(),
                transaction.getCustomer().getFirstName()
                        + " " +
                        transaction.getCustomer().getLastName(),
                transaction.getCustomer().getNumber(),
                transaction.getMoneyType(),
                transaction.getNote()
        );
    }

    public void deleteTransactionById(Long transactionId) {
        User currentUser = getCurrentUser();
        Transaction transaction = transactionRepository.findByIdAndCompanyInfo(transactionId, currentUser.getCompanyInfo()).orElseThrow(() -> new RuntimeException("Transaction Not Found"));
        transactionRepository.delete(transaction);

    }
    public Integer numberOfTransactions() {
        User currentUser = getCurrentUser();
        return transactionRepository.findAllByCompanyInfo(currentUser.getCompanyInfo()).size();
    }

    private BigDecimal calculateBorrowedAmount(
            List<Transaction>  transactions,
            TransactionType transactionType,
            MoneyType moneyType
    ) {
        BigDecimal totalBorrowed = BigDecimal.ZERO;
        for (Transaction transaction : transactions) {
            if (transaction.getType() == transactionType && transaction.getMoneyType() == moneyType) {
                totalBorrowed = totalBorrowed.add(transaction.getAmount());
            }
        }
        return totalBorrowed;

    }
    public ExchangeTransactionSummary getExchangeTransactionSummary() {
        User currentUser = getCurrentUser();
        List<Transaction> transactions = transactionRepository.findAllByCompanyInfo(currentUser.getCompanyInfo());
        BigDecimal totalDollarBorrowed = calculateBorrowedAmount(transactions, TransactionType.BORROWED, MoneyType.DOLLAR);
        BigDecimal totalAfghaniBorrowed = calculateBorrowedAmount(transactions, TransactionType.BORROWED, MoneyType.AFGHANI);
        BigDecimal totalTomanBorrowed = calculateBorrowedAmount(transactions, TransactionType.BORROWED, MoneyType.TOMAN);
        BigDecimal totalKaldaraBorrowed = calculateBorrowedAmount(transactions, TransactionType.BORROWED, MoneyType.KALDARA);
        BigDecimal totalEuroBorrowed = calculateBorrowedAmount(transactions, TransactionType.BORROWED, MoneyType.EURO);

        ExchangeTransactionSummary exchangeTransactionSummary = new ExchangeTransactionSummary();
        exchangeTransactionSummary.setTotalAfghaniBorrowed(totalAfghaniBorrowed);
        exchangeTransactionSummary.setTotalTomanBorrowed(totalTomanBorrowed);
        exchangeTransactionSummary.setTotalDollarBorrowed(totalDollarBorrowed);
        exchangeTransactionSummary.setTotalKaldaraBorrowed(totalKaldaraBorrowed);
        exchangeTransactionSummary.setTotalEuroBorrowed(totalEuroBorrowed);

        return exchangeTransactionSummary;


    }
}



