package com.samiullah.financial_system.services;

import com.samiullah.financial_system.dtos.*;
import com.samiullah.financial_system.entities.*;
import com.samiullah.financial_system.exceptions.CustomerNotFoundException;
import com.samiullah.financial_system.exceptions.InsufficientBalanceException;
import com.samiullah.financial_system.exceptions.UserNameNotFoundException;
import com.samiullah.financial_system.repositories.CustomerRepository;
import com.samiullah.financial_system.repositories.ExchangeTransactionRepository;
import com.samiullah.financial_system.repositories.UserRepository;
import com.samiullah.financial_system.repositories.WalletRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
public class ExchangeTransactionService {
    private final ExchangeTransactionRepository exchangeTransactionRepository;
    private final CustomerRepository customerRepository;
    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    public ExchangeTransactionService(ExchangeTransactionRepository exchangeTransactionRepository,
                                      CustomerRepository customerRepository,
                                      WalletRepository walletRepository,
                                      UserRepository userRepository) {
        this.exchangeTransactionRepository = exchangeTransactionRepository;
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
    @Transactional
    public ExchangeTransactionDto createExchangeTransaction(ExchangeTransactionRequest exchangeTransactionRequest) {
        User currentUser = getCurrentUser();
        ExchangeTransactionDto exchangeTransactionDto = new ExchangeTransactionDto();
        Customer customer = customerRepository.findByIdAndCompanyInfo(exchangeTransactionRequest.getCustomerId(), currentUser.getCompanyInfo()).orElseThrow(() -> new CustomerNotFoundException("Customer Not Found"));
        ExchangeTransaction exchangeTransaction = new ExchangeTransaction();
        exchangeTransaction.setCustomer(customer);
        exchangeTransaction.setFromAmount(exchangeTransactionRequest.getFromAmount());
        exchangeTransaction.setFromCurrency(exchangeTransactionRequest.getFromCurrency());
        exchangeTransaction.setToCurrency(exchangeTransactionRequest.getToCurrency());
        exchangeTransaction.setBuyingExchangeRate(exchangeTransactionRequest.getBuyingExchangeRate());
        exchangeTransaction.setSellingExchangeRate(exchangeTransactionRequest.getSellingExchangeRate());
        User currenUser = getCurrentUser();
        exchangeTransaction.setCompanyInfo(currenUser.getCompanyInfo());

        exchangeTransaction.setTransactionDate(exchangeTransactionRequest.getTransactionDate());
        exchangeTransaction.setNotes(exchangeTransactionRequest.getNote());
        
        Wallet wallet = walletRepository.findTopByCompanyInfo(currentUser.getCompanyInfo())
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        BigDecimal amount = BigDecimal.ZERO;
        BigDecimal interestAmount = BigDecimal.ZERO;

        // Exchanging money from Dollar to Afghani
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.DOLLAR
                && exchangeTransactionRequest.getToCurrency() == MoneyType.AFGHANI) {

            wallet.setDollarBalance(
                    wallet.getDollarBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.AFGHANI
                && exchangeTransactionRequest.getToCurrency() == MoneyType.DOLLAR) {

            wallet.setAfghaniBalance(
                    wallet.getAfghaniBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .divide(
                            BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP
                    );

            exchangeTransaction.setToAmount(amount);
            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .divide(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()),
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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.AFGHANI
                && exchangeTransactionRequest.getToCurrency() == MoneyType.TOMAN) {

            wallet.setAfghaniBalance(
                    wallet.getAfghaniBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );
            amount = (exchangeTransactionRequest.getFromAmount()
                    .multiply(oneMillion))
                    .divide(
                            BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP
                    );

            exchangeTransaction.setToAmount(amount);
            interestAmount = (exchangeTransactionRequest.getFromAmount()
                    .multiply(oneMillion))
                    .divide(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()),
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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.TOMAN
                && exchangeTransactionRequest.getToCurrency() == MoneyType.AFGHANI) {

            wallet.setTomanBalance(
                    wallet.getTomanBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = (exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate())).divide(oneMillion, 2, RoundingMode.HALF_UP)
                    );
            exchangeTransaction.setToAmount(amount);
            interestAmount = (exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate())).divide(oneMillion, 2, RoundingMode.HALF_UP));

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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.AFGHANI
                && exchangeTransactionRequest.getToCurrency() == MoneyType.KALDARA) {

            wallet.setAfghaniBalance(
                    wallet.getAfghaniBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = (exchangeTransactionRequest.getFromAmount().multiply(oneThousand))
                    .divide(BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()),
                    2, RoundingMode.HALF_UP);

            exchangeTransaction.setToAmount(amount);
            interestAmount = (exchangeTransactionRequest.getFromAmount().multiply(oneThousand))
                    .divide(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()), 2, RoundingMode.HALF_UP);

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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.KALDARA
                && exchangeTransactionRequest.getToCurrency() == MoneyType.AFGHANI) {

            wallet.setKaldaraBalance(
                    wallet.getKaldaraBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );
            amount = (exchangeTransactionRequest.getFromAmount().multiply(BigDecimal.valueOf(exchangeTransaction.getBuyingExchangeRate())))
                    .divide(oneThousand, 2, RoundingMode.HALF_UP);

            exchangeTransaction.setToAmount(amount);
            interestAmount = (exchangeTransactionRequest.getFromAmount().multiply(BigDecimal.valueOf(exchangeTransaction.getSellingExchangeRate())))
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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.DOLLAR
                && exchangeTransactionRequest.getToCurrency() == MoneyType.TOMAN) {
            wallet.setDollarBalance(
                    wallet.getDollarBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()));
            exchangeTransaction.setToAmount(amount);

            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()));

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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.TOMAN
                && exchangeTransactionRequest.getToCurrency() == MoneyType.DOLLAR) {

            wallet.setTomanBalance(
                    wallet.getTomanBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .divide(
                            BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP
                    );

            exchangeTransaction.setToAmount(amount);
            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .divide(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()),
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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.DOLLAR
                && exchangeTransactionRequest.getToCurrency() == MoneyType.KALDARA) {

            wallet.setDollarBalance(
                    wallet.getDollarBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()));
            exchangeTransaction.setToAmount(amount);

            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()));

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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.KALDARA
                && exchangeTransactionRequest.getToCurrency() == MoneyType.DOLLAR) {

            wallet.setKaldaraBalance(
                    wallet.getKaldaraBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .divide(
                            BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()),
                            2, RoundingMode.HALF_UP
                    );
            exchangeTransaction.setToAmount(amount);
            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .divide(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()),
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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.TOMAN
                && exchangeTransactionRequest.getToCurrency() == MoneyType.KALDARA) {

            wallet.setTomanBalance(
                    wallet.getTomanBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .divide(
                            BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()),
                            2, RoundingMode.HALF_UP
                    );

            exchangeTransaction.setToAmount(amount);
            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .divide(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()),
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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.KALDARA
                && exchangeTransactionRequest.getToCurrency() == MoneyType.TOMAN) {

            wallet.setKaldaraBalance(
                    wallet.getKaldaraBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()));
            exchangeTransaction.setToAmount(amount);
            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()));

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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.EURO
                && exchangeTransactionRequest.getToCurrency() == MoneyType.DOLLAR) {

            wallet.setEuroBalance(
                    wallet.getEuroBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()));
            exchangeTransaction.setToAmount(amount);
            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()));

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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.DOLLAR
                && exchangeTransactionRequest.getToCurrency() == MoneyType.EURO) {

            wallet.setDollarBalance(
                    wallet.getDollarBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .divide(BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()),
                            2, RoundingMode.HALF_UP);
            exchangeTransaction.setToAmount(amount);
            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()));

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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.EURO
                && exchangeTransactionRequest.getToCurrency() == MoneyType.AFGHANI) {

            wallet.setEuroBalance(
                    wallet.getEuroBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()));
            exchangeTransaction.setToAmount(amount);
            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()));

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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.AFGHANI
                && exchangeTransactionRequest.getToCurrency() == MoneyType.EURO) {

            wallet.setAfghaniBalance(
                    wallet.getAfghaniBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .divide(BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP);
            exchangeTransaction.setToAmount(amount);
            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .divide(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()),
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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.EURO
                && exchangeTransactionRequest.getToCurrency() == MoneyType.TOMAN) {

            wallet.setEuroBalance(
                    wallet.getEuroBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()));
            exchangeTransaction.setToAmount(amount);
            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()));

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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.TOMAN
                && exchangeTransactionRequest.getToCurrency() == MoneyType.EURO) {

            wallet.setTomanBalance(
                    wallet.getTomanBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .divide(BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()),
                            2,
                            RoundingMode.HALF_UP);
            exchangeTransaction.setToAmount(amount);
            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .divide(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()),
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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.EURO
                && exchangeTransactionRequest.getToCurrency() == MoneyType.KALDARA) {

            wallet.setEuroBalance(
                    wallet.getEuroBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()));
            exchangeTransaction.setToAmount(amount);
            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .multiply(BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()));

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
        if (exchangeTransactionRequest.getFromCurrency() == MoneyType.KALDARA
                && exchangeTransactionRequest.getToCurrency() == MoneyType.EURO) {

            wallet.setKaldaraBalance(
                    wallet.getKaldaraBalance()
                            .add(exchangeTransactionRequest.getFromAmount())
            );

            amount = exchangeTransactionRequest.getFromAmount()
                    .divide(BigDecimal.valueOf(exchangeTransactionRequest.getSellingExchangeRate()),
                            2, RoundingMode.HALF_UP);
            exchangeTransaction.setToAmount(amount);
            interestAmount = exchangeTransactionRequest.getFromAmount()
                    .divide(BigDecimal.valueOf(exchangeTransactionRequest.getBuyingExchangeRate()),
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

        exchangeTransactionRepository.save(exchangeTransaction);
        exchangeTransactionDto.setId(exchangeTransaction.getId());
        exchangeTransactionDto.setCustomerName(exchangeTransaction.getCustomer()
                .getFirstName() +" "+  exchangeTransaction.getCustomer().getLastName());
        exchangeTransactionDto.setCustomerId(exchangeTransaction.getCustomer().getId());
        exchangeTransactionDto.setFromAmount(exchangeTransaction.getFromAmount());
        exchangeTransactionDto.setFromCurrency(exchangeTransaction.getFromCurrency());
        exchangeTransactionDto.setToCurrency(exchangeTransaction.getToCurrency());
        exchangeTransactionDto.setBuyingExchangeRate(exchangeTransaction.getBuyingExchangeRate());
        exchangeTransactionDto.setTransactionDate(exchangeTransaction.getTransactionDate());
        exchangeTransactionDto.setNote(exchangeTransaction.getNotes());
        exchangeTransactionDto.setToAmount(exchangeTransaction.getToAmount());


        return exchangeTransactionDto;
    }

    public List<ExchangeTransactionDto> getExchangeTransactions() {
        User currentUser = getCurrentUser();
        List<ExchangeTransaction> exchangeTransactions = exchangeTransactionRepository.findAllByCompanyInfo(currentUser.getCompanyInfo());


        return exchangeTransactions.stream()
                .map(exchangeTransaction -> new ExchangeTransactionDto(
                        exchangeTransaction.getId(),
                        exchangeTransaction.getCustomer().getFirstName() +" "+
                        exchangeTransaction.getCustomer().getLastName(),
                        exchangeTransaction.getCustomer().getId(),
                        exchangeTransaction.getCustomer().getNumber(),
                        exchangeTransaction.getFromCurrency(),
                        exchangeTransaction.getToCurrency(),
                        exchangeTransaction.getFromAmount(),
                        exchangeTransaction.getToAmount(),
                        exchangeTransaction.getBuyingExchangeRate(),
                        exchangeTransaction.getInterest(),
                        exchangeTransaction.getNotes(),
                        exchangeTransaction.getTransactionDate()
                ))
                .toList();

    }

    public Integer getNumberOfExchangeTransactions() {
        User currentUser = getCurrentUser();
        return exchangeTransactionRepository.findAllByCompanyInfo(currentUser.getCompanyInfo()).size();
    }

    public InterestResponse getMonthInterest(InterestDto interestDto) {

        User currentUser = getCurrentUser();
        System.out.println("START = " + interestDto.getStartDate());
        System.out.println("END   = " + interestDto.getEndDate());
        List<ExchangeTransaction> exchangeTransactions = exchangeTransactionRepository.findAllByCompanyInfo(currentUser.getCompanyInfo());

        List<ExchangeTransaction> exchangeTransactions1 =
                exchangeTransactions.stream()
                        .filter(tx ->
                                !tx.getTransactionDate().isBefore(interestDto.getStartDate()) &&
                                        !tx.getTransactionDate().isAfter(interestDto.getEndDate())
                        )
                        .toList();
        InterestResponse interestResponse = new InterestResponse();
        BigDecimal dollarInterest = BigDecimal.ZERO;
        BigDecimal afghaniInterest = BigDecimal.ZERO;
        BigDecimal kaldaraInterest = BigDecimal.ZERO;
        BigDecimal tomanInterest = BigDecimal.ZERO;
        BigDecimal euroInterest = BigDecimal.ZERO;
        for (ExchangeTransaction exchangeTransaction : exchangeTransactions1) {

            BigDecimal interest = exchangeTransaction.getInterest();

            if (interest == null) {
                interest = BigDecimal.ZERO;
            }
            if (exchangeTransaction.getToCurrency() == MoneyType.DOLLAR) {
                dollarInterest = dollarInterest.add(interest);
            } else if (exchangeTransaction.getToCurrency() == MoneyType.AFGHANI) {
                afghaniInterest = afghaniInterest.add(interest);
            }else if (exchangeTransaction.getToCurrency() == MoneyType.KALDARA) {
                kaldaraInterest = kaldaraInterest.add(interest);
            }else if (exchangeTransaction.getToCurrency() == MoneyType.TOMAN) {
                tomanInterest = tomanInterest.add(interest);
            }else if (exchangeTransaction.getToCurrency() == MoneyType.EURO) {
                euroInterest = euroInterest.add(interest);
            }
        }
        interestResponse.setAfghaniInterest(afghaniInterest);
        interestResponse.setKaldaraInterest(kaldaraInterest);
        interestResponse.setTomanInterest(tomanInterest);
        interestResponse.setDollarInterest(dollarInterest);
        interestResponse.setEuroInterest(euroInterest);
        return interestResponse;

    }
    public List<ExchangeTransactionDto> getAllTransactionsOfCustomer(Long customerId) {
        User currentUser = getCurrentUser();
        Customer customer = customerRepository.findByIdAndCompanyInfo(customerId, currentUser.getCompanyInfo()).orElseThrow(() ->
                 new CustomerNotFoundException("Customer not found with id " + customerId));
        List<ExchangeTransaction> exchangeTransactions = exchangeTransactionRepository.findAllByCompanyInfo(currentUser.getCompanyInfo());


        List<ExchangeTransactionDto> exchangeTransactionDtos =  exchangeTransactions.stream().filter(exchangeTransaction -> exchangeTransaction.getCustomer().getId() == customer.getId()).map(exchangeTransaction -> new ExchangeTransactionDto(
                exchangeTransaction.getId(),
                exchangeTransaction.getCustomer().getFirstName() +" "+
                exchangeTransaction.getCustomer().getLastName(),
                exchangeTransaction.getCustomer().getId(),
                exchangeTransaction.getCustomer().getNumber(),
                exchangeTransaction.getFromCurrency(),
                exchangeTransaction.getToCurrency(),
                exchangeTransaction.getFromAmount(),
                exchangeTransaction.getToAmount(),
                exchangeTransaction.getBuyingExchangeRate(),
                exchangeTransaction.getInterest(),
                exchangeTransaction.getNotes(),
                exchangeTransaction.getTransactionDate()
        )).toList();
        return exchangeTransactionDtos;
    }

    public InterestResponse todayInterest() {

        LocalDate today = LocalDate.now();
        User currentUser = getCurrentUser();
        List<ExchangeTransaction> exchangeTransactions =
                exchangeTransactionRepository.findByTransactionDateAndCompanyInfo(today, currentUser.getCompanyInfo());

        BigDecimal dollarInterest = BigDecimal.ZERO;
        BigDecimal afghaniInterest = BigDecimal.ZERO;
        BigDecimal kaldaraInterest = BigDecimal.ZERO;
        BigDecimal tomanInterest = BigDecimal.ZERO;
        BigDecimal euroInterest = BigDecimal.ZERO;

        for (ExchangeTransaction exchangeTransaction : exchangeTransactions) {

            BigDecimal interest = exchangeTransaction.getInterest() == null
                    ? BigDecimal.ZERO
                    : exchangeTransaction.getInterest();

            if (exchangeTransaction.getToCurrency() == MoneyType.DOLLAR) {
                dollarInterest = dollarInterest.add(interest);
            } else if (exchangeTransaction.getToCurrency() == MoneyType.AFGHANI) {
                afghaniInterest = afghaniInterest.add(interest);
            } else if (exchangeTransaction.getToCurrency() == MoneyType.KALDARA) {
                kaldaraInterest = kaldaraInterest.add(interest);
            } else if (exchangeTransaction.getToCurrency() == MoneyType.TOMAN) {
                tomanInterest = tomanInterest.add(interest);
            } else if (exchangeTransaction.getToCurrency() == MoneyType.EURO) {
                euroInterest = euroInterest.add(interest);
            }
        }

        InterestResponse interestResponse = new InterestResponse();
        interestResponse.setDollarInterest(dollarInterest);
        interestResponse.setAfghaniInterest(afghaniInterest);
        interestResponse.setKaldaraInterest(kaldaraInterest);
        interestResponse.setTomanInterest(tomanInterest);
        interestResponse.setEuroInterest(euroInterest);

        return interestResponse;
    }


}
