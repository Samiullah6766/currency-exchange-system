package com.samiullah.financial_system.dtos;

import com.samiullah.financial_system.entities.MoneyType;
import com.samiullah.financial_system.entities.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class WalletTransactionResponse {
    private Long walletTransactionId;
    private Long transactionId;
    private TransactionType transactionType;
    private MoneyType moneyType;
    private BigDecimal amount;
    private String createdBy;
    private String note;
    private LocalDate date;
}
