package com.samiullah.financial_system.dtos;

import com.samiullah.financial_system.entities.MoneyType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ExchangeTransactionDto {
    private Long id;
    private String customerName;
    private Long customerId;
    private String customerPhoneNumber;
    @Enumerated(EnumType.STRING)
    private MoneyType fromCurrency;
    @Enumerated(EnumType.STRING)
    private MoneyType toCurrency;
    private BigDecimal fromAmount;
    private BigDecimal toAmount;
    private Double buyingExchangeRate;
    private BigDecimal interest;
    private String note;
    private LocalDate transactionDate;
}
