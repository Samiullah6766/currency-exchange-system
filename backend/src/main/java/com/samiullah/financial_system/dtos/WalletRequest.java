package com.samiullah.financial_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class WalletRequest {
    private BigDecimal kaldaraBalance;
    private BigDecimal dollarBalance;
    private BigDecimal afghaniBalance;
    private BigDecimal tomanBalance;
    private BigDecimal euroBalance;
}
