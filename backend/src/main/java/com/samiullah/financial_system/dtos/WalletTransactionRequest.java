package com.samiullah.financial_system.dtos;

import com.samiullah.financial_system.entities.MoneyType;
import com.samiullah.financial_system.entities.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class WalletTransactionRequest {
    private Long walletId;
    private TransactionType transactionType;
    private MoneyType moneyType;
    private BigDecimal amount;
    private String note;
    private LocalDate date;
}
