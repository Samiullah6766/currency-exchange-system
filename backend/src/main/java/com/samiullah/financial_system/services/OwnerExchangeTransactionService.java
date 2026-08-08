package com.samiullah.financial_system.services;

import com.samiullah.financial_system.dtos.ExchangeTransactionDto;
import com.samiullah.financial_system.dtos.OwnerExchangeTransactionDto;
import com.samiullah.financial_system.dtos.OwnerExchangeTransactionRequset;
import com.samiullah.financial_system.entities.*;
import com.samiullah.financial_system.exceptions.InsufficientBalanceException;
import com.samiullah.financial_system.exceptions.UserNameNotFoundException;
import com.samiullah.financial_system.repositories.OwnerExchangeTransactionRepository;
import com.samiullah.financial_system.repositories.UserRepository;
import com.samiullah.financial_system.repositories.WalletRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class OwnerExchangeTransactionService {
    private final OwnerExchangeTransactionRepository ownerExchangeTransactionRepository;
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    public OwnerExchangeTransactionService(OwnerExchangeTransactionRepository ownerExchangeTransactionRepository,
                                           WalletRepository walletRepository,
                                           UserRepository userRepository) {
        this.ownerExchangeTransactionRepository = ownerExchangeTransactionRepository;
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
    @Transactional
    public OwnerExchangeTransactionDto ownerExchangeTransaction(OwnerExchangeTransactionRequset request) {
        OwnerExchangeTransaction exchangeTransaction = new OwnerExchangeTransaction();

        exchangeTransaction.setSellingExchangeRate(request.getSellingExchangeRate());
        exchangeTransaction.setBuyingExchangeRate(request.getBuyingExchangeRate());
        exchangeTransaction.setFromCurrency(request.getFromCurrency());
        exchangeTransaction.setToCurrency(request.getToCurrency());
        exchangeTransaction.setTransactionDate(request.getTransactionDate());
        exchangeTransaction.setNotes(request.getNote());
        exchangeTransaction.setFromAmount(request.getFromAmount());
        User currenUser = getCurrentUser();
        exchangeTransaction.setCompanyInfo(currenUser.getCompanyInfo());
        Wallet wallet = walletRepository.findTopByCompanyInfo(currenUser.getCompanyInfo())
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        BigDecimal amount = BigDecimal.ZERO;
        BigDecimal interestAmount = BigDecimal.ZERO;

        // Exchanging money from Dollar to Afghani
        if (request.getFromCurrency() == MoneyType.DOLLAR
                && request.getToCurrency() == MoneyType.AFGHANI) {

            wallet.setDollarBalance(
                    wallet.getDollarBalance()
                            .add(request.getFromAmount())
            );

            amount = exchangeTransaction.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransaction.getBuyingExchangeRate()));
            interestAmount = exchangeTransaction.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransaction.getSellingExchangeRate()));

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            exchangeTransaction.setToAmount(amount);

            wallet.setAfghaniBalance(
                    wallet.getAfghaniBalance()
                            .subtract(amount)
            );

            if (wallet.getAfghaniBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Afghani balance not enough");
            }
            System.out.println("after: "+wallet.getAfghaniBalance());
        }

