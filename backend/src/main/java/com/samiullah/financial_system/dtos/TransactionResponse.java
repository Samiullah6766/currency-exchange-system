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
public class TransactionResponse {
    private Long transactionId;
    private TransactionType transactionType;
    private BigDecimal amount;
    private LocalDate transactionDate;
    private Long customerId;
    private String customerName;
    private MoneyType moneyType;
    private String note;






}
