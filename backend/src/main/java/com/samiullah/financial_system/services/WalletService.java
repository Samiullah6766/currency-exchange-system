package com.samiullah.financial_system.services;

import com.samiullah.financial_system.dtos.*;
import com.samiullah.financial_system.entities.*;
import com.samiullah.financial_system.exceptions.InsufficientBalanceException;
import com.samiullah.financial_system.exceptions.UserNameNotFoundException;
import com.samiullah.financial_system.exceptions.WalletAlreadyExists;
import com.samiullah.financial_system.exceptions.WalletNotFound;
import com.samiullah.financial_system.repositories.UserRepository;
import com.samiullah.financial_system.repositories.WalletRepository;
import com.samiullah.financial_system.repositories.WalletTransactionRepository;
import lombok.AllArgsConstructor;
import com.samiullah.financial_system.exceptions.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class WalletService {
    private final WalletRepository walletRepository;
    private final WalletTransactionRepository walletTransactionRepository;
    private  final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String username = authentication.getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNameNotFoundException("User not found"));
    }

    public WalletService(WalletRepository walletRepository,
                         WalletTransactionRepository walletTransactionRepository,
                         UserRepository userRepository,
                         PasswordEncoder passwordEncoder) {
        this.walletRepository = walletRepository;
        this.walletTransactionRepository = walletTransactionRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public WalletDto createWallet(WalletRequest walletRequest) {
        User currentUser = getCurrentUser();

        walletRepository
                .findTopByCompanyInfo(currentUser.getCompanyInfo())
                .ifPresent(wallet -> {
                    throw new WalletAlreadyExists("Wallet Already Exists");
                });
        Wallet wallet = new Wallet();
        wallet.setAfghaniBalance(walletRequest.getAfghaniBalance());
        wallet.setDollarBalance(walletRequest.getDollarBalance());
        wallet.setKaldaraBalance(walletRequest.getKaldaraBalance());
        wallet.setTomanBalance(walletRequest.getTomanBalance());
        wallet.setEuroBalance(walletRequest.getEuroBalance());

        wallet.setCompanyInfo(currentUser.getCompanyInfo());
        Wallet savedWallet = walletRepository.save(wallet);
        WalletDto walletDto = new WalletDto();
        walletDto.setId(savedWallet.getId());

        walletDto.setAfghaniBalance(savedWallet.getAfghaniBalance());
        walletDto.setDollarBalance(savedWallet.getDollarBalance());
        walletDto.setKaldaraBalance(savedWallet.getKaldaraBalance());
        walletDto.setTomanBalance(savedWallet.getTomanBalance());
        walletDto.setEuroBalance(savedWallet.getEuroBalance());

        return walletDto;

    }

    public WalletDto getWallet(){
        User currentUser = getCurrentUser();
        Wallet wallet = walletRepository.findFirstByCompanyInfo(currentUser.getCompanyInfo()).orElseThrow(() ->
                new WalletNotFound("Wallet Not Found")
        );

        WalletDto walletDto = new WalletDto();
        walletDto.setId(wallet.getId());
        walletDto.setAfghaniBalance(wallet.getAfghaniBalance());
        walletDto.setDollarBalance(wallet.getDollarBalance());
        walletDto.setKaldaraBalance(wallet.getKaldaraBalance());
        walletDto.setTomanBalance(wallet.getTomanBalance());
        walletDto.setEuroBalance(wallet.getEuroBalance());

        return walletDto;

    }

    public boolean authenticateUser(LoginRequest loginRequest) {
        User currentUser = getCurrentUser();

        boolean authenticated =
                currentUser.getUsername().equals(loginRequest.getUsername()) &&
                        passwordEncoder.matches(
                                loginRequest.getPassword(),
                                currentUser.getPassword());

        if (!authenticated) {
            throw new BadCredentialsException("Invalid credentials");
        }

        return true;
    }

    public void updateWalletById(UpdateWalletRequest walletRequest) {

        User currentUser = getCurrentUser();

        System.out.println("Logged in user = " + currentUser.getUsername());
        System.out.println("Request username = " + walletRequest.getUsername());

        Wallet wallet = walletRepository
                .findTopByCompanyInfo(currentUser.getCompanyInfo())
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        if (!currentUser.getUsername().equals(walletRequest.getUsername())) {
            System.out.println("USERNAME DOES NOT MATCH");
            System.out.println("Request password: " + walletRequest.getPassword());
            System.out.println("Database password: " + currentUser.getPassword());
            throw new BadCredentialsException("Invalid credentials");
        }

        System.out.println("Username OK");

        System.out.println("Request password = " + walletRequest.getPassword());
        System.out.println("Database password = " + currentUser.getPassword());

        boolean passwordMatches = passwordEncoder.matches(
                walletRequest.getPassword(),
                currentUser.getPassword());

        System.out.println("Password matches = " + passwordMatches);

        System.out.println("Password matches = " + passwordMatches);

        if (!passwordMatches) {
            System.out.println("PASSWORD DOES NOT MATCH");
            throw new BadCredentialsException("Invalid credentials");
        }

        System.out.println("Updating wallet...");

        wallet.setAfghaniBalance(walletRequest.getAfghaniBalance());
        wallet.setDollarBalance(walletRequest.getDollarBalance());
        wallet.setKaldaraBalance(walletRequest.getKaldaraBalance());
        wallet.setTomanBalance(walletRequest.getTomanBalance());
        wallet.setEuroBalance(walletRequest.getEuroBalance());
        wallet.setSynced(false);

        walletRepository.save(wallet);

        System.out.println("Wallet updated successfully");
    }

    public WalletTransactionResponse createWalletTransaction(WalletTransactionRequest walletTransactionRequest) {
        WalletTransaction walletTransaction = new WalletTransaction();
        User currentUser = getCurrentUser();
        Wallet wallet = walletRepository.findByIdAndCompanyInfo(walletTransactionRequest.getWalletId(),
                currentUser.getCompanyInfo()).orElseThrow(() -> new RuntimeException("Wallet not found"));
        walletTransaction.setWallet(wallet);
        walletTransaction.setTransactionType(walletTransactionRequest.getTransactionType());
        walletTransaction.setAmount(walletTransactionRequest.getAmount());
        walletTransaction.setMoneyType(walletTransactionRequest.getMoneyType());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        walletTransaction.setCreatedBy(authentication.getName());
        walletTransaction.setNote(walletTransactionRequest.getNote());
        walletTransaction.setDate(walletTransactionRequest.getDate());

        walletTransaction.setCompanyInfo(currentUser.getCompanyInfo());
        walletTransaction.setSynced(false);

        // Depositing/Widthrawing Afghani
        if (walletTransactionRequest.getTransactionType() == TransactionType.DEPOSIT &&
        walletTransactionRequest.getMoneyType() == MoneyType.AFGHANI) {
            wallet.setAfghaniBalance(
                    wallet.getAfghaniBalance().add(walletTransactionRequest.getAmount()));
        }
        if (walletTransactionRequest.getTransactionType() == TransactionType.WITHDRAW &&
                walletTransactionRequest.getMoneyType() == MoneyType.AFGHANI) {
            if (wallet.getAfghaniBalance().compareTo(walletTransactionRequest.getAmount()) < 0) {
                throw new InsufficientBalanceException("Insufficient euro balance");
            }
            wallet.setAfghaniBalance(
                    wallet.getAfghaniBalance().subtract(walletTransactionRequest.getAmount()));
        }

        //Depositing/Withdrawing Dollar

        if (walletTransactionRequest.getTransactionType() == TransactionType.DEPOSIT &&
                walletTransactionRequest.getMoneyType() == MoneyType.DOLLAR) {
            wallet.setDollarBalance(
                    wallet.getDollarBalance().add(walletTransactionRequest.getAmount()));
        }
        if (walletTransactionRequest.getTransactionType() == TransactionType.WITHDRAW &&
                walletTransactionRequest.getMoneyType() == MoneyType.DOLLAR) {
            if (wallet.getDollarBalance().compareTo(walletTransactionRequest.getAmount()) < 0) {
                throw new InsufficientBalanceException("Insufficient euro balance");
            }
            wallet.setDollarBalance(
                    wallet.getDollarBalance().subtract(walletTransactionRequest.getAmount()));
        }
        //Depositing/Withdrawing Kaldara

        if (walletTransactionRequest.getTransactionType() == TransactionType.DEPOSIT &&
                walletTransactionRequest.getMoneyType() == MoneyType.KALDARA) {
            wallet.setKaldaraBalance(
                    wallet.getKaldaraBalance().add(walletTransactionRequest.getAmount()));
        }
        if (walletTransactionRequest.getTransactionType() == TransactionType.WITHDRAW &&
                walletTransactionRequest.getMoneyType() == MoneyType.KALDARA) {
            if (wallet.getKaldaraBalance().compareTo(walletTransactionRequest.getAmount()) < 0) {
                throw new InsufficientBalanceException("Insufficient euro balance");
            }
            wallet.setKaldaraBalance(
                    wallet.getKaldaraBalance().subtract(walletTransactionRequest.getAmount()));
        }
        //Depositing/Withdrawing Toman

        if (walletTransactionRequest.getTransactionType() == TransactionType.DEPOSIT &&
                walletTransactionRequest.getMoneyType() == MoneyType.TOMAN) {
            wallet.setTomanBalance(
                    wallet.getTomanBalance().add(walletTransactionRequest.getAmount()));
        }
        if (walletTransactionRequest.getTransactionType() == TransactionType.WITHDRAW &&
                walletTransactionRequest.getMoneyType() == MoneyType.TOMAN) {
            if (wallet.getTomanBalance().compareTo(walletTransactionRequest.getAmount()) < 0) {
                throw new InsufficientBalanceException("Insufficient euro balance");
            }
            wallet.setTomanBalance(
                    wallet.getTomanBalance().subtract(walletTransactionRequest.getAmount()));
        }
        //Depositing and widthrawing Euro
        if (walletTransactionRequest.getTransactionType() == TransactionType.DEPOSIT &&
                walletTransactionRequest.getMoneyType() == MoneyType.EURO) {

            if (wallet.getEuroBalance() == null) {
                wallet.setEuroBalance(BigDecimal.ZERO);
            }
            wallet.setEuroBalance(
                    wallet.getEuroBalance().add(walletTransactionRequest.getAmount()));
        }
        if (walletTransactionRequest.getTransactionType() == TransactionType.WITHDRAW &&
                walletTransactionRequest.getMoneyType() == MoneyType.EURO) {
            if (wallet.getEuroBalance().compareTo(walletTransactionRequest.getAmount()) < 0) {
                throw new InsufficientBalanceException("Insufficient euro balance");
            }
            wallet.setEuroBalance(
                    wallet.getEuroBalance().subtract(walletTransactionRequest.getAmount()));

        }

        walletRepository.save(wallet);
        WalletTransaction savedTransaction =  walletTransactionRepository.save(walletTransaction);
        WalletTransactionResponse walletTransactionResponse = new WalletTransactionResponse();
        walletTransactionResponse.setTransactionId(savedTransaction.getId());
        walletTransactionResponse.setTransactionType(savedTransaction.getTransactionType());
        walletTransactionResponse.setWalletTransactionId(savedTransaction.getId());
        walletTransactionResponse.setMoneyType(savedTransaction.getMoneyType());
        walletTransactionResponse.setAmount(savedTransaction.getAmount());
        walletTransactionResponse.setCreatedBy(savedTransaction.getCreatedBy());
        walletTransactionResponse.setNote(savedTransaction.getNote());
        walletTransactionResponse.setDate(savedTransaction.getDate());

        return walletTransactionResponse;

    }
    public List<WalletTransactionResponse> getWalletTransactions() {
        User currentUser = getCurrentUser();
        List<WalletTransaction> walletTransactions = walletTransactionRepository.findAllByCompanyInfo(currentUser.getCompanyInfo());

        return walletTransactions.stream().map((walletTransaction) -> new WalletTransactionResponse(
                walletTransaction.getWallet().getId(),
                walletTransaction.getId(),
                walletTransaction.getTransactionType(),
                walletTransaction.getMoneyType(),
                walletTransaction.getAmount(),
                walletTransaction.getCreatedBy(),
                walletTransaction.getNote(),
                walletTransaction.getDate()
        )).toList();
    }

}
