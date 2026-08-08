package com.samiullah.financial_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class InterestResponse {
    private BigDecimal afghaniInterest;
    private BigDecimal dollarInterest;
    private BigDecimal TomanInterest;
    private BigDecimal KaldaraInterest;
    private BigDecimal euroInterest;
}
