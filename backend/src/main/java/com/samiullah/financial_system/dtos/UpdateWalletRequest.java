package com.samiullah.financial_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateWalletRequest {

    private String username;
    private String password;

    private BigDecimal afghaniBalance;
    private BigDecimal dollarBalance;
    private BigDecimal tomanBalance;
    private BigDecimal kaldaraBalance;
    private BigDecimal euroBalance;
}
