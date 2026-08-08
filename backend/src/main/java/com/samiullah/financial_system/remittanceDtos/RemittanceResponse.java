package com.samiullah.financial_system.remittanceDtos;

import com.samiullah.financial_system.entities.MoneyType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RemittanceResponse {
    private Long remittanceId;
    private Integer remittanceCode;
    private String sender;
    private String receiver;
    private MoneyType moneyType;
    private BigDecimal amount;
    private BigDecimal transferFee;
    private String address;
    private String description;
    private String destination;
    private LocalDate date;
    private String senderPhone;
}
