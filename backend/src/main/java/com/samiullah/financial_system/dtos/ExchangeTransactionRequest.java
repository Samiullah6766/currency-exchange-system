package com.samiullah.financial_system.dtos;

import com.samiullah.financial_system.entities.ExchangePartyType;
import com.samiullah.financial_system.entities.MoneyType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
public class ExchangeTransactionRequest {
    private Long customerId;
    private ExchangePartyType partyType;
    @Enumerated(EnumType.STRING)
    private MoneyType fromCurrency;
    @Enumerated(EnumType.STRING)
    private MoneyType toCurrency;
    private BigDecimal fromAmount;
    private double buyingExchangeRate;
    private double sellingExchangeRate;
    private String note;
    private LocalDate transactionDate;
}
