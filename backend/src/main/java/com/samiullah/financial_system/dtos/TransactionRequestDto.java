package com.samiullah.financial_system.dtos;

import com.samiullah.financial_system.entities.MoneyType;
import com.samiullah.financial_system.entities.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionRequestDto {
    private TransactionType transactionType;
    private BigDecimal amount;
    private LocalDate transactionDate;
    private long customerId;
    private MoneyType moneyType;
    private String note;

}
