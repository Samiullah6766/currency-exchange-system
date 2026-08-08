package com.samiullah.financial_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ExchangeTransactionSummary {
    private BigDecimal totalTomanBorrowed;
    private BigDecimal totalAfghaniBorrowed;;
    private BigDecimal totalDollarBorrowed;
    private BigDecimal totalKaldaraBorrowed;
    private BigDecimal totalEuroBorrowed;
}