// Exchanging money from Afghani to Dollar
        if (request.getFromCurrency() == MoneyType.AFGHANI
                && request.getToCurrency() == MoneyType.DOLLAR) {

            wallet.setAfghaniBalance(
                    wallet.getAfghaniBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .divide(
                            BigDecimal.valueOf(request.getSellingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP
                    );

            exchangeTransaction.setToAmount(amount);
            interestAmount = request.getFromAmount()
                    .divide(BigDecimal.valueOf(request.getBuyingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP);

            exchangeTransaction.setInterest(interestAmount.subtract(amount));
            wallet.setDollarBalance(
                    wallet.getDollarBalance()
                            .subtract(amount)
            );
            if (wallet.getDollarBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Dollar balance not enough");
            }
        }

// Exchanging money from Afghani to Toman
        BigDecimal oneMillion = BigDecimal.valueOf(1_000_000);
        if (request.getFromCurrency() == MoneyType.AFGHANI
                && request.getToCurrency() == MoneyType.TOMAN) {

            wallet.setAfghaniBalance(
                    wallet.getAfghaniBalance()
                            .add(request.getFromAmount())
            );
            amount = (request.getFromAmount()
                    .multiply(oneMillion))
                    .divide(
                            BigDecimal.valueOf(request.getSellingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP
                    );

            exchangeTransaction.setToAmount(amount);
            interestAmount = (request.getFromAmount()
                    .multiply(oneMillion))
                    .divide(BigDecimal.valueOf(request.getBuyingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP);

            exchangeTransaction.setInterest(interestAmount.subtract(amount));


            wallet.setTomanBalance(
                    wallet.getTomanBalance()
                            .subtract(amount)
            );
            if (wallet.getTomanBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Toman balance not enough");
            }
        }

        // Exchanging money from Toman to Afghani
        if (request.getFromCurrency() == MoneyType.TOMAN
                && request.getToCurrency() == MoneyType.AFGHANI) {

            wallet.setTomanBalance(
                    wallet.getTomanBalance()
                            .add(request.getFromAmount())
            );

            amount = (request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getBuyingExchangeRate())).divide(oneMillion, 2, RoundingMode.HALF_UP)
            );
            exchangeTransaction.setToAmount(amount);
            interestAmount = (request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getSellingExchangeRate())).divide(oneMillion, 2, RoundingMode.HALF_UP));

            exchangeTransaction.setInterest(interestAmount.subtract(amount));


            wallet.setAfghaniBalance(
                    wallet.getAfghaniBalance()
                            .subtract(amount)
            );
            if (wallet.getAfghaniBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Afghani balance not enough");
            }
        }

        BigDecimal oneThousand = BigDecimal.valueOf(1_000);
        // Exchanging money from Afghani to Kaldara
        if (request.getFromCurrency() == MoneyType.AFGHANI
                && request.getToCurrency() == MoneyType.KALDARA) {

            wallet.setAfghaniBalance(
                    wallet.getAfghaniBalance()
                            .add(request.getFromAmount())
            );

            amount = (request.getFromAmount().multiply(oneThousand))
                    .divide(BigDecimal.valueOf(request.getSellingExchangeRate()),
                            2, RoundingMode.HALF_UP);

            exchangeTransaction.setToAmount(amount);
            interestAmount = (request.getFromAmount().multiply(oneThousand))
                    .divide(BigDecimal.valueOf(request.getBuyingExchangeRate()), 2, RoundingMode.HALF_UP);

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setKaldaraBalance(
                    wallet.getKaldaraBalance()
                            .subtract(amount)
            );
            if (wallet.getKaldaraBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Kaldara balance not enough");
            }
        }

        // Exchanging money from Kaldara to Afghani
        if (request.getFromCurrency() == MoneyType.KALDARA
                && request.getToCurrency() == MoneyType.AFGHANI) {

            wallet.setKaldaraBalance(
                    wallet.getKaldaraBalance()
                            .add(request.getFromAmount())
            );
            amount = (request.getFromAmount().multiply(BigDecimal.valueOf(exchangeTransaction.getBuyingExchangeRate())))
                    .divide(oneThousand, 2, RoundingMode.HALF_UP);

            exchangeTransaction.setToAmount(amount);
            interestAmount = (request.getFromAmount().multiply(BigDecimal.valueOf(exchangeTransaction.getSellingExchangeRate())))
                    .divide(oneThousand, 2, RoundingMode.HALF_UP);

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setAfghaniBalance(
                    wallet.getAfghaniBalance()
                            .subtract(amount)
            );
            if (wallet.getAfghaniBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Afghani balance not enough");
            }
        }

        // Exchanging money from Dollar to Toman
        if (request.getFromCurrency() == MoneyType.DOLLAR
                && request.getToCurrency() == MoneyType.TOMAN) {
            wallet.setDollarBalance(
                    wallet.getDollarBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getBuyingExchangeRate()));
            exchangeTransaction.setToAmount(amount);

            interestAmount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getSellingExchangeRate()));

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setTomanBalance(
                    wallet.getTomanBalance()
                            .subtract(amount)
            );
            if (wallet.getTomanBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Toman balance not enough");
            }
        }

        // Exchanging money from Toman to Dollar
        if (request.getFromCurrency() == MoneyType.TOMAN
                && request.getToCurrency() == MoneyType.DOLLAR) {

            wallet.setTomanBalance(
                    wallet.getTomanBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .divide(
                            BigDecimal.valueOf(request.getSellingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP
                    );

            exchangeTransaction.setToAmount(amount);
            interestAmount = request.getFromAmount()
                    .divide(BigDecimal.valueOf(request.getBuyingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP);

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setDollarBalance(
                    wallet.getDollarBalance()
                            .subtract(amount)
            );
            if (wallet.getDollarBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Dollar balance not enough");
            }
        }

        // Exchanging money from Dollar to Kaldara
        if (request.getFromCurrency() == MoneyType.DOLLAR
                && request.getToCurrency() == MoneyType.KALDARA) {

            wallet.setDollarBalance(
                    wallet.getDollarBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getBuyingExchangeRate()));
            exchangeTransaction.setToAmount(amount);

            interestAmount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getSellingExchangeRate()));

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setKaldaraBalance(
                    wallet.getKaldaraBalance()
                            .subtract(amount)
            );
            if (wallet.getKaldaraBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Kaldara balance not enough");
            }
        }

        // Exchanging money from Kaldara to Dollar
        if (request.getFromCurrency() == MoneyType.KALDARA
                && request.getToCurrency() == MoneyType.DOLLAR) {

            wallet.setKaldaraBalance(
                    wallet.getKaldaraBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .divide(
                            BigDecimal.valueOf(request.getSellingExchangeRate()),
                            2, RoundingMode.HALF_UP
                    );
            exchangeTransaction.setToAmount(amount);
            interestAmount = request.getFromAmount()
                    .divide(BigDecimal.valueOf(request.getBuyingExchangeRate()),
                            2, RoundingMode.HALF_UP);

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setDollarBalance(
                    wallet.getDollarBalance()
                            .subtract(amount)
            );
            if (wallet.getDollarBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Dollar balance not enough");
            }
        }

        // Exchanging money from Toman to Kaldara
        if (request.getFromCurrency() == MoneyType.TOMAN
                && request.getToCurrency() == MoneyType.KALDARA) {

            wallet.setTomanBalance(
                    wallet.getTomanBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .divide(
                            BigDecimal.valueOf(request.getSellingExchangeRate()),
                            2, RoundingMode.HALF_UP
                    );

            exchangeTransaction.setToAmount(amount);
            interestAmount = request.getFromAmount()
                    .divide(BigDecimal.valueOf(request.getBuyingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP);

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setKaldaraBalance(
                    wallet.getKaldaraBalance()
                            .subtract(amount)
            );
            if (wallet.getKaldaraBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Kaldara balance not enough");
            }
        }

        // Exchanging money from Kaldara to Toman
        if (request.getFromCurrency() == MoneyType.KALDARA
                && request.getToCurrency() == MoneyType.TOMAN) {

            wallet.setKaldaraBalance(
                    wallet.getKaldaraBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getBuyingExchangeRate()));
            exchangeTransaction.setToAmount(amount);
            interestAmount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getSellingExchangeRate()));

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setTomanBalance(
                    wallet.getTomanBalance()
                            .subtract(amount)
            );
            if (wallet.getTomanBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Toman balance not enough");
            }
        }
        //Exchange morey from Euro to dollar
        if (request.getFromCurrency() == MoneyType.EURO
                && request.getToCurrency() == MoneyType.DOLLAR) {

            wallet.setEuroBalance(
                    wallet.getEuroBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getBuyingExchangeRate()));
            exchangeTransaction.setToAmount(amount);
            interestAmount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getSellingExchangeRate()));

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setDollarBalance(
                    wallet.getDollarBalance()
                            .subtract(amount)
            );
            if (wallet.getDollarBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Dollar balance not enough");
            }
        }
        //Exchange Dollar to Euro
        if (request.getFromCurrency() == MoneyType.DOLLAR
                && request.getToCurrency() == MoneyType.EURO) {

            wallet.setDollarBalance(
                    wallet.getDollarBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .divide(BigDecimal.valueOf(request.getSellingExchangeRate()),
                            2, RoundingMode.HALF_UP);
            exchangeTransaction.setToAmount(amount);
            interestAmount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getBuyingExchangeRate()));

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setEuroBalance(
                    wallet.getEuroBalance()
                            .subtract(amount)
            );
            if (wallet.getEuroBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Euro balance not enough");
            }
        }
        //Exchanging Euro to Afghani
        if (request.getFromCurrency() == MoneyType.EURO
                && request.getToCurrency() == MoneyType.AFGHANI) {

            wallet.setEuroBalance(
                    wallet.getEuroBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getBuyingExchangeRate()));
            exchangeTransaction.setToAmount(amount);
            interestAmount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getSellingExchangeRate()));

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setAfghaniBalance(
                    wallet.getAfghaniBalance()
                            .subtract(amount)
            );
            if (wallet.getAfghaniBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Afghani balance not enough");
            }
        }
        //Exchanging Afghani to Euro
        if (request.getFromCurrency() == MoneyType.AFGHANI
                && request.getToCurrency() == MoneyType.EURO) {

            wallet.setAfghaniBalance(
                    wallet.getAfghaniBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .divide(BigDecimal.valueOf(request.getSellingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP);
            exchangeTransaction.setToAmount(amount);
            interestAmount = request.getFromAmount()
                    .divide(BigDecimal.valueOf(request.getBuyingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP);

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setEuroBalance(
                    wallet.getEuroBalance()
                            .subtract(amount)
            );
            if (wallet.getEuroBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Euro balance not enough");
            }
        }
        //Exchanging Euro to toman
        if (request.getFromCurrency() == MoneyType.EURO
                && request.getToCurrency() == MoneyType.TOMAN) {

            wallet.setEuroBalance(
                    wallet.getEuroBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getBuyingExchangeRate()));
            exchangeTransaction.setToAmount(amount);
            interestAmount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getSellingExchangeRate()));

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setTomanBalance(
                    wallet.getTomanBalance()
                            .subtract(amount)
            );
            if (wallet.getTomanBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Toman balance not enough");
            }
        }
        //Exchanging Toman to Euro
        if (request.getFromCurrency() == MoneyType.TOMAN
                && request.getToCurrency() == MoneyType.EURO) {

            wallet.setTomanBalance(
                    wallet.getTomanBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .divide(BigDecimal.valueOf(request.getSellingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP);
            exchangeTransaction.setToAmount(amount);
            interestAmount = request.getFromAmount()
                    .divide(BigDecimal.valueOf(request.getBuyingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP);

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setEuroBalance(
                    wallet.getEuroBalance()
                            .subtract(amount)
            );
            if (wallet.getEuroBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Euro balance not enough");
            }
        }
        //Exchanging Euro to kaldara
        if (request.getFromCurrency() == MoneyType.EURO
                && request.getToCurrency() == MoneyType.KALDARA) {

            wallet.setEuroBalance(
                    wallet.getEuroBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getBuyingExchangeRate()));
            exchangeTransaction.setToAmount(amount);
            interestAmount = request.getFromAmount()
                    .multiply(BigDecimal.valueOf(request.getSellingExchangeRate()));

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setKaldaraBalance(
                    wallet.getKaldaraBalance()
                            .subtract(amount)
            );
            if (wallet.getKaldaraBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Kaldara balance not enough");
            }
        }
        // Exchanging Kaldara to Euro
        if (request.getFromCurrency() == MoneyType.KALDARA
                && request.getToCurrency() == MoneyType.EURO) {

            wallet.setKaldaraBalance(
                    wallet.getKaldaraBalance()
                            .add(request.getFromAmount())
            );

            amount = request.getFromAmount()
                    .divide(BigDecimal.valueOf(request.getSellingExchangeRate()),
                            2, RoundingMode.HALF_UP);
            exchangeTransaction.setToAmount(amount);
            interestAmount = request.getFromAmount()
                    .divide(BigDecimal.valueOf(request.getBuyingExchangeRate()),
                            2, RoundingMode.HALF_UP);

            exchangeTransaction.setInterest(interestAmount.subtract(amount));

            wallet.setEuroBalance(
                    wallet.getEuroBalance()
                            .subtract(amount)
            );
            if (wallet.getEuroBalance().compareTo(BigDecimal.ZERO) < 0) {
                throw new InsufficientBalanceException("Euro balance not enough");
            }
        }
        walletRepository.save(wallet);

        OwnerExchangeTransaction savedTransaction = ownerExchangeTransactionRepository.save(exchangeTransaction);
        OwnerExchangeTransactionDto ownerExchangeTransactionDto = new OwnerExchangeTransactionDto();
        ownerExchangeTransactionDto.setId(savedTransaction.getId());
        ownerExchangeTransactionDto.setFromCurrency(savedTransaction.getFromCurrency());
        ownerExchangeTransactionDto.setToCurrency(savedTransaction.getToCurrency());
        ownerExchangeTransactionDto.setBuyingExchangeRate(savedTransaction.getBuyingExchangeRate());
        ownerExchangeTransactionDto.setSellingExchangeRate(savedTransaction.getSellingExchangeRate());
        ownerExchangeTransactionDto.setFromAmount(savedTransaction.getFromAmount());
        ownerExchangeTransactionDto.setToAmount(savedTransaction.getToAmount());
        ownerExchangeTransactionDto.setNote(savedTransaction.getNotes());
        ownerExchangeTransactionDto.setTransactionDate(savedTransaction.getTransactionDate());
        ownerExchangeTransactionDto.setInterest(savedTransaction.getInterest());

        return ownerExchangeTransactionDto;

    }
    public List<OwnerExchangeTransactionDto> getOwnerExchangeTransactions() {
        User currentUser = getCurrentUser();
        List<OwnerExchangeTransaction> exchangeTransactions = ownerExchangeTransactionRepository.findAllByCompanyInfo(currentUser.getCompanyInfo());


        return exchangeTransactions.stream()
                .map(exchangeTransaction -> new OwnerExchangeTransactionDto(
                        exchangeTransaction.getId(),
                        exchangeTransaction.getFromCurrency(),
                        exchangeTransaction.getToCurrency(),
                        exchangeTransaction.getFromAmount(),
                        exchangeTransaction.getToAmount(),
                        exchangeTransaction.getBuyingExchangeRate(),
                        exchangeTransaction.getSellingExchangeRate(),
                        exchangeTransaction.getInterest(),
                        exchangeTransaction.getNotes(),
                        exchangeTransaction.getTransactionDate()
                ))
                .toList();

    }
}
