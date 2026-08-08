package com.samiullah.financial_system.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class InterestDto {
    private LocalDate startDate;
    private LocalDate endDate;
}
