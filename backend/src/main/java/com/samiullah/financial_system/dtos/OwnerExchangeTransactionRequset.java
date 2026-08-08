package com.samiullah.financial_system.dtos;

import com.samiullah.financial_system.entities.ExchangePartyType;
import com.samiullah.financial_system.entities.MoneyType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OwnerExchangeTransactionRequset {
    @Enumerated(EnumType.STRING)
    private MoneyType fromCurrency;
    @Enumerated(EnumType.STRING)
    private MoneyType toCurrency;
    private BigDecimal fromAmount;
    private Double buyingExchangeRate;
    private Double sellingExchangeRate;
    private String note;
    private LocalDate transactionDate;
}
