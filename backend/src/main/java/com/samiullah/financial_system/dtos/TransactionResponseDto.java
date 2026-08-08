package com.samiullah.financial_system.dtos;

import com.samiullah.financial_system.entities.MoneyType;
import com.samiullah.financial_system.entities.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponseDto {
    private Long transactionId;
    private TransactionType transactionType;
    private BigDecimal amount;
    private LocalDate transactionDate;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private MoneyType moneyType;
    private String note;
}
