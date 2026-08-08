package com.samiullah.financial_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerTransactionSummary {
    private List<TransactionResponse> transactions;
    private BigDecimal totalTomanBorrowedAmount;
    private BigDecimal totalTomanReturnedAmount;
    private BigDecimal tomanBalance;
    private BigDecimal totalDollarBorrowedAmount;
    private BigDecimal totalDollarReturnedAmount;
    private BigDecimal dollarBalance;
    private BigDecimal totalAfghaniBorrowedAmount;
    private BigDecimal totalAfghaniReturnedAmount;
    private BigDecimal afghaniBalance;
    private BigDecimal totalKaldaraBorrowedAmount;
    private BigDecimal totalKaldaraReturnedAmount;
    private BigDecimal kaldaraBalance;
    private BigDecimal totalEuroBorrowedAmount;
    private BigDecimal totalEuroReturnedAmount;
    private BigDecimal euroBalance;

}
